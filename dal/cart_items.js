const { CartItem } = require("../models");

const getCartItem = async (userId) => {
  return await CartItem.collection()
    .where({
      user_id: userId,
    })
    .orderBy("id")
    .fetch({
      require: false,
      withRelated: ["user", "jewelry", "jewelry.color", "materials"],
      // how doest this work ? 
    });
};

const getCartItemByUserAndProduct = async function (userId, productId) {
  const cartItem = await CartItem.where({
    user_id: userId,
    product_id: productId,
  }).fetch({
    require: false,
  });

  return cartItem;
};

async function createCartItem(userId, productId, quantity) {
  let cartItem = new CartItem({
    user_id: userId,
    product_id: productId,
    quantity: quantity,
  });
  await cartItem.save();
  return cartItem;
}

async function deleteCartItem(userId, productId) {
  let cartItem = await getCartItemByUserAndProduct(userId, productId);
  if (cartItem) {
    await cartItem.destroy();
    return true;
  }
  return false;
}

async function updateCartItem(userId, productId, newQuantity) {
  let cartItem = await getCartItemByUserAndProduct(userId, productId);
  if (cartItem) {
    cartItem.set("quantity", newQuantity);
    cartItem.save();
    return true;
  }
  return false;
}
module.exports = {
  getCartItemByUserAndProduct,
  getCartItem,
  createCartItem,
  deleteCartItem,
  updateCartItem
};
