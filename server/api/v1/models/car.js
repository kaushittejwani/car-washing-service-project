const mongoose = require('mongoose');
const schema = mongoose.Schema
const bcrypt = require('bcryptjs');
const joi = require('joi');
var session=require('express-session');   

const serviceSchema = new schema({
    carModel: {
        type: String,
        required: true,
        lowercase: true
    },
    carNumber: {
        type: Number,
        required: true,
    },
     carType:{
        type:String,
        required:true
     },
     addressId:{
        type:String,
        required:true
     },
     userId:{
        type:String,
        required:true
     }

   
}, { timestamps: true }
)

module.exports = mongoose.model('car-registration', serviceSchema);

