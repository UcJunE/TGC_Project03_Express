const express = require("express");
const router = express.Router();
const { bootstrapField, createProductForm } = require("../forms");

const { Jewelry } = require("../models");

router.get("/", async (req, res) => {
  let products = await Jewelry.collection().fetch();

  res.render("products/index", {
    products: products.toJSON(),
  });
});

router.get("/create", async (req, res) => {
  const productForm = createProductForm();

  res.render("products/create", {
    form: productForm.toHTML(bootstrapField),
  });
});

module.exports = router;
