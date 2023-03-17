import FcmPush from 'fcm-push';
import Config from 'config';
import httpRequest from 'request';
import errResponse from '../api/v1/models/errResponse';
import userService from '../api/v1/services/user.services';

const serverKey = Config.get('fcmServerKey');
const fcm = new FcmPush(serverKey);

/**
 * sendPush - Method to send push notification on both Android & IOS using FCM
 * @param {Object} payload - details to send in push notification
 * @param {function} cb - callback function
 */

const sendPush = (payload, cb) => {
    const message = {
        to: payload.deviceToken,
        collapse_key: "AIzaSyCONmSYoBhXvd7vWG_IY2c_hcTbp10-Pgc",//payload.collapse_key,
        data: payload.data,
        notification: {
            title:payload.title,
            body: payload.body,
        },
    };

    fcm.send(message, cb);
};

const sendPushToUser = (mobile,payload) => {
    const query = {mobile:mobile};
    const project = {device:1}
    userService.find(query,project,(err,data)=>{
        if(!err){
            payload['deviceToken'] = data.device.deviceToken;
            sendPush(payload);
        }
    })
}
const sendSms = (payload) => {
    console.log('sms payload',payload)
    const {
        mobile,
        text
    } = payload;

    const base_url = Config.get('sms_base_url');
    let finalUrl = `${base_url}&to=${mobile}&from=MAXBUP&text=${text}&dlr-mask=19&dlr-url`;
    httpRequest.get(finalUrl, (error, res, body) => {
        console.log('error SMS trigger',error);
    });

}
module.exports = {
    sendPush,
    sendSms,
    sendPushToUser,
};
