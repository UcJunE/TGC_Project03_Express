const express = require("express");
const async = require("hbs/lib/async");
const router = express.Router();
const { bootstrapField, createProductForm } = require("../forms");

const { Jewelry, Color } = require("../models");

//display all products
router.get("/", async (req, res) => {
  let products = await Jewelry.collection().fetch({
    withRelated: ["color"],
  });

  res.render("products/index", {
    products: products.toJSON(),
  });
});

//display create form
router.get("/create", async (req, res) => {
  let colors = await Color.fetchAll().map((color) => {
    return [color.get("id"), color.get("name")];
  });
  const productForm = createProductForm(colors);

  res.render("products/create", {
    form: productForm.toHTML(bootstrapField),
  });
});

//handling data from client
router.post("/create", async (req, res) => {
  let colors = await Color.fetchAll().map((color) => {
    return [color.get("id"), color.get("name")];
  });
  const productForm = createProductForm(colors);
  productForm.handle(req, {
    success: async (form) => {
      let created_date = new Date();
      const productData = { ...form.data, created_date };
      const product = new Jewelry(productData);
      await product.save();
      res.redirect("/products");
    },
    error: async (form) => {
      res.render("products/create", {
        form: form.toHTML(bootstrapField),
      });
    },
  });
});

module.exports = router;
