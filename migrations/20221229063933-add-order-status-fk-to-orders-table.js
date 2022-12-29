'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.addColumn("orders", "order_status_id", {
    type: "int",
    unsigned: true,
    notNull: true,
    foreignKey: {
      name: "order_item_order_status_fk",
      table: "orders_status",
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
    db.removeForeignKey("orders", "order_item_order_status_fk"),
    db.removeColumn("orders", "order_status_id")
  );
};

exports._meta = {
  "version": 1
};
