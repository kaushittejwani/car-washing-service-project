const jwt = require('jsonwebtoken');
const auth = (req, res, next) => {
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
        next()
    } catch (error) {
        res.status(401).json({
            message:"unauhtorized user",
            error:"invalid token"

        })
    }
}
const adminAuth = (req, res, next)=>{
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

    next()
    } catch (error) {
        res.status(401).json({
            error: error

        })
    }
}


module.exports = auth ,adminAuth