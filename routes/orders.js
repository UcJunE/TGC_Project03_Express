const express = require("express");
const router = express.Router();
const dataLayer = require("../dal/orders");

router.get("/", async function (req, res) {
  // Get all orders
  const orders = await dataLayer.getAllOrders();
  res.send(orders.toJSON());
});

module.exports = router;
  