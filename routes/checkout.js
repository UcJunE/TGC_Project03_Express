const { json } = require("express");
const express = require("express");

const router = express.Router();

const CartServices = require("../services/cart_services");
const Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.get("/", async (req, res) => {
  const cart = new CartServices(req.session.user.id);

  let items = await cart.getCartItem();

  //create line items , what is line item ?  line item is a single entry on an invoice
  let lineItems = [];

  //Metadata is useful for storing additional, structured information on an object
  let meta = [];
  for (let i of items) {
    const lineItem = {
      quantity: i.get("quantity"),
      price_data: {
        currency: "SGD",
        unit_amount: i.related("jewelry").get("cost"),
        product_data: {
          name: i.related("jewelry").get("name"),
        },
      },
    };
    if (i.related("jewelry").get("jewelry_img_url")) {
      lineItem.price_data.product_data.images = [
        i.related("jewelry").get("jewelry_img_url"),
      ];
    }
    lineItems.push(lineItem);
    //save the quatity data along with the product id
    meta.push({
      product_id: i.get("jewelry.id"),
      quantity: i.get("quantity"),
    });
  }
  //step 2 -create stripe payment
  let metaData = JSON.stringify(meta);

  const payment = {
    payment_method_types: ["card", "paynow", "grabpay"],
    mode: "payment",
    line_items: lineItems,
    success_url:
      process.env.STRIPE_SUCCESS_URL + "?sessionId={CHECKOUT_SESSION_ID}",
    cancel_url: process.env.STRIPE_ERROR_URL,
    metadata: {
      orders: metaData,
    },
    shipping_address_collection: {
      allowed_countries: ["SG"],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 500,
            currency: "sgd",
          },
          display_name: "Standard Shipping",
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 5,
            },
            maximum: {
              unit: "business_day",
              value: 7,
            },
          },
        },
      },
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 1500,
            currency: "sgd",
          },
          display_name: "Express Shipping",
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 1,
            },
            maximum: {
              unit: "business_day",
              value: 3,
            },
          },
        },
      },
    ],
  };
  // step 3: register the session
  let stripeSession = await Stripe.checkout.sessions.create(payment);
  // console.log("hello session", stripeSession);
  res.render("checkout/checkout", {
    sessionId: stripeSession.id, // 4. Get the ID of the session
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

router.post(
  "/process_payment",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    let payload = req.body;
    let endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
    let sigHeader = req.headers["stripe-signature"];
    let event;
    console.log("fuck me from stripe number before try");
    console.log(payload);
    console.log(sigHeader);
    console.log(endpointSecret);
    try {
      event = Stripe.webhooks.constructEvent(
        payload,
        sigHeader,
        endpointSecret
      );
    } catch (e) {
      res.send({
        error: e.message,
      });
      console.log(e.message);
    }
    if (event.type == "checkout.session.completed") {
      let stripeSession = event.data.object;
      console.log(stripeSession);
      console.log("fuck me from stripe");
      // process stripeSession
    }
    res.send({ received: true });
  }
);
module.exports = router;
