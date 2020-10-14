import os
import requests
import datetime

from flask import Flask, request, abort, jsonify

from linebot import (
    LineBotApi, WebhookHandler
)
from linebot.exceptions import (
    InvalidSignatureError
)
from linebot.models import *

app = Flask(__name__)

# Channel Access Token
line_bot_api = LineBotApi('tV4N/t7+k9lnCm1e20Wnn4C5hDWymq9TNEWx+HsVmpbpF7ZHXWXU43b02poAsnp8RJ2nI4nw72lWMw1mPWR01yNM4G1kljqpAK8LOG3uyoV3xy/OMwuiIfmf5F7quGyu4DHjTjv+8rtk+ZtDec7QUwdB04t89/1O/w1cDnyilFU=')
# Channel Secret
handler = WebhookHandler('53ad112732550cf21c8d9bbbcf004f69')

# global variables
table_columns = ['報修者', '報修機器', '情況簡述', '其他建議']
root_url = "http://allway.southeastasia.cloudapp.azure.com/devAllwayApi/"
# rich menus
default_rich_menu_id = None
admin_rich_menu_id = None
rich_menu_list = line_bot_api.get_rich_menu_list()
for menu in rich_menu_list:
    print (menu)
    if menu.name == "default_rich_menu":
        default_rich_menu_id = menu.rich_menu_id
    elif menu.name == "admin_rich_menu":
        admin_rich_menu_id = menu.rich_menu_id

def get_element_from_list(data_list, func):
    for data in data_list:
        if func(data):
            return data
    return None

def get_elements_from_list(data_list, func):
    return_data = []
    for data in data_list:
        if func(data):
            return_data.append(data)
    return return_data

def get_values_from_list(data_list, key):
    return_data = []
    for data in data_list:
        if data[key]:
            return_data.append(data[key])
    return return_data

def check_rich_menu(line_id):
    r = requests.get(root_url+"Api/Repair/ListCustomer")
    if r.status_code == 200:
        customers = r.json()['body']
    else:
        print ("api request failed")
    customer = get_element_from_list(customers, lambda x: x['Line_Id']==line_id)
    if customer:
        if customer['Store_Id'] == 1: # admin
            line_bot_api.link_rich_menu_to_user(line_id, admin_rich_menu_id)
        else:
            line_bot_api.link_rich_menu_to_user(line_id, default_rich_menu_id)
    else:
        line_bot_api.link_rich_menu_to_user(line_id, default_rich_menu_id)


@app.route("/api/fix", methods=['POST'])
def fix():
    status_code = 400
    # order_id = request.values.get('Order_Id')
    print (request.data)
    order_id = request.get_json()['Order_Id']
    print (order_id)
    r = requests.get(root_url+'Api/Repair/GetOrder', params={'Order_Id': order_id})
    print (r.status_code)
    if r.status_code == 200 and r.json()['isSuccess']:
        status_code = r.status_code
        order = r.json()['body']
        customer_num = order['Customer_Num']
    else:
        print ("GetOrder failed")
        return jsonify({'success': False})

    r = requests.get(root_url+"Api/Repair/ListCustomer")
    if r.status_code == 200:
        customers = r.json()['body']
    else:
        print ("api request failed")
        return jsonify({'success': False})
    customer = get_element_from_list(customers, lambda x: x['Customer_Num']==customer_num)
    customers = get_elements_from_list(customers, lambda x: x['Store_Id']==customer['Store_Id'] or x['Store_Id']==1)
    customers_line_id = get_values_from_list(customers, 'Line_Id')

    text = f"編號 {order_id} 的報修單已修理完畢，詳細資訊如下：\n"
    for key, value in order.items():
        text = text + key + '：' + str(value) + '\n'

    line_bot_api.multicast(customers_line_id, TextSendMessage(text=text))
    return jsonify({'success': True})

# 監聽所有來自 /callback 的 Post Request
@app.route("/callback", methods=['POST'])
def callback():
    # get X-Line-Signature header value
    signature = request.headers['X-Line-Signature']
    # get request body as text
    body = request.get_data(as_text=True)
    app.logger.info("Request body: " + body)
    # handle webhook body
    try:
        handler.handle(body, signature)
    except InvalidSignatureError:
        abort(400)
    return 'OK'

# 處理訊息
@handler.add(MessageEvent, message=TextMessage)
def handle_message(event):
    check_rich_menu(event.source.user_id)
    # 沒辦法直接用line_id搜，所以先拉客戶資料再query
    r = requests.get(root_url+"Api/Repair/ListCustomer")
    if r.status_code == 200:
        customers = r.json()['body']
    else:
        print ("api request failed")
    
    customer = get_element_from_list(customers, lambda x: x['Line_Id']==event.source.user_id)
    # 如果Line_Id搜不到，檢查該訊息是不是傳password
    if not customer:
        auth_customer = get_element_from_list(customers, lambda x: x['Password']==event.message.text)
        # 找到password的話把修改該用戶的Line_Id
        if auth_customer:
            data = {'Customer_Id': auth_customer['Customer_Id'],"Password": auth_customer['Password'], 'Line_Id': event.source.user_id}
            r = requests.put(root_url+'Api/Repair/UpdateCustomerLineId', data=data)
            line_bot_api.reply_message(event.reply_token, TextSendMessage(text=f"歡迎使用奈斯派索報修系統！您的個人資料如下：\n{auth_customer}"))
        # 否則請他輸入password
        else:
            line_bot_api.reply_message(event.reply_token, TextSendMessage(text="您好！\n初次使用奈斯派索報修系統者，請輸入公司所提供之認證編號："))
    else:
        # 報修前端會處理，只要負責把訊息發給同公司的用戶和管理者就好
        # 訊息格式：已完成報修，送出報修單時間: 2020-08-10 10:40:09
        message = event.message.text
        if (message.startswith("已完成報修，送出報修單時間: ")):
            datetime_str = message[15:]
            datetime_str = datetime_str[:10] + 'T' + datetime_str[11:]
            # time = datetime.datetime.strptime(datetime_str, '%Y-%m-%d %H:%M:%S')
            r = requests.get(root_url+'Api/Repair/ListOrder', params={})
            if r.status_code == 200:
                orders = r.json()['body']
            else:
                print ("ListOrder failed")
            order = get_element_from_list(orders, lambda x: x['Order_DateTime']==datetime_str and x['Customer_Id']==customer['Customer_Id'])
            # 把訊息發給同公司的用戶和管理者
            store_id = customer['Store_Id']
            customer_name = customer['Customer_Name']
            users = get_elements_from_list(customers, lambda x: x['Store_Id']==store_id or x['Store_Id']==1)
            auth_users_line_id = get_values_from_list(customers, 'Line_Id')
            if len(auth_users_line_id) > 0:
                text = f"已收到{customer_name}的報修單，詳細資訊如下：\n"
                for key, value in order.items():
                    text = text + key + '：' + str(value) + '\n'
                line_bot_api.multicast(auth_users_line_id, TextSendMessage(text=text))

@handler.add(PostbackEvent)
def handle_postback(event):
   pass

@handler.add(FollowEvent)
def handle_follow(event):
    line_id = event.source.user_id
    check_rich_menu(line_id)
    line_bot_api.reply_message(event.reply_token, TextSendMessage(text="您好！\n初次使用奈斯派索報修系統者，請輸入公司所提供之認證編號："))

@handler.add(UnfollowEvent)
def handle_unfollow(event):
    pass



if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
