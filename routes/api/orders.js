const express = require("express");
const router = express.Router();
const dataLayer = require("../../dal/orders");

router.get("/", async function (req, res) {
  const userId = req.user.id;
  try {
    const orders = await dataLayer.getAllOrdersByUserId(userId);
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.json({
      error: "Error",
    });
  }
});

module.exports = router;
