const bookshelf = require("../bookshelf");

const Jewelry = bookshelf.model("Jewelry", {
  tableName: "jewelries",
});

module.exports = { Jewelry };
