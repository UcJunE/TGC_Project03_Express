const { json } = require("express");
const express = require("express");
const { CartItem } = require("../../models");

const router = express.Router();

const CartServices = require("../../services/cart_services");
const Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.get("/", async (req, res) => {
  const cart = new CartServices(req.user.id);

  let items = await cart.getCartItem();
  // console.log(items.toJSON());
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
    // console.log("this is line item ", lineItem);
    // console.log("this is the jewelry id", i.get("product_id"));
    // console.log("this is userId ", i.get("user_id"));
    meta.push({
      product_id: i.get("product_id"),
      user_id: i.get("user_id"),
      quantity: i.get("quantity"),
    });
  }
  // console.log("this is metadata", meta);
  //step 2 -create stripe payment
  let metaData = JSON.stringify(meta);

  const payment = {
    payment_method_types: ["card", "paynow", "grabpay"],
    mode: "payment",
    line_items: lineItems,
    success_url:
      process.env.STRIPE_SUCCESS_URL + "?sessionId={CHECKOUT_SESSION_ID}",
    cancel_url: process.env.STRIPE_ERROR_URL,
    invoice_creation: { enabled: true },
    payment_intent_data: {
      capture_method: "automatic",
    },
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
  // step 3: register the payment session
  let stripeSession = await Stripe.checkout.sessions.create(payment);
  // console.log("hello session", stripeSession);
  res.render("checkout/checkout", {
    sessionId: stripeSession.id, // 4. Get the ID of the session
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

module.exports = router;
