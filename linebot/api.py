import os

from linebot import (
    LineBotApi, WebhookHandler
)
from linebot.exceptions import (
    InvalidSignatureError
)
from linebot.models import *


# Channel Access Token
line_bot_api = LineBotApi('tV4N/t7+k9lnCm1e20Wnn4C5hDWymq9TNEWx+HsVmpbpF7ZHXWXU43b02poAsnp8RJ2nI4nw72lWMw1mPWR01yNM4G1kljqpAK8LOG3uyoV3xy/OMwuiIfmf5F7quGyu4DHjTjv+8rtk+ZtDec7QUwdB04t89/1O/w1cDnyilFU=')

if __name__ == "__main__":

    # RichMenu test
    # Delete all RichMenus
    menu_list = line_bot_api.get_rich_menu_list()
    for menu in menu_list:
        line_bot_api.delete_rich_menu(menu.rich_menu_id)

    # Create admin rich menu
    admin_rich_menu = RichMenu(
        size=RichMenuSize(width=2500, height=1600),
        selected=True,
        name="admin_rich_menu",
        chat_bar_text="Tap here",
        areas=[
            RichMenuArea(
            bounds=RichMenuBounds(x=59, y=75, width=780, height=1450),
            action=URIAction(uri="https://line.me/R/ti/p/%40002mppuu")),
            RichMenuArea(
            bounds=RichMenuBounds(x=892, y=75, width=750, height=700),
            action=URIAction(uri="https://www.nespresso.com")),
            RichMenuArea(
            bounds=RichMenuBounds(x=1689, y=75, width=750, height=700),
            action=URIAction(uri="https://www.nespresso.com/pro/tw/zh/home")),
            RichMenuArea(
            bounds=RichMenuBounds(x=892, y=825, width=750, height=700),
            action=URIAction(uri="https://liff.line.me/1654207080-9E5Ba1vl")),
            RichMenuArea(
            bounds=RichMenuBounds(x=1689, y=825, width=750, height=700),
            action=URIAction(uri="http://allway.southeastasia.cloudapp.azure.com/devallwayweb/interface.html")),
        ]
    )
    rich_menu_id = line_bot_api.create_rich_menu(rich_menu=admin_rich_menu)
    with open(os.path.join('images', 'richmenu2.jpg'), 'rb') as f:
        try:
            line_bot_api.set_rich_menu_image(rich_menu_id, 'image/jpeg', f)
        except Exception as e:
            print (e)
    

    # Create default rich menu
    default_rich_menu = RichMenu(
        size=RichMenuSize(width=2500, height=1600),
        selected=True,
        name="default_rich_menu",
        chat_bar_text="Tap here",
        areas=[
            RichMenuArea(
            bounds=RichMenuBounds(x=59, y=75, width=780, height=1450),
            action=URIAction(uri="https://line.me/R/ti/p/%40002mppuu")),
            RichMenuArea(
            bounds=RichMenuBounds(x=892, y=75, width=750, height=700),
            action=URIAction(uri="https://www.nespresso.com")),
            RichMenuArea(
            bounds=RichMenuBounds(x=1689, y=75, width=750, height=700),
            action=URIAction(uri="https://www.nespresso.com/pro/tw/zh/home")),
            RichMenuArea(
            bounds=RichMenuBounds(x=892, y=825, width=750, height=700),
            action=URIAction(uri="https://liff.line.me/1654207080-9E5Ba1vl")),
            RichMenuArea(
            bounds=RichMenuBounds(x=1689, y=825, width=750, height=700),
            action=MessageAction(text="不好意思，只有管理員能使用這項功能喔！"))
        ]
    )
    rich_menu_id = line_bot_api.create_rich_menu(rich_menu=default_rich_menu)
    with open(os.path.join('images', 'richmenu3.jpg'), 'rb') as f:
        try:
            line_bot_api.set_rich_menu_image(rich_menu_id, 'image/jpeg', f)
        except Exception as e:
            print (e)
    line_bot_api.set_default_rich_menu(rich_menu_id)

    print (line_bot_api.get_rich_menu_list())