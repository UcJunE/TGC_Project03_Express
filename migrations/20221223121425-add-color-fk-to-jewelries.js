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
  return db.addColumn("jewelries", "color_id", {
    type: "int",
    unsigned: true,
    notNull: true,
    foreignKey: {
      name: "color_jewelry_fk",
      table: "colors",
      mapping: "id",
      rules: {
        onDelete: "CASCADE",
        onUpdate: "RESTRICT",
      },
    },
  });
};

exports.down = function (db) {
  return db.dropColumn("jewelries");
};

exports._meta = {
  version: 1,
};
