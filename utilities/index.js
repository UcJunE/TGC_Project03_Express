const crypto = require("crypto");

const getHashedPassword = (password) => {
  const sha256 = crypto.createHash("sha256");
  const hash = sha256.update(password).digest("base64");
  return hash;
};

const validateEmail = (email) => {
  let regex =
    /^[\w#][\w\.\’+#](.[\w\\’#]+)\@[a-zA-Z0-9]+(.[a-zA-Z0-9]+)*(.[a-zA-Z]{2,20})$/;

  if (email.match(regex)) {
    return true;
  }
  return false;
};

module.exports = {
  getHashedPassword,
  validateEmail,
};
