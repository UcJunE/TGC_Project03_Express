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

const getAllOrderStatuses = async function () {
  const orderStatuses = await OrderStatus.fetchAll().map((status) => {
    return [status.get("id"), status.get("order_status")];
  });

  return orderStatuses;
};

const filterOrdersBySearchFields = async function (form) {
  let query = Order.collection();

  if (form.data.id) {
    query.where("id", "=", form.data.id);
  }

  if (form.data.order_status_id && form.data.order_status_id != 0) {
    query.where("order_status_id", "=", form.data.order_status_id);
  }
  //  ilike in sql  is case-insensitive
  if (form.data.customer_email) {
    if (process.env.DB_DRIVER == "mysql") {
      query
        .query("join", "users", "users.id", "user_id")
        .where("name", "like", `%${form.data.customer_email}%`);
    } else {
      query
        .query("join", "users", "users.id", "user_id")
        .where("email", "ilike", `%${form.data.customer_email}%`);
    }
  }

  let orders = await query.fetch({
    withRelated: ["user", "orderStatus"],
  });
  console.log("this", orders.toJSON());
  return orders;
};

const getOrderById = async function (orderId) {
  const order = await Order.where({
    id: orderId,
  }).fetch({
    require: true,
    withRelated: ["user", "orderStatus"],
  });
  return order;
};

const updateOrder = async function (orderId, orderData) {
  const order = await getOrderById(orderId);
  const { order_status_id } = orderData;

  order.set("order_status_id", order_status_id);
  await order.save();
  return true;
};

module.exports = {
  getAllOrders,
  addOrder,
  addOrderItem,
  emptyCart,
  getCurrentStock,
  getAllOrdersByUserId,
  getAllOrderStatuses,
  getOrderById,
  updateOrder,
  filterOrdersBySearchFields,
};
