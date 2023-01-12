const express = require("express");
const router = express.Router();

const CartServices = require("../../services/cart_services");

router.get("/", async (req, res) => {
  let cart = new CartServices(req.user.id);
  shoppingCart = (await cart.getCartItem()).toJSON();
  // console.log(shoppingCart);
  res.json(shoppingCart);
});

router.post("/:product_id/add", async (req, res) => {
  console.log("add cart BE route handler")
  try {
    let cart = new CartServices(req.user.id);
    await cart.addToCart(req.params.product_id, req.body.quantity);
    res.json({
      success: "Item is added",
    });
  } catch (error) {
    res.json({
      error: "Item is not added",
    });
  }
});

router.delete("/:product_id/remove", async (req, res) => {
  console.log("did it reach here?");
  try {
    let cart = new CartServices(req.user.id);
    await cart.removeCartItem(req.params.product_id);
    res.json({
      success: "Item has been deleted",
    });
  } catch (error) {
    res.json({
      error: "Something unexpected occurred . Please refresh the page",
    });
  }
});

router.put("/:product_id/update", async (req, res) => {
  console.log("be post route handler for update");

  try {
    let cart = new CartServices(req.user.id);
    await cart.updateCartItemQuantity(
      req.params.product_id,
      req.body.newQuantity
    );
    res.json({
      Success: "Item has been updated",
    });
  } catch (error) {
    res.json({
      error: "item is not updated",
    });
  }
});

module.exports = router;
