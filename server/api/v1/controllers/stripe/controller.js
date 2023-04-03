import sessions from 'express-session';
const users = require('../../models/user')
const joi=require('joi');

require('dotenv').config();
const stripe = require('stripe')(process.env.secretKey);
export class paymentGateway {
  

  async generateCheckoutUrl(req, res) {
    const plan=joi.object({
      price:joi.string().required()
    })
    const {error,value}=plan.validate(req.body,{abortEarly:false})
    
    if (error) {
        return res.status(402).json(error.details)
    }
    
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {

          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: req.body.price,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `https://www.google.com`,
      cancel_url: `http://www.google.com`,
      customer: req.user.customer


    });

    res.status(303).send(session)
  }

  async webhook(req, res) {
    const { data } = req.body
    const user = await users.findOne({ email: data.object.email })
    if (user) {
      {
         await users.findOneAndUpdate({ email: data.object.email }, {
          $set: {
            //email:"tejwanikaushit46@gmail.com",
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

  async customerPortal(req, res) {
    // For demonstration purposes, we're using the Checkout session to retrieve the customer ID.
    // Typically this is stored alongside the authenticated user in your database.
    const user = await users.find({ name: req.body });
    const session_id = user.stripeId
    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

    // This is the url to which the customer will be redirected when they are done
    // managing their billing with the portal.
    const returnUrl = 'https://dashboard.stripe.com/test/payments';

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: checkoutSession.customer,
      return_url: returnUrl,
    });

    res.redirect(303, portalSession.url);
  }

}
export default new paymentGateway()
