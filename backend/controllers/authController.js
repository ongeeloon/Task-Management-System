const User = require("../models/User")
const User_Group = require("../models/User_Group")
const bcrypt = require("bcryptjs")
const generateToken = require("../utils/generateToken")
const ErrorHandler = require("../utils/ErrorHandler")

exports.login = async (req, res, next) => {
  const { username, password } = req.body

  let [user, _] = await User.findUserByUsername(username)
  if (user.length === 0) {
    return next(new ErrorHandler(401, "Invalid username or password"))
  } else {
    let passwordMatch = await bcrypt.compare(password, user[0].password)
    if (passwordMatch == false) {
      return next(new ErrorHandler(401, "Invalid username or password"))
    }

    //After authenticating user with username and pw, SEND JWT TOKEN.
    const jwtUser = { name: username } //rmb to pass username
    const accessToken = generateToken(jwtUser)

    res.cookie("accessToken", accessToken, { httpOnly: true })
    res.status(200).json({
      accessToken: accessToken,
      message: "Successfully logged in"
    })
  }
}

exports.logout = async (req, res, next) => {
  res.cookie("accessToken", "none", {
    expires: new Date(Date.now()),
    httpOnly: true
  })
  res.status(200).json({
    success: true,
    message: "Logged out successfully."
  })
}

exports.checkGroup = async (username, groupname) => {
  //get all active groups of username
  const [usergroup, _] = await User_Group.getUserActiveGroupsByUsername(
    username
  )
  let isInGroup
  //if user is not assigned to any group and does not exist in usergroup table
  if (usergroup[0] == null) {
    isInGroup = false
    return isInGroup
  }
  //compare target groupname with all active groups
  else {
    //loop through all groups
    for (let i = 0; i < usergroup.length; i++) {
      console.log(usergroup[i].groupname)
      if (usergroup[i].groupname == groupname) {
        isInGroup = true
        break
      }
      isInGroup = false
    }
  }
  return isInGroup
}
