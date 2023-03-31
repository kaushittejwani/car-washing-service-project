const jwt = require('jsonwebtoken');
const users= require('./server/api/v1/models/user')
const auth = async(req, res, next) => {
    try {
        const BearerToken = req.headers.authorization;
        if (!BearerToken) {
            return res.status(401).json({
                error: {
                    message: "Unauthorized user",
                    required: "token is required"
                }
            })
        }
        const token = BearerToken.slice(7)
        const decodeToken = jwt.decode(token);
        req.userId = decodeToken._id;
        const user =await users.findOne({_id:req.userId})
        next()
    } catch (error) {
        res.status(401).json({
            message:"unauhtorized user",
            error:"invalid token"

        })
    }
}
const adminAuth = async(req, res, next)=>{
    try {
        const BearerToken = req.headers.authorization;
        if (!BearerToken) {
            return res.status(401).json({
                error: {
                    message: "Unauthorized user",
                    required: "token is required"
                }
            })
        }
        const token = BearerToken.slice(7)
        const decodeToken = jwt.decode(token);
        req.userId = decodeToken._id;
        const admin = await users.findOne({ _id: req.userId })
        if (!admin.isAdmin) {
            return res.status(404).json({ success: false, error: "only the admin is able to create car service plans" })
        }

    next()
    } catch (error) {
        res.status(401).json({
            error: error

        })
    }
}


module.exports = auth ,adminAuth