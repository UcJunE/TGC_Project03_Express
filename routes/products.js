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

//handling update. to display
router.get("/:product_id/update", async (req, res) => {
  const product_id = req.params.product_id;

  const product = await Jewelry.where({
    id: product_id,
  }).fetch({
    require: true,
  });

  let colors = await Color.fetchAll().map((color) => {
    return [color.get("id"), color.get("name")];
  });
  const productForm = createProductForm(colors);

  // fill in the existing values
  productForm.fields.name.value = product.get("name");
  productForm.fields.description.value = product.get("description");
  productForm.fields.cost.value = product.get("cost");
  productForm.fields.design.value = product.get("design");
  productForm.fields.color_id.value = product.get("color_id");
  productForm.fields.weight.value = product.get("weight");
  productForm.fields.width.value = product.get("width");
  productForm.fields.height.value = product.get("height");
  productForm.fields.stock.value = product.get("stock");

  res.render("products/update", {
    form: productForm.toHTML(bootstrapField),
    product: product.toJSON(),
  });
});

//handing update post
router.post("/:product_id/update", async (req, res) => {
  const product_id = req.params.product_id;

  const product = await Jewelry.where({
    id: product_id,
  }).fetch({
    require: true,
  });

  let colors = await Color.fetchAll().map((color) => {
    return [color.get("id"), color.get("name")];
  });
  const productForm = createProductForm(colors);

  productForm.handle(req, {
    success: async (form) => {
      // console.log({ ...form.data });
      console.log(product.get("created_date"));
      const updateFormData = {
        ...form.data,
        created_date: product.get("created_date"),
      };
      product.set(updateFormData);
      await product.save();
      res.redirect("/products");
    },
    error: async (form) => {
      res.render("products/update", {
        form: form.toHTML(bootstrapField),
      });
    },
  });
});

//handing del
router.get("/:product_id/delete", async (req, res) => {
  const product_id = req.params.product_id;

  const product = await Jewelry.where({
    id: product_id,
  }).fetch({
    require: true,
  });

  res.render("products/delete", {
    product: product.toJSON(),
  });
});

//handling del req
router.post("/:product_id/delete", async (req, res) => {
  const product = await Jewelry.where({
    id: req.params.product_id,
  }).fetch({
    require: true,
  });
  await product.destroy();
  res.redirect("/products");
});

module.exports = router;
