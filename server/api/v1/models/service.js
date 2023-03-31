const mongoose = require('mongoose')
const Schema = mongoose.Schema
const plansSchema = new Schema({
    cartype: {
        type: String,
        required: true
    },
    plans: [{
        type: {
            type:"string",
            required:true
        },
        month: {
            type: String,
            required: true
        },
        year: {
            type: String,
            required: true
        }

    }


    ]
}

)
const model = mongoose.model('car-service-plans', plansSchema);
module.exports = model;



