//For React frontend

const User = require("../models/User")
const User_Group = require("../models/User_Group")

exports.checkAdmin = async (req, res, next) => {
  console.log(`HELLO WORLD: ${req.user.name}`)
  if (req.user.name) {
    const username = req.user.name
    //Check if user is admin or not
    const [usergroup, _] = await User_Group.getUserActiveGroupsByUsername(
      username
    )
    console.log(usergroup[0])

    if (usergroup[0] == null) {
      //if user is not assigned to any group and does not exist in usergroup table
      res.status(200).json({
        isAdmin: false
      })
    } else if (usergroup[0].groupname.includes("admin")) {
      //if user is admin
      res.status(200).json({
        isAdmin: true
      })
    } else {
      res.status(200).json({
        //if user is not admin, but exist in other group
        isAdmin: false
      })
    }
  }
}

exports.getCurrentUser = async (req, res, next) => {
  if (req.user.name) {
    const username = req.user.name
    //find and return user
    const [currentUser, _] = await User.findUserByUsername(username)
    if (currentUser[0]) {
      res.status(200).json({
        currentUser: currentUser[0]
      })
    } else {
      res.status(404).json({
        message: "User not found"
      })
    }
  }
}
