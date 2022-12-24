"use strict";

const { DATETIME } = require("mysql/lib/protocol/constants/types");

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
  return db.createTable("orders", {
    id: {
      type: "int",
      unsigned: true,
      primaryKey: true,
      autoIncrement: true,
    },
    order_date: {
      type: "datetime",
      notNull: true,
    },
    delivery_date: {
      type: "datetime",
      notNull: false,
    },
    remarks: {
      type: "text",
      notNull: false,
    },
    payment_intent: {
      type: "string",
      length: 100,
      notNull: false,
    },
    payment_mode: {
      type: "string",
      length: 50,
      notNull: false,
    },
    total_amount: {
      type: "int",
      unsigned: true,
    },
    receipt_url: {
      type: "string",
      length: 255,
      notNull: false,
    },
    shipping_type: {
      type: "string",
      lenght: 50,
      notNull: false,
    },
    shipping_amount: {
      type: "int",
      unsigned: true,
      notNull: false,
    },
    shipping_address_line1: {
      type: "string",
      length: 100,
      notNull: false,
    },
    shipping_address_line2: {
      type: "string",
      length: 100,
    },
    shipping_postal_code: {
      type: "string",
      length: 20,
    },
    shipping_country: {
      type: "string",
      length: 50,
    },
  });
};

exports.down = function (db) {
  return db.dropTable("orders");
};

exports._meta = {
  version: 1,
};
