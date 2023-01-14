const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
const helpers = require("handlebars-helpers")({
  handlebars: hbs.handlebars,
});
const session = require("express-session");
const flash = require("connect-flash");
const FileStore = require("session-file-store")(session);
const csrf = require("csurf");
const cors = require("cors");
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
//cross origin resource sharing
app.use(cors());

// enable CSRF
const csurfInstance = csrf();
app.use(function (req, res, next) {
  console.log("checking for csrf exclusion");
  // exclude whatever url we want from CSRF protection
  if (
    // req.url === "/checkout/process_payment" ||
    req.url.slice(0, 5) == "/api/"
  ) {
    console.log("checking route");
    return next();
  }
  csurfInstance(req, res, next);
});

// Share CSRF with hbs files
app.use(function (req, res, next) {
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use(function (err, req, res, next) {
  if (err && err.code == "EBADCSRFTOKEN") {
    req.flash("error_messages", "The form has expired. Please try again");
    res.redirect("back");
  } else {
    next();
  }
});

//setup sessions
app.use(
  session({
    store: new FileStore(),
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
  })
);

// Share the user data with hbs files
app.use(function (req, res, next) {
  res.locals.user = req.session.user;
  next();
});
//setup flash
app.use(flash());

//register flash middleware
app.use((req, res, next) => {
  res.locals.success_messages = req.flash("success_messages");
  res.locals.error_messages = req.flash("error_messages");
  //most important
  next();
});

// import in router
const accountRoutes = require("./routes/account");
const productsRoutes = require("./routes/products");
const cloudinaryRoutes = require("./routes/cloudinary");
const shoppingCartRoutes = require("./routes/shoppingCart");

const ordersRoutes = require("./routes/orders");
const {
  checkIfAuthenticated,
  checkIfAuthenticatedJWT,
} = require("./middlewares");

const api = {
  products: require("./routes/api/products"),
  shoppingCart: require("./routes/api/shoppingCart"),
  checkout: require("./routes/api/checkout"),
  account: require("./routes/api/account"),
  stripe: require("./routes/api/stripe"),
  order: require("./routes/api/orders"),
};

async function main() {
  app.use("/", accountRoutes);
  app.use("/products", checkIfAuthenticated, productsRoutes);
  app.use("/cloudinary", cloudinaryRoutes);
  app.use("/cart", shoppingCartRoutes);
  app.use("/order", checkIfAuthenticated, ordersRoutes);

  //api routes
  app.use("/api/products", express.json(), api.products);
  app.use(
    "/api/shoppingcart",
    express.json(),
    checkIfAuthenticatedJWT,
    api.shoppingCart
  );
  app.use(
    "/api/checkout",
    express.json(),
    checkIfAuthenticatedJWT,
    api.checkout
  );
  app.use("/api/account", express.json(), api.account);
  app.use("/api/stripe", api.stripe);
  app.use("/api/order", express.json(), checkIfAuthenticatedJWT, api.order);
}

main();

app.listen(process.env.PORT || 3000, () => {
  console.log("Server has started");
});
