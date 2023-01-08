const express = require("express");
const router = express.Router();
const { Jewelry } = require("../../models");

const productDataLayer = require("../../dal/products");
const { query } = require("express");
const async = require("hbs/lib/async");

router.get("/", async (req, res) => {
  let result = await productDataLayer.getAllProducts();
  res.json(result);
  // ^ fetch all the products from main table6+
});

// for query
router.get("/search", async (req, res) => {
  const q = Jewelry.collection();
  //   console.log(query);
  let doSearch = false;

  for (let [eachKey, eachValue] of Object.entries(req.query)) {
    // console.log("entered for loop")
    console.log(`${eachKey}: ${eachValue}`);

    if (eachValue.length > 0) {
      doSearch = true;
    }
  }

  if (doSearch) {
    if (req.query.name) {
      if (process.env.DB_DRIVER == "mysql") {
        q.where("name", "like", "%" + req.query.name + "%");
      } else {
        q.where("name", "ilike", "%" + req.query.name + "%");
      }
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

    if (parseInt(req.query.min_cost) * 100) {
      q.where("cost", ">=", parseInt(req.query.min_cost)*100);
    }
    if (parseInt(req.query.max_cost) * 1000) {
      q.where("cost", "<=", parseInt(req.query.max_cost)*100);
    }
    let productsData = await q.fetch({
      withRelated: ["color", "materials"],
    });

    let products = productsData.toJSON();
    res.json(products);
  } else {
    let allProducts = await productDataLayer.getAllProducts();
    res.status(200);
    res.json({
      Message: allProducts,
    });
  }
});

//for selections dropdown on fe
router.get("/search_options", async (req, res) => {
  const colors = await productDataLayer.getAllColors();
  colors.unshift([0, "Select Colour"]);

  const materials = await productDataLayer.getAllMaterials();
  materials.unshift([0, "Select Material"]);

  const options = {
    colors,
    materials,
  };
  // console.log(options);
  res.json(options);
});

//for update and delete via id
router.get("/:product_id", async (req, res) => {
  try {
    const product = await productDataLayer.getProductById(
      req.params.product_id
    );
    res.json(product);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
