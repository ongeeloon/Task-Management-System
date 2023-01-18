const User_Group = require("../models/User_Group")
const ErrorHandler = require("../utils/ErrorHandler")

exports.authoriseRoles = (...roles) => {
  return (req, res, next) => {
    //jwt token
    let username = req.user.name
    //check if user belongs to any of the roles / groups
    isAuthorised = false

    for (var role in roles) {
      isAuthorised = checkGroup(username, role)
      if (isAuthorised == true) {
        break
      }
    }

    if (isAuthorised == false) {
      return next(
        new ErrorHandler(403, "User is not allowed to access this resource.")
      )
    }
    next()
  }
}

exports.checkGroup = async (username, groupname) => {
  //get all active groups of username
  const [usergroup, _] = await User_Group.getUserActiveGroupsByUsername(
    username
  )
  //if user is not assigned to any group and does not exist in usergroup table
  if (usergroup[0] == null) {
    return false
  }
  //compare target groupname with all active groups
  else if (usergroup[0].groupname.includes(groupname)) {
    //if active groups contain target groupname, return true
    return true
  } else {
    return false
  }
}
