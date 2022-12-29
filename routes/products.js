const express = require("express");
const async = require("hbs/lib/async");
const router = express.Router();
const {
  bootstrapField,
  createProductForm,
  createSearchForm,
} = require("../forms");
const { checkIfAuthenticated } = require("../middlewares");
const dataLayer = require("../dal/products");
const { Jewelry, Color, Material } = require("../models");

//display all products
router.get("/", async (req, res) => {
  // let products = await Jewelry.collection().fetch({
  //   withRelated: ["color", "materials"],
  // });
  // 1. get all the categories
  const allMaterials = await dataLayer.getAllMaterials();

  // console.log(allMaterials);
  allMaterials.unshift([0, "----"]);

  let colors = await dataLayer.getAllColors();

  colors.unshift([0, "All Colors"]);
  const productDesigns = {};
  const filteredProducts = [];
  let products = await Jewelry.fetchAll().map((product) => {
    if (!productDesigns[product.get("design")]) {
      productDesigns[product.get("design")] = true;
      filteredProducts.push([product.get("design"), product.get("design")]);
    }
  });
  filteredProducts.unshift([0, "----"]);
  // console.log("products", filteredProducts);

  // console.log(colors);
  let searchForm = createSearchForm(filteredProducts, colors, allMaterials);
  let q = Jewelry.collection();

  searchForm.handle(req, {
    empty: async (form) => {
      let products = await q.fetch({
        withRelated: ["color", "materials"],
      });

      // console.log(products.toJSON());
      res.render("products/index", {
        products: products.toJSON(),
        form: form.toHTML(bootstrapField),
      });
    },
    error: async (form) => {
      let products = await q.fetch({
        withRelated: ["color", "materials"],
      });

      // console.log(products.toJSON());
      res.render("products/index", {
        products: products.toJSON(),
        form: form.toHTML(bootstrapField),
      });
    },
    success: async (form) => {
      if (form.data.name) {
        q.where("name", "like", "%" + form.data.name + "%");
      }
      if (form.data.id && form.data.id != "0") {
        q.where("jewelries.id", "=", form.data.id);
      }
      if (form.data.color_id && form.data.color_id !== "0") {
        q.where("color_id", "=", form.data.color_id);
      }
      if (form.data.materials && form.data.materials !== "0") {
        q.query(
          "join",
          "jewelries_materials",
          "jewelries.id",
          "jewel_id"
        ).where("material_id", "in", form.data.materials.split(","));
      }
      if (form.data.design) {
        q.where("design", "=", form.data.design);
      }
      if (form.data.min_cost) {
        q.where("cost", ">=", form.data.min_cost);
      }
      if (form.data.max_cost) {
        q.where("cost", "<=", form.data.max_cost);
      }

      let products = await q.fetch({
        withRelated: ["color", "materials"],
      });

      res.render("products/index", {
        products: products.toJSON(),
        form: form.toHTML(bootstrapField),
      });
    },
  });
});

//display create form
router.get("/create", checkIfAuthenticated, async (req, res) => {
  let colors = await dataLayer.getAllColors();
  let materials = await dataLayer.getAllMaterials();
  const productForm = createProductForm(colors, materials);

  res.render("products/create", {
    form: productForm.toHTML(bootstrapField),
    cloudinaryName: process.env.CLOUDINARY_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET,
  });
});

//handling data from client
router.post("/create", checkIfAuthenticated, async (req, res) => {
  let colors = await dataLayer.getAllColors();
  let materials = await dataLayer.getAllMaterials();
  const productForm = createProductForm(colors, materials);
  productForm.handle(req, {
    success: async (form) => {
      let created_date = new Date();
      // const productData = { ...form.data, created_date };
      let { materials, ...productData } = form.data;
      productData = { ...productData, created_date };

      const product = new Jewelry(productData);
      await product.save();
      if (materials) {
        await product.materials().attach(materials.split(","));
      }
      req.flash(
        "success_messages",
        `New Product ${product.get("name")} has been created`
      );
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

  const product = await dataLayer.getProductById(product_id);

  let colors = await dataLayer.getAllColors();
  let materials = await dataLayer.getAllMaterials();
  const productForm = createProductForm(colors, materials);

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
  productForm.fields.jewelry_img_url.value = product.get("jewelry_img_url");
  productForm.fields.jewelry_thumbnail_url.value = product.get(
    "jewelry_thumbnail_url"
  );
  //fill in multi select value for  materials
  let selectedMaterials = await product.related("materials").pluck("id");
  // console.log(selectedMaterials);
  productForm.fields.materials.value = selectedMaterials;

  res.render("products/update", {
    form: productForm.toHTML(bootstrapField),
    product: product.toJSON(),
    cloudinaryName: process.env.CLOUDINARY_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET,
  });
});

//handing update post
router.post("/:product_id/update", async (req, res) => {
  const product_id = req.params.product_id;

  let colors = await dataLayer.getAllColors();
  let materials = await dataLayer.getAllMaterials();
  const product = await dataLayer.getProductById(product_id);

  console.log(product);
  const productForm = createProductForm(colors, materials);

  productForm.handle(req, {
    success: async (form) => {
      // console.log({ ...form.data });
      // console.log(product.get("created_date"));
      // let updateFormData = {
      //   materials,
      //   ...form.data,
      //   created_date: product.get("created_date"),
      // };

      let { materials, ...updateFormData } = form.data;
      updateFormData.created_date = product.get("created_date");

      console.log(updateFormData);
      product.set(updateFormData);
      await product.save();

      let materialIds = materials.split(",");
      let existingMaterialIds = await product.related("materials").pluck("id");
      console.log(materialIds);
      console.log(existingMaterialIds);
      //remove all the mat data aren't selected
      let toRemove = existingMaterialIds.filter(
        (id) => materialIds.includes(id) === false
      );

      await product.materials().detach(toRemove);

      // add in all the mat selected in the form
      await product.materials().attach(materialIds);

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

  const product = await dataLayer.getProductById(req.para);

  res.render("products/delete", {
    product: product.toJSON(),
  });
});

//handling del req
router.post("/:product_id/delete", async (req, res) => {
  const product = await dataLayer.getProductById(req.params.product_id);
  await product.destroy();
  res.redirect("/products");
});

module.exports = router;
