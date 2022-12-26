const bookshelf = require("../bookshelf");

const Jewelry = bookshelf.model("Jewelry", {
  tableName: "jewelries",
  color: function () {
    return this.belongsTo(Color);
  },
});

const Color = bookshelf.model("Color", {
  tableName: "colors",
  jewelry: function () {
    return this.hasMany(Jewelry);
  },
});
module.exports = { Jewelry, Color };
