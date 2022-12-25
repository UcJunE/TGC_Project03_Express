const express = require("express");
const router = express.Router();

const { Jewelry } = require("../models");

router.get("/", async (req, res) => {
  let products = await Jewelry.collection().fetch();

  res.render("products/index", {
    products: products.toJSON(),
  });
});

module.exports = router;
