const boolean = require('joi/lib/types/boolean');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userServices = new Schema({
    userId:{
        type:String,
        required:true
    },
   carId: {
        type: String,
        required: true
    },
    plan: {
        type: {
            type: String,
            required: true
        },
        validity: {
            type: String,
            required: true
        }
 } ,
    addressId: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        required:true
       
    }
})



const user = mongoose.model('userService', userServices)
module.exports = user

