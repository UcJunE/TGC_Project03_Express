"use strict";

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return db.addColumn("ordered_items", "order_id", {
    type: "int",
    unsigned: true,
    notNull: true,
    foreignKey: {
      name: "ordered_item_order_fk",
      table: "orders",
      mapping: "id",
      rules: {
        onDelete: "CASCADE",
        onUpdate: "RESTRICT",
      },
    },
  });
};

exports.down = function (db) {
  return (
    db.removeForeignKey("ordered_items", "ordered_item_order_fk"),
    db.removeColumn("ordered_items", "order_id")
  );
};

exports._meta = {
  version: 1,
};
