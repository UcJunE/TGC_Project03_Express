const express = require("express");
const router = express.Router();
const dataLayer = require("../dal/account");
const { User } = require("../models");
const {
  createRegistrationForm,
  createLoginForm,
  bootstrapField,
} = require("../forms");
const async = require("hbs/lib/async");

const { getHashedPassword } = require("../utilities");

const { checkIfAuthenticated } = require("../middlewares");

router.get("/", (req, res) => {
  res.render("accounts/home");
});

router.get("/register", (req, res) => {
  const registerForm = createRegistrationForm();

  res.render("accounts/register", {
    form: registerForm.toHTML(bootstrapField),
  });
});

router.post("/register", (req, res) => {
  const registerForm = createRegistrationForm();

  registerForm.handle(req, {
    success: async (form) => {
      let created_date = new Date();
      let password = getHashedPassword(form.data.password);
      let { confirm_password, ...userData } = form.data;
      userData = { ...userData, created_date, password };

      // console.log({ ...userData });
      const User = await dataLayer.addNewUser(userData, 2);
      req.flash("success_messages", "User signed up successfully!");
      res.redirect("/login");
    },
    error: (form) => {
      res.render("accounts/register", {
        form: form.toHTML(bootstrapField),
      });
    },
  });
});
router.get("/login", (req, res) => {
  const loginForm = createLoginForm();

  res.render("accounts/login", {
    form: loginForm.toHTML(bootstrapField),
  });
});

router.post("/login", (req, res) => {
  const loginForm = createLoginForm();

  loginForm.handle(req, {
    success: async (form) => {
      let user = await User.where({
        email: form.data.email,
      }).fetch({
        require: false,
        withRelated: ["role"],
      });

      console.log(user);
      if (!user) {
        req.flash(
          "error_messages",
          "Sorry , The details you provided does not work"
        );
        res.redirect("/login");
      } else {
        if (user.get("password") === getHashedPassword(form.data.password)) {
          // add to the session that login succeedd and store the user details
          req.session.user = {
            id: user.get("id"),
            username: user.get("username"),
            email: user.get("email"),
            name: user.get("name"),
            role: user.related("role").get("role"),
          };

          console.log(req.session.user);

          req.flash(
            "success_messages",
            `Welcome Back , ${user.get("username")}`
          );
          res.redirect("/profile");
        } else {
          req.flash(
            "error_messages",
            "Sorry , Wrong authentication details provided . Try again "
          );
          res.redirect("/login");
        }
      }
    },
    error: async (form) => {
      req.flash(
        "error_messages",
        "There are problem Logging you in . Please provide the correct details"
      );
      res.render("accounts/login", {
        form: form.toHTML(bootstrapField),
      });
    },
  });
});

router.get("/profile", (req, res) => {
  const user = req.session.user;
  if (!user) {
    req.flash("error_messages", "Permission to access denied");
    res.redirect("/login");
  } else {
    res.render("accounts/profile", {
      user: user,
    });
  }
});

router.get("/logout", (req, res) => {
  req.session.user = null;
  req.flash(
    "success_messages",
    "Thanks for shopping with us , Hope to see you again"
  );
  res.redirect("/login");
});
module.exports = router;
