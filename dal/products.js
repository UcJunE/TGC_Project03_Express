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

//why when i use .collection().fetchALl . it stated that fetchAll is not a function??

const getAllProducts = async () => {
  return await Jewelry.fetchAll({
    withRelated: ["color", "materials"],
  });
};

module.exports = {
  getAllJewelries,
  getAllColors,
  getAllMaterials,
  getProductById,
  getAllProducts,
};
