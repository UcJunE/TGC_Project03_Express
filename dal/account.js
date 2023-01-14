const { User } = require("../models");
const { getHashedPassword } = require("../utilities");

const addNewUser = async function (userInfo, roleId = 1) {
  userInfo.role_id = roleId;

  const user = new User(userInfo);
  console.log("add new user function and userinfto" )
  await user.save();
  console.log("after the save")
  return user;
};

const checkUsernameTaken = async function (username) {

  console.log("does is user check went thru ?")
  const user = await User.where({
    username: username,
  }).fetch({
    require: false,
  });
  if (user) {
    return true;
  } else {
    return false;
  }
};

const getUserByUserDetail = async function (formData) {
  // console.log("formdata", formData);
  const user = await User.where({
    username: formData.username,
    password: formData.password,
  }).fetch({
    require: false,
    withRelated: ["role"],
  });
  // console.log("this is user",user)
  return user ? user : false; // Return user if exists, else false
};

module.exports = { addNewUser, checkUsernameTaken, getUserByUserDetail };
