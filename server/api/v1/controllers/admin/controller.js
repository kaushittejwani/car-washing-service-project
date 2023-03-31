
import Boom from 'boom';
import _ from 'lodash';
import Request from 'request';
import xl from 'node-xlsx';
import Path from 'path';
import Config from 'config';
import Mongoose from 'mongoose';

import { generateJwt } from '../../../../helper/passportStrategy';
import mailer from '../../../../helper/mailer';
import {
    encryptString,
    decryptString,
} from '../../../../helper/util';

const users = require('../../models/user')
const joi = require('joi');
const servicePlans = require('../../models/service');
const jwt = require('jsonwebtoken');

export class AdminController {
    //create plans
    async createPlans(req, res) {
        const carType = req.body.carType
        const planSchema = joi.object({
            carType: joi.string().required(),
            plans: joi.array().required(),

        }
        )



        const { error, value } = planSchema.validate(req.body, { abortEarly: false })
        if (error) {
            return res.status(406).send(error.details)
        }

        const car = await servicePlans.findOne({ carType: carType });
        if (car) {
            return res.status(402).json({
                success: false,
                error: "the car are already exist"
            })
        }
        const plans = new servicePlans(req.body)
        await plans.save().then((plans) => {
            return res.status(201).json({
                plans: plans,
                success: true,
                message: "plans registrerd successfully"
            })


        }).catch((error) => {
            return res.status(403).json({
                error: error

            })
        })
    }

    //show all plans
    async showPlans(req, res) {
     await servicePlans.find({}).then((plans) => {
            return res.status(200).send(plans)
        }).catch((error) => {
            res.status(402).json({
                error: error
            })
        })

    }

    //delete plan
    async deletePlan(req, res) {
    const planId = await servicePlans.findOne({ "plans._id": objectId })
        if (!planId) {
            return res.status(406).json({
                success: false,
                error: "plan is not exist"
            })
        }
        const plan = await servicePlans.findOneAndUpdate({ carType: req.params.carType }, {

            $pull: {
                plans: { _id: objectId }
            }
        })

        if (plan) {
            return res.status(200).json({
                success: true,
                message: "plan deleted successfully",
                plan: plan

            })
        }
        else {
            res.status(402).json({
                status: false,
                error: "car  is not exist"
            })
        }

    }

    //delete car
    async deleteCar(req, res) {
        const car = await servicePlans.findOne({ carType: req.params.carType })
        if (car) {
            const deleteCar = await servicePlans.deleteOne({ carType: req.params.carType })
            if (deleteCar) {
                return res.status(200).json({
                    success: true,
                    message: "car deleted successfully",

                })
            }
        } else {
            return res.status(402).json({
                success: false,
                error: "car is not exist"
            })
        }
    }


    //update single plan
    async updatePlan(req, res) {
        const carPlan = await servicePlans.findOneAndUpdate({ carType: req.params.carType, 'plans._id': req.params._id }, {
            $set: {
                'plans.$': req.body
            }
        })
        if (carPlan) {
            return res.status(200).json({
                success: true,
                message: "plans updated successfully",
                carPlan: carPlan


            })
        }
        else {
            res.status(402).json({
                success: false,
                error: "car or plan is not exist"
            })
        }




    }



}












export default new AdminController();
