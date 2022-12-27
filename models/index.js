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
module.exports = { Jewelry, Color, Material };
