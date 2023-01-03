const bookshelf = require("../bookshelf");

const Jewelry = bookshelf.model("Jewelry", {
  tableName: "jewelries",
  color: function () {
    return this.belongsTo(Color);
  },
  materials: function () {
    return this.belongsToMany("Material", "jewelries_materials", "jewel_id");
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
    return this.belongsToMany("Material", "jewelries_materials", "jewel_id");
  },
});

//orders
const Order = bookshelf.model("Order", {
  tableName: "orders",
  user: function () {
    return this.belongsTo("User");
  },
  orderStatus: function () {
    return this.belongsTo("OrderStatus");
  },
  orderItems: function () {
    return this.hasMany("OrderItem");
  },
});

const OrderItem = bookshelf.model("OrderItem", {
  tableName: "ordered_items",
  order: function () {
    return this.belongsTo("Order");
  },
  jewelry: function () {
    return this.belongsTo("Jewelry", "product_id", "jewelries.id");
  },
  materials: function () {
    return this.belongsToMany("Material", "jewelries_materials", "jewel_id");
  },
});

const OrderStatus = bookshelf.model("OrderStatus", {
  tableName: "orders_status",
  orders: function () {
    return this.hasMany("Order");
  },
});

const BlacklistedToken = bookshelf.model("BlacklistedToken", {
  tableName: "blacklisted_tokens",
});

module.exports = {
  Jewelry,
  Color,
  Material,
  User,
  Role,
  CartItem,
  Order,
  OrderStatus,
  OrderItem,
  BlacklistedToken,
};
