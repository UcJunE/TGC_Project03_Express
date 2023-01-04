const cartDataLayer = require("../dal/cart_items");

class CartServices {
  constructor(user_id) {
    this.user_id = user_id;
  }

  async addToCart(productId, quantity) {
    // check if the user has added the product to the shopping cart before
    let cartItem = await cartDataLayer.getCartItemByUserAndProduct(
      this.user_id,
      productId
    );
    if (cartItem) {
      return await cartDataLayer.updateCartItem(
        this.user_id,
        productId,
        cartItem.get("quantity") + 1
      );
    } else {
      let newCartItem = cartDataLayer.createCartItem(
        this.user_id,
        productId,
        quantity
      );
      return newCartItem;
    }
  }

  async removeCartItem(productId) {
    return await cartDataLayer.deleteCartItem(this.user_id, productId);
  }

  async updateCartItemQuantity(productId, quantity) {
    return await cartDataLayer.updateCartItem(
      this.user_id,
      productId,
      quantity
    );
  }

  async getCartItem() {
    return await cartDataLayer.getCartItem(this.user_id);
  }


}

module.exports = CartServices;
