const { Order, OrderItem, OrderStatus } = require("../models");
const productDataLayer = require("../dal/products");
const cartDataLayer = require("../dal/cart_items");
const CartServices = require("../services/cart_services");
const addOrder = async function (orderData) {
  const order = new Order(orderData);
  await order.save();
  return order;
};
// get all order still need to add on products tables
const getAllOrders = async function () {
  const orders = await Order.collection()
    .orderBy("id", "DESC")
    .fetch({
      require: false,
      withRelated: [
        "user",
        "orderStatus",
        "orderItems",
        "orderItems.jewelry",
        "orderItems.materials",
      ],
    });
  return orders;
};

const addOrderItem = async function (orderItemData) {
  const orderItem = new OrderItem(orderItemData);
  await orderItem.save();

  return orderItem;
};

const emptyCart = async function (userId) {
  let cart = new CartServices(userId);
  const cartItems = await cart.getCartItem(userId);
  for (let cartItem of cartItems) {
    const productId = cartItem.get("product_id");
    await cartDataLayer.deleteCartItem(userId, productId);
  }
};

const getCurrentStock = async function (productId) {
  const product = await productDataLayer.getProductById(productId);
  return parseInt(product.get("stock"));
};

const getAllOrdersByUserId = async function (userId) {
  // Get all orders by user ID
  const orders = await Order.collection()
    .where({
      user_id: userId,
    })
    .orderBy("id", "desc")
    .fetch({
      require: false,
      withRelated: [
        "user",
        "orderStatus",
        "orderItems",
        "orderItems.jewelry",
        "orderItems.materials",
      ],
    });

  return orders;
};

module.exports = {
  getAllOrders,
  addOrder,
  addOrderItem,
  emptyCart,
  getCurrentStock,
  getAllOrdersByUserId,
};
