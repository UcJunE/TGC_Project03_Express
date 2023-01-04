const { Jewelry, Color, Material } = require("../models");

const getAllJewelries = async () => {
  return await Jewelry.collection().fetchAll({
    withRelated: ["color", "materials"],
  });
};

const getAllColors = async () => {
  return await Color.fetchAll().map((color) => {
    return [color.get("id"), color.get("name")];
  });
};

const getAllMaterials = async () => {
  return await Material.fetchAll().map((material) => {
    return [material.get("id"), material.get("material_type")];
  });
};

const getProductById = async (productId) => {
  return await Jewelry.where({
    id: parseInt(productId),
  }).fetch({
    require: true,
    withRelated: ["color", "materials"],
  });
};

const getAllProducts = async () => {
  return await Jewelry.fetchAll({
    withRelated: ["color", "materials"],
  });
};

const updateProduct = async (productId, formData) => {
  const product = await getProductById(productId);

  if (!product) {
    return;
  } else {
    product.set(formData);
    await product.save();
    return true;
  }
};

module.exports = {
  getAllJewelries,
  getAllColors,
  getAllMaterials,
  getProductById,
  getAllProducts,
  updateProduct,
};
