const { User } = require("../models");

const addNewUser = async function (userInfo, roleId = 1) {
  userInfo.role_id = roleId;

  const user = new User(userInfo);

  await user.save();

  return user;
};

module.exports = { addNewUser };
