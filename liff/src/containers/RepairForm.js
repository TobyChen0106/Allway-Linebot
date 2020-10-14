import React, { Component } from 'react';
import './RepairForm.css'
//images
import autopass_image from '../images/autopass-logo.png'

// material-UI

//loading
import ReactLoading from 'react-loading';

// components
import Form from '../components/Form';
import AppTitle from '../components/AppTitle';
import UserInfoCard from '../components/UserInfoCard';
import UserNotValid from '../components/UserNotValid';
import axios from 'axios'

// util function
const pad = (n, width, z) => {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

// Liff
const liff = window.liff;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // profile: undefined,

            displayName: "親愛的用戶",
            userId: "",
            pictureUrl: "",
            Store_Name: "",
            Customer_Name: "",
            Customer_Mobile: "",
            Customer_Email: "",
            Customer_Id: "",
            problemList: [],
            customerMachineList: [],
            loadingUser: true,
            loadingProblem: true,
            userValid: false,

            Device_Id: "",
            Problem_Id: "",
            Exception: ""
        };

    }

    componentDidMount() {
        // const profile = {
        //     displayName: "柏志",
        //     userId: "test_line_id",
        //     pictureUrl: "https://d.newsweek.com/en/full/1192199/avatar-sigourney-weaver-avatar-sequels.jpg?w=1600&h=1600&q=88&f=d41aed8821112924083487cf75761f49",
        // }
        liff.init({ liffId: '1654207080-9E5Ba1vl' }).then(() => {
            if (!liff.isLoggedIn()) {
                liff.login({ redirectUri: "https://allway-liff-app.herokuapp.com/" });
            }
        }).then(
            () => liff.getProfile()
        ).then((profile) => {
            if (!profile) {
                // loading line user profile error
                window.alert("USER PROFILE ERROR!");
            } else {
                this.setState({
                    displayName: profile.displayName,
                    userId: profile.userId,
                    pictureUrl: profile.pictureUrl,
                    loading: false
                });

                axios.get('/api/ListCustomer').then(
                    res => res.data
                ).then(data => {
                    if (data.isSuccess) {
                        this.setState({ customerList: data.body });
                        for (let i = 0; i < data.body.length; ++i) {
                            if (data.body[i].Line_Id === profile.userId) {
                                this.setState({
                                    userValid: true,
                                    Store_Name: data.body[i].Store_Name,
                                    Customer_Name: data.body[i].Customer_Name,
                                    Customer_Mobile: data.body[i].Customer_Mobile,
                                    Customer_Email: data.body[i].Customer_Email,
                                    Customer_Id: data.body[i].Customer_Id,
                                })
                                return data.body[i].Customer_Id
                            }
                        }
                    } else {
                        // loading ListCustomer error
                        return null;
                    }
                }).then(Customer_Id => {
                    let customerMachineList = [];
                    axios.get('/api/ListDevice').then(
                        res => res.data
                    ).then(data => {
                        if (data.isSuccess) {
                            for (let i = 0; i < data.body.length; ++i) {
                                if (data.body[i].Customer_Id_1 === Customer_Id || data.body[i].Customer_Id_2 === Customer_Id || data.body[i].Customer_Id_3 === Customer_Id) {
                                    customerMachineList.push(data.body[i]);
                                }
                            }
                            this.setState({ customerMachineList: customerMachineList, customerList: data.body, loadingUser: false });
                        } else {
                            // loading ListDevice error
                        }
                    }).catch(error => console.log(error));
                }).catch(error => console.log(error));
            }
        }).then(() => {
            this.setState({ loading: false });
        });

        axios.get('/api/ListProblem').then(
            res => res.data
        ).then(data => {
            if (data.isSuccess) {
                this.setState({ problemList: data.body, loadingProblem: false });
            } else {
                // loading ListProblem error
            }
        }).catch(error => console.log(error));

    }

    formOnSubmit = () => {
        if (!this.state.Device_Id || !this.state.Problem_Id) {
            window.alert("請輸入必填項目!");
        } else {
            if (this.state.OS === 'web') {
                liff.logout();
            }
            else {
                let timeNow = new Date();
                const y = timeNow.getFullYear();
                const m = pad(timeNow.getMonth() + 1, 2);
                const d = pad(timeNow.getDate(), 2);
                const h = pad(timeNow.getHours(), 2);
                const mi = pad(timeNow.getMinutes(), 2);
                const s = pad(timeNow.getSeconds(), 2);
                const timeStamp = `${y}-${m}-${d} ${h}:${mi}:${s}`;

                axios.post('/api/CreateOrder',
                    {
                        Order_DateTime: timeStamp,
                        Customer_Id: this.state.Customer_Id,
                        Device_Id: this.state.Device_Id,
                        Problem_Id: this.state.Problem_Id,
                        Exception: this.state.Exception
                    }
                ).then(
                    res => res.data
                ).then(data => {
                    if (data.isSuccess && data.body === true) {
                        liff.sendMessages([{
                            type: 'text',
                            text: `已完成報修，送出報修單時間: ${timeStamp}`
                        }]).catch(function (error) {
                            window.alert("Error sending message: " + error);
                        }).then(() => {
                            liff.closeWindow();
                        });
                    } else {
                        // POST request error
                    }
                }).catch(error => console.log(error));
            }
        }
    }

    handleTextareaChange = (changedState) => {
        this.setState(changedState);
    }

    render() {
        if (this.state.loadingUser || this.state.loadingProblem) {
            return (
                <div className="my-loading">
                    <ReactLoading type={'balls'} color={'#0068b9'} height={'20vh'} width={'20vw'} />
                </div>)
        }
        else if(this.state.userValid){
            return (
                <div className="select-cards-container">
                    <UserInfoCard
                        displayName={this.state.displayName}
                        pictureUrl={this.state.pictureUrl}
                        Store_Name={this.state.Store_Name}
                        Customer_Name={this.state.Customer_Name}
                        Customer_Mobile={this.state.Customer_Mobile}
                        Customer_Email={this.state.Customer_Email}
                    />
                    <Form
                        handleTextareaChange={this.handleTextareaChange}
                        customerMachineList={this.state.customerMachineList}
                        problemList={this.state.problemList}
                        formOnSubmit={this.formOnSubmit}
                    />
                </div>
            );
        }else{
            return (
                <div className="select-cards-container">
                    <UserNotValid/>
                </div>
            )
        }
    }
}
export default App;
