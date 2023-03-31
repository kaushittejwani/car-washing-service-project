import sessions from 'express-session';
const users = require('../../models/user')

require('dotenv').config();
const stripe = require('stripe')(process.env.secretKey);
export class paymentGateway {

  async createBasicMonthly(req, res) {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {

          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: req.body.price,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `http://localhost:4000/success.html`,
      cancel_url: `http://localhost:4000/unsuccess.html`,
    });



    res.redirect(303, session.url);

  }

  async createBasicYearly(req, res) {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {

          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: req.body.price,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `http://localhost:4000/checkout/success.html`,
      cancel_url: `http://localhost:4000/checkout/unsuccess.html`,
    });

    res.redirect(303, session.url);
  }
  async createStandardMonthly(req, res) {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {

          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: req.body.price,
          quantity: 1,

        },
      ],
      mode: 'subscription',
      success_url: `http://localhost:4000/checkout/success.html`,
      cancel_url: `http://localhost:4000/checkout/unsuccess.html`,
    });

    res.redirect(303, session.url);
  }
  async createStandardYearly(req, res) {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {

          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: req.body.price,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `http://localhost:4000/checkout/success,html`,
      cancel_url: `http://localhost:4000/checkout/unsuccess.html`,
    });

    res.redirect(303, session.url);
  }
  async createPremiumMonthly(req, res) {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {

          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: req.body.price,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `http://localhost:4000/success.html`,
      cancel_url: `http://localhost:4000/unsuccess.html`,
    });

    res.redirect(303, session.url);

  }

  async createPremiumYearly(req, res) {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {

          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: req.body.price,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `http://localhost:4000/success.html`,
      cancel_url: `http://localhost:4000/unsuccess.html`,
    });

    res.redirect(303, session.url);
  }
  async webhook(req, res) {
    const { data } = req.body
    const user = await users.findOne({ userName: data.object.name })
    if (user) {
      if (user.email == data.object.email) {
        await users.updateOne({ email: data.object.email }, {
          $set: {
            stripeId: data.object.id
          }
        }).then(() => {
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
      else {
        await users.updateOne({ userName: data.object.name }, {
          $set: {
            email: data.object.email,
            stripeId: data.object.id

          }
        }).then(() => {
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

  // // async unsucess(req,res){
  //     res.status(404).json({
  //         unsucess:req.body
  //     })
  // // }
  async customerPortal(req, res) {
    // For demonstration purposes, we're using the Checkout session to retrieve the customer ID.
    // Typically this is stored alongside the authenticated user in your database.
    const session_id = req.body.session_id;
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