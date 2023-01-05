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
  const order = await OrderDataLayer.getOrderById(req.params.order_id);
  const remarks = order.get("remarks");
  // console.log(order.toJSON());
  const orderStatuses = await OrderDataLayer.getAllOrderStatuses();

  const orderForm = createUpdateOrderForm({
    orderStatuses,
  });

  orderForm.fields.order_status_id.value = order.get("order_status_id");
  res.render("orders/update", {
    form: orderForm.toHTML(bootstrapField),
  });
});

//update order
router.post("/:order_id/update", async (req, res) => {
  const order = await OrderDataLayer.getOrderById(req.params.order_id);
  const remarks = order.get("remarks");
  const orderStatuses = await OrderDataLayer.getAllOrderStatuses();

  const orderForm = createUpdateOrderForm({
    orderStatuses,
    remarks,
  });

  orderForm.handle(req, {
    success: async (form) => {
      delivery_date = new Date();
      updateOrderData = { ...form.data, delivery_date };
      order.set(updateOrderData);
      order.save();
      req.flash("success_messages", "Order successfully updated");
      res.redirect("/order");
    },
    error: async (form) => {
      res.render("orders/order", {
        order: order.toJSON(),
        form: form.toHTML(bootstrapField),
      });
    },
  });
});

module.exports = router;
