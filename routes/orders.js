const express = require("express");
const router = express.Router();
const OrderDataLayer = require("../dal/orders");
const {
  createSearchOrderForm,
  createUpdateOrderForm,
  bootstrapField,
} = require("../forms");

router.get("/", async function (req, res) {
  // Get all orders
  const orders = await OrderDataLayer.getAllOrders();

  // Get all fields required for order search form
  const orderStatuses = await OrderDataLayer.getAllOrderStatuses();
  orderStatuses.unshift([0, "--- Any Order Status ---"]);

  const choices = {
    orderStatuses,
  };

  const orderSearchForm = createSearchOrderForm(choices);

  orderSearchForm.handle(req, {
    success: async function (form) {
      const orders = await OrderDataLayer.filterOrdersBySearchFields(form);
      console.log(orders.toJSON());
      res.render("orders/index", {
        orders: orders.toJSON(),
        form: form.toHTML(bootstrapField),
      });
    },
    error: async function (form) {
      res.render("orders/index", {
        orders: orders.toJSON(),
        form: form.toHTML(bootstrapField),
      });
    },
    empty: async function (form) {
      res.render("orders/index", {
        orders: orders.toJSON(),
        form: form.toHTML(bootstrapField),
      });
    },
  });
});

router.get("/:order_id/update", async function (req, res) {
  // const order = await OrderDataLayer.getOrderById(req.params.order_id);
  // console.log("Hello?");
  // console.log(order);
  // const orderStatuses = await OrderDataLayer.getAllOrderStatuses();

  // const orderForm = createUpdateOrderForm({
  //   orderStatuses,
  // });

  // orderForm.fields.order_status_id.value = order.get("order_status_id");
  // res.render("orders/update", {
  //   form: orderForm.toHTML(bootstrapField),
  // });
  ("Hello?")
});

module.exports = router;
