const bookshelf = require("../bookshelf");

const Jewelry = bookshelf.model("Jewelry", {
  tableName: "jewelries",
  color: function () {
    return this.belongsTo(Color);
  },
  materials: function () {
    return this.belongsToMany(Material, "jewelries_materials", "jewel_id");
  },
});

const Color = bookshelf.model("Color", {
  tableName: "colors",
  jewelry: function () {
    return this.hasMany(Jewelry);
  },
});

const Material = bookshelf.model("Material", {
  tableName: "materials",
  jewelry: function () {
    return this.belongsToMany(Jewelry);
  },
});

// ---- user -----
const User = bookshelf.model("User", {
  tableName: "users",
  role: function () {
    return this.belongsTo("Role");
  },
  cartItems: function () {
    return this.hasMany("CartItem");
  },
  orders: function () {
    return this.hasMany("Order");
  },
});

const Role = bookshelf.model("Role", {
  tableName: "roles",
  user: function () {
    return this.hasMany("User");
  },
});

//carts
const CartItem = bookshelf.model("CartItem", {
  tableName: "cart_items",
  jewelry: function () {
    return this.belongsTo("Jewelry", "product_id");
  },
  user: function () {
    return this.belongsTo("User");
  },
  materials: function () {
    return this.belongsToMany(Material, "jewelries_materials", "jewel_id");
  },
});

module.exports = { Jewelry, Color, Material, User, Role, CartItem };
