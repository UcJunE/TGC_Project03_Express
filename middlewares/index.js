const jwt = require("jsonwebtoken");

const checkIfAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    req.flash("error_messages", "You need to sign in to access this page");
    res.redirect("/login");
  }
};
const checkIfAuthenticatedJWT = function (req, res, next) {
  const authHeader = req.headers.authorization;
  // console.log(authHeader)
  if (authHeader) {
    //extract out the jwt and check if valid
    //example header authHeader => BEARER kjnAKJNinalknKJANSFsd
    const token = authHeader.split(" ")[1]; //split by space, take the index 1 which is jwt
    // console.log('token=>', token)
    jwt.verify(token, process.env.TOKEN_SECRET, function (err, tokenData) {
      // err argument is null if there is no error
      //token data argument is the data we embed
      if (err) {
        res.status(401);
        // console.log("checkfailed")
        res.json({
          error: "Invalid access token",
        });
      } else {
        // if token is valid
        req.customer = tokenData;
        console.log("checkifauthsuccess");
        next();
      }
    });
  } else {
    res.status(401);
    res.json({
      error: "No authorization header found",
    });
  }
};

module.exports = {
  checkIfAuthenticated,
  checkIfAuthenticatedJWT,
};
