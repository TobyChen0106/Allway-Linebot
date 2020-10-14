const axios = require("axios");

// util function
const pad = (n, width, z) => {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

let timeNow = new Date();
timeNow.setHours(-8);
const y = timeNow.getFullYear();
const m = pad(timeNow.getMonth() + 1, 2);
const d = pad(timeNow.getDate(), 2);
const h = pad(timeNow.getHours(), 2);
const mi = pad(timeNow.getMinutes(), 2);
const s = pad(timeNow.getSeconds(), 2);
const timeStamp = `${y}-${m}-${d} ${h}:${mi}:${s}`;
console.log(timeStamp)
axios.post('http://allway.southeastasia.cloudapp.azure.com/devAllwayApi/Api/Repair/CreateOrder',
    {
        // Order_DateTime: timeStamp,
        Customer_Id: 1,
        Device_Id: 1,
        Problem_Id: 1,
        Exception: ""
    }
).then(
    res => res
).then(data => {
    // data.timeStamp = timeStamp;
    console.log(data)
}).catch(error => console.log("ERROR!", error.response));