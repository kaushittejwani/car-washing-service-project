

const users = require('../../models/user');
const service = require('../../../../common/server');
const legit = require('legit');
const jwt = require('jsonwebtoken');
const validatePhoneNumber = require('validate-phone-number-node-js');
const { phone } = require('phone');
const joi = require('joi');
const bcrypt = require('bcryptjs')
const carSchema = require('../../models/car');
const servicePlans = require('../../models/service')
const userServices = require('../../models/userServices');
const  session= require('express-session')
export class UserController {

    signup(req, res) {
        const signupSchema = joi.object({
            userName: joi.string().required(),
            email: joi.string().email().required(),
            mobile: {
                mobileNo: joi.number().required(),
                countryCode: joi.string().required()
            },
            address: joi.array().required(),
            isAdmin: joi.boolean(),
            password: joi.string().required(),

        })

        async function signup() {
            const { error, value } = signupSchema.validate(req.body, { abortEarly: false })
            if (error) {
                return res.status(402).json(error.details)
            }

            const mobileno = validatePhoneNumber.validate(req.body.mobile.mobileNo);

            if (!mobileno) {
                return res.status(402).send("the mobile no are not exist or invalid")
            }


            const mobile = phone(req.body.mobile.mobileNo)
            if (!mobile) {
                return res.status(402).send("the countrycode  is not valid ,car wash service are now available only in india so plase type +91 in the filed of country code")
            }

            const user = await users.findOne({ $or: [{ userName: req.body.userName }, { email: req.body.email }, { mobileNo: req.body.mobile.mobileNo }] })
            if (user) {
                return res.status(403).end("the user is already exist,please try another username or email or mobileNo")
            }
            await legit(req.body.email)
                .then(async result => {

                    if (result.isValid) {
                        const {email}=req.body
                        const customer = await stripe.addNewCustomer(email)
                        req.session.customerId=customer
                        
                        
                        const user = new users(req.body)

                        result = await user.save()


                        //stripe payment

                        

                       


                        var payload = {
                            username: user.userName,
                            _id: user._id,
                            email: user.email,
                            mobileno: user.mobile.mobileNo,
                            address: user.address
                        }
                        const token = jwt.sign(payload, "rANDOMSTRIGN", { expiresIn: "365d" })
                        return res.status(201).send({
                            success: true,
                            message: "user successfully registerd",
                            customer: customer,
                            user: {
                                username: user.userName,
                                email: user.email,
                                mobileNo: user.mobile.mobileNo,
                                password: user.password,
                                user_id: user._id,
                                token: "Bearer " + token,
                            }

                        }
                        )


                    }
                    else {
                        return res.json({
                            success: false,
                            message: "invalid email"
                        })
                    }


                })


        }
        signup();



        //login


    }

    //login
    login(req, res) {

        const loginSchema = joi.object({
            email: joi.string().email().required(),
            password: joi.string().required()
        })

        const { error, value } = loginSchema.validate(req.body, { abortEarly: false })
        if (error) {
            return res.status(402).json({ error: error.details })

        }
        users.findOne({ email: req.body.email }).then(user => {
            if (!user) {
                return res.status(401).send({
                    success: false,
                    message: "user does not exist"
                })
            }
            const passwordCheck = bcrypt.compareSync(req.body.password, user.password)
            if (!passwordCheck) {
                console.log(passwordCheck)
                return res.status(403).send({
                    success: false,
                    message: "Invalid email or password"
                })

            }
          
            var payload = {
                username: user.userName,
                _id: user._id,
                email: user.email,
                mobileno: user.mobile.mobileNo,
                address: user.address
            }
            const token = jwt.sign(payload, "rANDOMSTRIGN", { expiresIn: "300000000000000000" })
           
            return res.status(200).json({
                success: true,
                message: "logged in successfully",
                token: "Bearer " + token
            })
        })
    }

    //update Address


    async update(req, res) {
        const updateSchema = joi.object({
            _id: joi.string().required(),
            street: joi.string().optional(),
            area: joi.string().optional(),
            city: joi.string().optional(),
            state: joi.string().optional(),
            cordinates: joi.array().optional(),
        })
        const { error, value } = updateSchema.validate(req.body, { abortEarly: false })
        if (error) {
            return res.status(401).json({ error: error.details })
        }

        const { _id, ...updateObject } = req.body;

        Object.keys(updateObject).forEach(key => {
            updateObject[`address.$.${key}`] = updateObject[key];
            delete updateObject[key];
        });

        const user = await users.findOneAndUpdate({
            'address._id': _id, _id: req.user.id
        }, updateObject, { new: true })

        res.status(200).json({
            status: true,
            message: "updated successfully",
            user: user,
        });
    }







    //delete address
    async delete(req, res) {
        const address = await users.findOne({ _id: req.user.id, 'address': { $elemMatch: { _id: req.params._id } } });
        if (!address) {
            return res.status(402).json({
                success: false,
                message: "address does not exist"
            })
        }

        await users.findOneAndUpdate({ _id: req.user.id }, {
            $pull: {
                address: { _id: req.params._id }
            }
        }).then(async (user) => {
            // TODO: Update all the services.
            await userServices.updateMany({ userId: req.user.id, addressId: req.params._id }, {
                $set: {
                    isActive: false
                }
            }).then(() => {
                return res.status(200).json({
                    success: true,
                    message: "successfully delete address",
                    user: user
                })

            }).catch(() => {
                return res.status(402).json({
                    error: error
                })
            })

        }).catch((error) => {
            return res.status(402).send({
                error: error
            })
        })


    }

