const express = require("express");
const router = express.Router();
const { Jewelry } = require("../../models");

const productDataLayer = require("../../dal/products");
const { query } = require("express");
const async = require("hbs/lib/async");

router.get("/", async (req, res) => {
  res.send(await productDataLayer.getAllProducts());
  // ^ fetch all the products from main table
});

// for query
router.get("/search", async (req, res) => {
  const query = Jewelry.collection();
  //   console.log(query);

  const allMaterials = await productDataLayer.getAllMaterials();

  //   console.log(allMaterials);
  //   allMaterials.unshift([0, "----"]);

  let colors = await productDataLayer.getAllColors();
  //   console.log(colors);

  //   colors.unshift([0, "All Colors"]);
  const productDesigns = {};
  const filteredProducts = [];
  let allProducts = await Jewelry.fetchAll().map((product) => {
    if (!productDesigns[product.get("design")]) {
      productDesigns[product.get("design")] = true;
      filteredProducts.push([product.get("design"), product.get("design")]);
    }
  });
  //   filteredProducts.unshift([0, "----"]);
  if (req.query.name) {
    q.where("name", "like", "%" + req.query.name + "%");
  }
  if (req.query.id && req.query.id != "0") {
    q.where("jewelries.id", "=", form.data.id);
  }
  if (req.query.color_id && req.query.color_id !== "0") {
    q.where("color_id", "=", req.query.color_id);
  }
  if (req.query.materials && req.query.materials !== "0") {
    q.query("join", "jewelries_materials", "jewelries.id", "jewel_id").where(
      "material_id",
      "in",
      req.query.materials.split(",")
    );
  }
  if (req.query.design) {
    q.where("design", "=", req.query.design);
  }
  if (req.query.min_cost) {
    q.where("cost", ">=", req.query.min_cost);
  }
  if (req.query.max_cost) {
    q.where("cost", "<=", req.query.max_cost);
  }

  let productsData = await query.fetch({
    withRelated: ["color", "materials"],
  });

  let products = productsData.toJSON();
  res.send(products);
});

//for update and delete via id
router.get("/:product_id", async (req, res) => {
  try {
    const product = await productDataLayer.getProductById(
      req.params.product_id
    );
    res.send(product);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
