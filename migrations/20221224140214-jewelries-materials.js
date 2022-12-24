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
  return db.createTable("jewelries_materials", {
    id: {
      type: "int",
      unsigned: true,
      primaryKey: true,
      autoIncrement: true,
    },
    jewel_id: {
      type: "int",
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: "jewelries_materials_jewel_fk",
        table: "jewelries",
        mapping: "id",
        rules: {
          onDelete: "CASCADE",
          onUpdate: "RESTRICT",
        },
      },
    },
    material_id: {
      type: "int",
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: "jewelries_materials_material_fk",
        table: "materials",
        mapping: "id",
        rules: {
          onDelete: "CASCADE",
          onUpdate: "RESTRICT",
        },
      },
    },
  });
};

exports.down = function (db) {
  return db.dropTable("jewelries_materials");
};

exports._meta = {
  version: 1,
};