    //add address
    async addAddress(req, res) {
        const addAddressSchema = joi.object({
            street: joi.string().required(),
            area: joi.string().required(),
            city: joi.string().required(),
            state: joi.string().required()

        })
        const { error, value } = addAddressSchema.validate(req.body, { abortEarly: false })
        if (error) {
            return res.status(401).json({ error: error.details })
        }

        //find id and update
        const addaddress = req.body
        await users.findOneAndUpdate({ _id: req.user.id}, {
            $push: {
                address: addaddress
            }
        }).then((user) => {
            return res.status(200).send({
                status: true,
                message: "successfully add address",
            })
        }).catch((error) => {
            return res.status(402).send({
                error: error
            })
        })

    }

    async carRegistration(req, res) {
        const registration = joi.object({
            carModel: joi.string().required(),
            carNumber: joi.number().required(),
            carType: joi.string().valid("muv", "suv", "sedan").required(),
            addressId: joi.string().required()
        })

        // TODO: Remove findOne user. Remove carModel if condition
        const { error, value } = registration.validate(req.body, { abortEarly: false })
        if (error) {
            return res.status(402).json({ error: error.details })
        }
        // const user = await users.findOne({ _id: req.userId })
        // if (!user) {
        //     return res.status(401).json({ success: false, message: "user not exist " })
        // }
        const carNumber = req.body.carNumber
        if (carNumber.length > 4) {
            return res.status(402).send("Car number are not valid ,car number must be in 4 digit")
        }
        const car = await carSchema.findOne({ carNumber: carNumber })
        if (car) {
            return res.status(406).json({
                success: false,
                message: "the car is already registerd"
            })
        }
        const carType = req.body.carType

        const registerCar = new carSchema({
            carModel: req.body.carId,
            carNumber: req.body.carNumber,
            carType: req.body.carType,
            addressId: req.body.addressId,
            userId: req.user.id
        })
        await registerCar.save().then((car) => {
            return res.status(201).json({
                success: true,
                message: "car registration successfully",
                car: car
            })

        }).catch((error) => {
            return res.status(403).json({
                error: error
            })
        })




    }

    async plansByCarType(req, res) {
        const carType = req.params.carType
        const user = await users.findOne({ _id: req.user.id })
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "user  not exist "
            })

        } const car = await servicePlans.findOne({ carType: carType })
        if (car) {

            return res.status(200).json({
                success: true,
                car: car
            })
        }
        else {
            return res.status(402).json({
                success: false,
                message: "car is not exist"
            })
        }

    }




    async selectService(req, res) {
        const selectSchema = joi.object({

            carId: joi.string().required(),

            plan: {
                type: joi.string().required(),
                validity: joi.string().required()
            },
            addressId: joi.string().required()
        })
        const { error, value } = selectSchema.validate(req.body, { abortEarly: false })
        console.log(value);
        if (error) {
            return res.status(402).json({
                error: error.details
            })
        }
        // const user = await users.findOne({ _id: req.userId })
        // if (!user) {
        //     return res.status(403).json({
        //         success: false,
        //         message: "user is not exist"
        //     })
        // }
        const car = await servicePlans.findOne({ _id: req.body.carId })
        if (!car) {
            return res.status(403).json({
                success: false,
                message: "car  not exist"
            })
        }
        const carService = await userServices.findOne({ carId: req.body.carId, type: req.body.type })
        if (carService) {
            return res.status(200).json({
                success: false,
                message: "car or type is already exist",
            })
        }
        const carServices = new userServices({
            userId: req.user.id,
            carId: req.body.carId,
            plan: req.body.plan,
            addressId: req.body.addressId,
            isActive: true
        })

        await carServices.save().then((carService) => {
            return res.status(201).json({
                success: true,
                message: "service registerd successfully",
                carService: carService
            })

        }).catch((error) => {
            return res.status(403).json({
                error: error
            })
        })
    }

    async cancelService(req, res) {
        const user = await userServices.findOne({ userId: req.user.id, id: req.params._id })
        if (!user.isActive) {
            return res.status(200).json({
                success: false,
                message: "service is already inActive",

            })
        }
        const updateUser = await userServices.updateMany({ userId: req.user.id, _id: req.params._id }, {
            $set: {
                isActive: false
            }
        }).then(() => {
            return res.status(200).json({
                success: true,
                message: "service cancel successfully",
                updateUser: updateUser

            })
        }).catch((error) => {
            return res.status(403).json({
                error: error
            })

        })
    }

    async getServices(req, res) {

        const serviceSchema = joi.object({
            status: joi.boolean().optional()
        })
        const { error, value } = serviceSchema.validate(req.body, { abortEarly: false })
        if (error) {
            return res.status(402).json({
                error: error.details
            })
        }

        const status = req.params.status
        const service = await userServices.find({ userId: req.user.id, isActive: status })
        if (!service) {
            return res.status(402).json({
                success: false,
                message: "user or status does not exist "
            })
        }
        else if (status == true) {
            const service = await userServices.find({ userId: req.user.id, isActive: true })
            return res.status(200).json({
                success: true,
                service: service
            })
        }
        else if (status == false) {
            const service = await userServices.find({ userId: req.user.id, isActive: false })
            return res.status(200).json({
                success: true,
                service: service
            })
        }
        else {
            const service = await userServices.find({ userId: req.user.id })
            return res.status(200).json({
                success: true,
                service: service
            })
        }

    }













}





export default new UserController();
