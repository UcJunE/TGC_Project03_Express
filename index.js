const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();

let app = express();

//setup view engine
app.set("view engine", "hbs");

//static folder
app.use(express.static("public"));

//setup wax on // template inheritance
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

//enable form
app.use(
  express.urlencoded({
    extended: false,
  })
);

// import in router
const landingRoutes = require("./routes/landing");

async function main() {
  app.use("/", landingRoutes);
}

main();

app.listen(8888, () => {
  console.log("Server has started");
});
