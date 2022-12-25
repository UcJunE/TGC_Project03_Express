// Setting up the database connection
const knex = require("knex")({
  client: "mysql",
  connection: {
    user: "admin",
    password: "rotiprata123",
    database: "jewel_shop",
  },
});
const bookshelf = require("bookshelf")(knex);

module.exports = bookshelf;
