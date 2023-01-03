const express = require("express");
const router = express.Router();

const CartServices = require("../../services/cart_services");

router.get("/", async (req, res) => {
  let cart = new CartServices(req.session.user.id);
  shoppingCart = (await cart.getCartItem()).toJSON();
  console.log(shoppingCart);
  res.json(shoppingCart);
});

router.get("/:product_id/add", async (req, res) => {
  try {
    let cart = new CartServices(req.session.user.id);
    await cart.addToCart(req.params.product_id, 1);
    res.json({
      success: "Item is added",
    });
  } catch (error) {
    res.json({
      error: "Item is not added",
    });
  }
});

router.get("/:product_id/remove", async (req, res) => {
  try {
    let cart = new CartServices(req.session.user.id);
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

// need to ask for this
router.post("/:product_id/quantity/update", async (req, res) => {
  try {
    let cart = new CartServices(req.session.user.id);
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
