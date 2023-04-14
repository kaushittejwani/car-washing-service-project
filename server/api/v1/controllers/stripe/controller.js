import sessions from 'express-session';
import subscriptions from 'razorpay/dist/resources/subscriptions';
const users = require('../../models/user')
const joi = require('joi');
const carRegistration = require('../../models/car')
require('dotenv').config();
const stripe = require('stripe')(process.env.secretKey);
export class paymentGateway {

  async generateCheckoutUrl(req, res) {
    try {
      const plan = joi.object({
        price: joi.string().required(),
        carId: joi.string().required()
      });
      const { error, value } = plan.validate(req.body, { abortEarly: false });
      if (error) {
        return res.status(402).json(error.details);
      }
      const car = await carRegistration.findOne({ userId: req.user.id, carId: req.body.carID })
      if (!car) {
        return res.json({
          success: false,
          error: "car not found"
        })
      }
      const sessionObject = {
        line_items: [
          {
            price: req.body.price,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `https://www.google.com`,
        cancel_url: `http://www.google.com`,
        metadata: {
          carId: req.body.carId
        },
        subscription_data: {
          metadata: {
            carId: req.body.carId
          }
        }
      }
      if (req.user.customer) {
        sessionObject.customer = req.user.customer;
      }
      else {
        sessionObject.customer_email = req.user.email
      }
      var session = await stripe.checkout.sessions.create(sessionObject)
      return res.status(200).send(session)
    } catch (error) {
      return res.status(404).send(error.message)
    }
  }

  async saveCustomerIdWebhook(req, res) {
    const { data } = req.body
    const user = await users.findOne({ email: data.object.email })
    if (user) {
      {
        await users.findOneAndUpdate({ email: data.object.email }, {
          $set: {
            customer: data.object.id
          }
        }).then((user) => {
          return res.status(200).json({
            message: 'update successfully',
            user: user
          })
        }).catch((err) => {
          return res.status(402).json({
            err: err
          })
        })

      }
    }
    else {
      return res.status(404).json({
        err: " user does not exisr"
      })
    }
  }

  async subscriptionUpdatedWebhook(req, res) {
    const { data } = req.body
    const user = await carRegistration.findOneAndUpdate({ _id: data.object.metadata.carId },
      {
        $set: {
          plan:
          {
            plan: data.object.plan.metadata.plan,
            priceId: data.object.plan.id,

          }
        }
      }).then((user) => {
        return res.status(200).json({
          success: true,
          message: "updated successfully",
          user: user
        })
      }).catch((error) => {
        return res.status(400).json({
          error: error
        })
      })
  }
    
  //customer_portal
  async customerPortal(req, res) {
    const session = await stripe.billingPortal.sessions.create({
      customer: req.user.customer,
      return_url: 'https://www.google.com',
    });
    res.status(200).send(session)
  }
}
export default new paymentGateway()









