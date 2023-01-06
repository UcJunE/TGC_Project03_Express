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
// router.get("/search", async (req, res) => {
//   const query = Jewelry.collection();
//   //   console.log(query);

//   const allMaterials = await productDataLayer.getAllMaterials();

//   //   console.log(allMaterials);
//   //   allMaterials.unshift([0, "----"]);

//   let colors = await productDataLayer.getAllColors();
//   //   console.log(colors);

//   //   colors.unshift([0, "All Colors"]);
//   const productDesigns = {};
//   const filteredProducts = [];
//   let allProducts = await Jewelry.fetchAll().map((product) => {
//     if (!productDesigns[product.get("design")]) {
//       productDesigns[product.get("design")] = true;
//       filteredProducts.push([product.get("design"), product.get("design")]);
//     }
//   });
//   //   filteredProducts.unshift([0, "----"]);
//   if (req.query.name) {
//     q.where("name", "like", "%" + req.query.name + "%");
//   }
//   if (req.query.id && req.query.id != "0") {
//     q.where("jewelries.id", "=", form.data.id);
//   }
//   if (req.query.color_id && req.query.color_id !== "0") {
//     q.where("color_id", "=", req.query.color_id);
//   }
//   if (req.query.materials && req.query.materials !== "0") {
//     q.query("join", "jewelries_materials", "jewelries.id", "jewel_id").where(
//       "material_id",
//       "in",
//       req.query.materials.split(",")
//     );
//   }
//   if (req.query.design) {
//     q.where("design", "=", req.query.design);
//   }
//   if (req.query.min_cost) {
//     q.where("cost", ">=", req.query.min_cost);
//   }
//   if (req.query.max_cost) {
//     q.where("cost", "<=", req.query.max_cost);
//   }

//   let productsData = await query.fetch({
//     withRelated: ["color", "materials"],
//   });

//   let products = productsData.toJSON();
//   res.json(products);
// });

//for query for api
router.get("/search_options", async (req, res) => {
  const colors = await productDataLayer.getAllColors();
  colors.unshift([0, "Select Colour"]);

  const materials = await productDataLayer.getAllMaterials();
  materials.unshift([0, "------"]);

  const options = {
    colors,
    materials,
  };
  console.log(options);
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
