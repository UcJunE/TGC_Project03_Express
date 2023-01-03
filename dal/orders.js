const { Order, OrderItem, OrderStatus } = require("../models");

const addOrder = async function (orderData) {
  const order = new Order(orderData);
  await order.save();

  return order;
};

const getAllOrders = async function () {
  const orders = await Order.collection()
    .orderBy("id", "DESC")
    .fetch({
      require: false,
      withRelated: ["user", "orderStatus", "orderItems"],
    });

  return orders;
};
module.exports = {
  getAllOrders,
  addOrder,
};
