//setup db connection
const knex = require("knex");

knex({
  client: "mysql",
  connection: {
    user: "admin",
    password: "rotiprata123",
    database: "jewel_shop",
  },
});

const bookshelf = require("bookshelf")(knex);

module.exports = bookshelf;
