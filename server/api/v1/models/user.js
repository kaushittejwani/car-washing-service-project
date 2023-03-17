const mongoose = require('mongoose');
const schema = mongoose.Schema
const bcrypt = require('bcryptjs');
const joi = require('joi');

const userSchema = new schema({
    userName: {
        type: String,
        required: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    mobile: {
        mobileNo: {
            type: Number,
            required: true,
        },
        countryCode: {
            type: String,
            required: true

        }
    },
    address: [{
        street: {
            type: String,
            required: true
        },
        area: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        cordinates: {
            type: [Number]
        }
    }],
    isAdmin: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
    }
}, { timestamps: true }
)
userSchema.pre("save", async function (next) {
    // const passwordHash= await bcrypt.hash(req.body.password,10);
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10)

        // const passwordCompare=await bcrypt.compare(req.body.password,req.body.confirmPassword)
    }
    next();

})
module.exports = mongoose.model('users', userSchema);

