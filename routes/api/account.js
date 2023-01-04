const { Router } = require("express");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const dataLayer = require("../../dal/account");
const { BlacklistedToken } = require("../../models");
const { getHashedPassword, validateEmail } = require("../../utilities");
const { checkIfAuthenticatedJWT } = require("../../middlewares");

const generateAccessToken = function (
  username,
  id,
  role_id,
  tokenSecret,
  expiry
) {
  return jwt.sign(
    {
      username: username,
      id: id,
      role_id: role_id,
    },
    tokenSecret,
    {
      expiresIn: expiry,
    }
  );
};

router.post("/register", async (req, res) => {
  //check for customer in the db

  let error = {};

  const username = req.body.username;
  if (username.length == 0 || username.lenght > 100) {
    error.username = "Please choose a username less than 100 characters";
  }

  const name = req.body.name;
  if ((name.lenght = 0 || name.lenght > 100)) {
    error.name = "Name must not longer than 100 characters";
  }

  const email = req.body.email;
  if (!validateEmail(email)) {
    error.email = "Please provide valid email";
  }

  const password = req.body.password;
  if (password.lenght == 0 || password.length > 100) {
    error.password = " Please choose password less than 100 characters";
  }

  const contact_number = req.body.contact_number;
  if (contact_number.lenght == 0 || contact_number.length > 20) {
    error.contact_number = "Contact number must no more than 20 characters";
  }

  const userData = {
    username: username,
    name: name,
    email: email,
    contact_number: contact_number,
    password: getHashedPassword(password),
    created_date: new Date(),
  };

  res.json(userData);

  try {
    const checkUserNameExist = dataLayer.checkUsernameTaken(username);
    if (checkUserNameExist) {
      res.json({
        checkUserNameExist: "User already exist",
      });
      return;
    }

    await dataLayer.addNewUser(userData, 1);
    res.json({
      success: "User successfully registered",
    });
  } catch (e) {
    res.json({
      error: "Internal server error , Please contact adminstrator",
    });
  }
});

router.post("/login", async (req, res) => {
  const userData = {
    username: req.body.username,
    password: getHashedPassword(req.body.password),
  };
  // console.log("this is userdata" ,userData)
  const user = await dataLayer.getUserByUserDetail(userData);

  // console.log("this result is from user model" ,user)
  // to check user exist or not and  user is a customer
  if (!user || user.get("role_id") != 1) {
    res.json({
      error: "Invalid Username / password",
    });
    return;
  }

  //if user is exist and is a customer , create a jwt token
  const accessToken = generateAccessToken(
    user.get("username"),
    user.get("id"),
    user.get("role_id"),
    process.env.TOKEN_SECRET,
    "1h"
  );

  const refreshToken = generateAccessToken(
    user.get("username"),
    user.get("id"),
    user.get("role_id"),
    process.env.REFRESH_TOKEN_SECRET,
    "7d"
  );
  res.status(200);
  res.json({
    accessToken: accessToken,
    refreshToken: refreshToken,
  });
});

router.post("/refresh", checkIfAuthenticatedJWT, async function (req, res) {
  // Get the refreshToken from req.body (need not be in authorisation header for refresh tokens)
  const refreshToken = req.body.refreshToken;

  if (refreshToken) {
    //check if refresh token alr blacklisted
    const blacklisted_token = await BlacklistedToken.where({
      token: refreshToken,
    }).fetch({
      require: false,
    });
    //if blacklisted token is not null . that's mean it is exist
    if (blacklisted_token) {
      res.status(400);
      res.json({
        error: "Refresh token has been blacklisted",
      });
      return;
    }
    //verify refresh token
    jwt.verify(
      refreshToken,
      process.env.TOKEN_SECRET,
      function (err, tokenData) {
        // if no error means its verified
        if (!err) {
          const accessToken = generateAccessToken(
            tokenData.username,
            tokenData.id,
            tokenData.role_id,
            process.env.TOKEN_SECRET,
            "1h"
          );
          res.json({
            accessToken: accessToken,
          });
        } else {
          res.status(400);
          res.json({
            error: "No token found",
          });
        }
      }
    );
  } else {
    res.status(401);
    res.json({
      error: "No refresh token found",
    });
  }
});

router.post("/logout", async function (req, res) {
  const refreshToken = req.body.refreshToken;

  if (refreshToken) {
    //add refresh token to black list
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async function (err, tokenData) {
        if (!err) {
          //check if token is already blacklist
          const blacklistedToken = await blacklistedToken
            .where({
              blacklisted_token: refreshToken,
            })
            .fetch({
              require: false,
            });

          //if the blaclisted token is not null, means it exists
          if (blacklistedToken) {
            res.status(400);
            res.json({
              error: "Refresh token has been blacklisted",
            });
            return;
          }
          // add to blacklist
          const token = new BlacklistedToken();
          token.set("blacklisted_token", refreshToken);
          token.get("created_date", new Date());
          await token.save();
          res.json({
            message: "logged out",
          });
        }
      }
    );
  } else {
    res.status(401);
    res.json({
      error: "No refresh token found",
    });
  }
});

module.exports = router;