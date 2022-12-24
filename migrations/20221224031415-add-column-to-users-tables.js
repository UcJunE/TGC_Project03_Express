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
  return (
    db.addColumn("users", "username", {
      type: "string",
      lenght: "100",
      notNull: true,
    }),
    db.addColumn("users", "name", {
      type: "string",
      length: "100",
      notNull: true,
    }),
    db.addColumn("users", "contact_number", {
      type: "string",
      length: 30,
      notNull: true,
    }),
    db.addColumn("users", "created_date", {
      type: "date",
    })
  );
};

exports.down = function (db) {
  return (
    db.removeColumn("users", "username"),
    db.removeColumn("users", "name"),
    db.removeColumn("users", "contact_number"),
    db.removeColumn("users", "created_date")
  );
};

exports._meta = {
  version: 1,
};
