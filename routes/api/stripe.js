const express = require("express");
const router = express.Router();
const { checkIfAuthenticatedJWT } = require("../../middlewares");
const cartServices = require("../../services/cart_services");
const Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const orderDataLayer = require("../../dal/orders");
const productDataLayer = require("../../dal/products");

router.post(
  "/process_payment",
  express.raw({ type: "application/json" }),
  async function (req, res) {
    console.log("stripe page BE");
    let payload = req.body; // Payment information is inside req.body
    let endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
    let sigHeader = req.headers["stripe-signature"]; // When stripe sends the information, there will be a signature and the key will be 'stripe-signature'
    let event = null;

    // Try to extract out the payment information and verify that it actually comes from Stripe)
    try {
      event = Stripe.webhooks.constructEvent(
        payload,
        sigHeader,
        endpointSecret
      );

      // Create new order using information from checkout event
      if (
        event.type == "checkout.session.completed" ||
        event.type == "checkout.session.async_payment_succeeded"
      ) {
        // Payment session information
        let stripeSession = event.data.object;
        // console.log("this is stripeSession",stripeSession)
        // Metadata information
        const metadata = JSON.parse(event.data.object.metadata.orders);
        // console.log("this is metadata", metadata);
        const userId = metadata[0].user_id;
        // console.log("this is userID", userId);
        //retrieve receipt
        const receipt = await Stripe.invoices.retrieve(stripeSession.invoice);

        // Retrieve charge information from payment intent
        const paymentIntent = await Stripe.paymentIntents.retrieve(
          stripeSession.payment_intent
        );
        // console.log("this is payment intent", paymentIntent);
        const chargeId = paymentIntent.latest_charge;
        const charge = await Stripe.charges.retrieve(chargeId);

        // console.log("this is chargeid", chargeId); works
        // console.log("this is charge", charge);

        const receiptURL = receipt.hosted_invoice_url;
        // console.log("this is receipt url", receiptURL);
        const payment_mode = charge.payment_method_details.type;
        // console.log("this is payment mode",payment_mode) works

        // Retrieve selected shipping rate option
        const shippingRate = await Stripe.shippingRates.retrieve(
          stripeSession.shipping_cost.shipping_rate
        );

        // console.log(shippingRate.display_name);  it works finally= =

        // Create new order
        const orderData = {
          total_amount: stripeSession.amount_total,
          user_id: userId, // Just get user id from any line item
          order_status_id: 3, // Set order status as paid
          payment_mode: payment_mode,
          receipt_url: receiptURL,
          order_date: new Date(charge.created * 1000),
          payment_intent: stripeSession.payment_intent,
          shipping_type: shippingRate.display_name,
          shipping_amount: shippingRate.fixed_amount.amount,
          shipping_address_line1: paymentIntent.shipping.address.line1,
          shipping_address_line2: paymentIntent.shipping.address.line2,
          shipping_postal_code: paymentIntent.shipping.address.postal_code,
          shipping_country: paymentIntent.shipping.address.country,
        };

        const order = await orderDataLayer.addOrder(orderData);
        const orderId = order.get("id");

        // console.log("this is metaData", metadata);
        // // Create order items using order ID
        for (let lineItem of metadata) {
          const productId = lineItem.product_id;
          const quantity = lineItem.quantity;

          const orderItemData = {
            order_id: orderId,
            quantity: quantity,
            product_id: productId,
          };

          await orderDataLayer.addOrderItem(orderItemData);
          // Update stock of product
          const stock = await orderDataLayer.getCurrentStock(productId);
          await productDataLayer.updateProduct(productId, {
            stock: stock - quantity,
          });

          // Empty user's cart
          await orderDataLayer.emptyCart(userId);
        }

        //201 means created
        res.status(201);
        res.json({
          success: "Order and order items successfully created",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(200);
      res.json({
        error: "error",
      });
    }
  }
);

module.exports = router;
