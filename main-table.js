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
  return db.createTable("jewelries", {
    id: {
      type: "int",
      primaryKey: true,
      autoIncrement: true,
      unsigned: true,
    },
    name: {
      type: "string",
      length: 100,
      notNull: true,
    },
    description:{
      type:'string',
      
    },
    cost: {
      type: "int",
      unsigned: true,
    },
    weight: {
      type: "string",
      length: 100,
    },
    design: {
      type: "string",
      lenght: 100,
    },
    width: {
      type: "string",
      length: 100,
    },
    height: {
      type: "string",
      length: 100,
    },
    stock: {
      type: "int",
      unsigned: true,
    },
    sold: {
      type: "int",
      unsigned: true,
    },
    jewelry_img_url: {
      type: "string",
      length: 255,
    },
    jewelry_thumbnail_url: {
      type: "string",
      length: 255,
    },
    created_date: "date",
  });
};

exports.down = function (db) {
  return db.dropTable("jewelries");
};

exports._meta = {
  version: 1,
};
