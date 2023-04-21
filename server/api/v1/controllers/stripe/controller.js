import { json } from 'body-parser';
import { sign } from 'jsonwebtoken';

const users = require('../../models/user');

const joi = require('joi');

const carRegistration = require('../../models/car');

var getRawBody = require('raw-body')

require('dotenv').config();
const stripe = require('stripe')(process.env.secretKey);

export class paymentGateway {

  //generate checkout session url to create a  chekout session in stripe
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
          },

          description: `Car Model: ${car.carModel}, Car Number: ${car.carNumber}`
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
    }

    catch (error) {
      return res.status(404).send(error.message)
    }
  }

  async saveCustomerIdWebhook(req, res) {
    try {
      const endpointSecret = "whsec_61376145052f70fe30c76922eec5c1690ec021649f41009cb9c053923d4a7b53";

      const sig = req.headers['stripe-signature'];

      const payLoad = JSON.stringify(req.body)

      const event = stripe.webhooks.constructEvent(payLoad, sig, endpointSecret);

      const { data } = req.body;

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
    catch (error) {
      return res.status(404).send(error.message)
    }

  }

  //create subscription

  async createCustomerSubscriptions(req, res) {
    try {

      const endpointSecret = "whsec_Byy8If5DdBqxEvhxFK3Gcjyna6qTCQKA"

      const sig = req.headers['stripe-signature'];

      const payLoad = JSON.stringify(req.body)

      let event = stripe.webhooks.constructEvent(payLoad, sig, endpointSecret);

      const { data } = req.body

      const user = await carRegistration.findOneAndUpdate({ _id: data.object.metadata.carId },
        {
          $set: {
            isActive: true,
            plan:
            {
              plan: data.object.plan.metadata.plan,
              priceId: data.object.plan.id,
            },
            subscriptionId: data.object.id
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

    catch (error) {
      return res.status(400).send(error.message)
    }
  }

  async subscriptionUpdatedWebhook(req, res) {
    try {

      const endpointSecret = "whsec_KQZlA0R578fQlPF2HsuISxJz1e5WhYUS"

      const sig = req.headers['stripe-signature'];

      const payLoad = JSON.stringify(req.body)

      let event = stripe.webhooks.constructEvent(payLoad, sig, endpointSecret);

      response.status(400).send(`Webhook Error: ${err.message}`);

      const { data } = req.body

      const user = await carRegistration.findOneAndUpdate({ _id: data.object.metadata.carId },
        {
          $set: {
            isActive: true,
            plan:
            {
              plan: data.object.plan.metadata.plan,
              priceId: data.object.plan.id,
            },

            subscriptionId: data.object.id
          }

        })
        .then((user) => {
          return res.status(200).json({
            success: true,
            message: "updated successfully",
            user: user
          })

        })
        .catch((error) => {
          return res.status(400).json({
            error: error
          })

        })
    }

    catch (error) {
      return res.status(404).send(error.message)
    }
  }

  //customer_portal
  async customerPortal(req, res) {
    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: req.user.customer,
        return_url: 'https://www.google.com',
      });

      res.status(200).send(session)
    }
    catch (error) {
      return res.status(404).send(error.message)
    }

  }

  //cance subscription
  async cancelSubscription(req, res) {
    try {

      const endpointSecret = "whsec_3Vg5nlUp4OOV94R8pRe3UxjnwGBGmqoY"

      const sig = req.headers['stripe-signature'];

      const payLoad = JSON.stringify(req.body)

      let event = stripe.webhooks.constructEvent(payLoad, sig, endpointSecret);

      const { data } = req.body

      if (data.object.status == "canceled") {
        await carRegistration.findOneAndUpdate({ _id: data.object.metadata.carId },
          {
            $set: {
              isActive: false,
            }

          }).then((plan) => {
            return res.status(200).json({
              success: true,
              message: "plan cancel successfully",
              plan: plan
            })

          }).catch((error) => {
            return res.status(400).json({
              error: error
            })

          })

      }
      else {
        return res.status(400).json({
          status: data.object.status
        })
      }

    }

    catch (error) {
      return res.status(404).send(error.message)
    }
  }

}


export default new paymentGateway()





