const User_Group = require("../models/User_Group")
const GroupM = require("../models/GroupM")
const ErrorHandler = require("../utils/ErrorHandler")

exports.addUserToGroup = async (req, res, next) => {
  let { username, groupname } = req.body
  let user_group = await User_Group.addUserToGroup(username, groupname)
  //res.status(200).send("User successfully added to group")
}

exports.removeUserFromGroup = async (req, res, next) => {
  let { username, groupname } = req.body
  await User_Group.removeUserFromGroup(username, groupname)
  // res.status(200).send("User successfully removed from group")
}

exports.getAllUsersWithActiveGroups = async (req, res, next) => {
  try {
    let [user_groups, _] = await User_Group.getAllUsersWithActiveGroups()
    //convert groupnames string to array
    //store username and groupnames in json object
    let usergroupJSON = {}
    const key = "usergroups"
    usergroupJSON[key] = []

    user_groups.map(usergroup => {
      console.log(usergroup.username, usergroup.groupnames)
      let groupnameString = usergroup.groupnames
      let groupnameArray = groupnameString.split(",")
      let filteredGroupnameArray = groupnameArray.filter(a => a !== "user")
      usergroupJSON[key].push({
        username: usergroup.username,
        groupnames: filteredGroupnameArray
      })
    })
    JSON.stringify(usergroupJSON)

    res.status(200).json({
      usergroupJSON
    })
  } catch (error) {
    return next(
      new ErrorHandler(
        400,
        "Something went wrong, unable to retrieve user groups"
      )
    )
  }
}

exports.editUserGroups = async (req, res, next) => {
  let { username, groupnames } = req.body

  //get all active groups of user
  const [usergroup, _] = await User_Group.getUserActiveGroupsByUsername(
    username
  )

  //if user is not assigned to any group and does not exist in usergroup table
  if (usergroup[0] == null) {
    //add all groupnames in request
    for (let index = 0; index < groupnames.length; index++) {
      let result = await User_Group.addUserToGroup(username, groupnames[index])
      console.log(result)
    }
  }
  //compare the two arrays
  else {
    //convert groups in db to array
    const allActiveGroups = []
    usergroup.map(group => allActiveGroups.push(group.groupname))

    //if request groupnames in activegroups, do nothing
    //if request groupnames NOT in active groups, add group
    const groupsToAdd = groupnames.filter(g => !allActiveGroups.includes(g))

    if (groupsToAdd.length > 0) {
      for (let index = 0; index < groupsToAdd.length; index++) {
        let result = await User_Group.addUserToGroup(
          username,
          groupsToAdd[index]
        )
        console.log(result)
      }
    }
    //if active group NOT in request groups, remove group
    const groupsToRemove = allActiveGroups.filter(g => !groupnames.includes(g))

    if (groupsToRemove.length > 0) {
      for (let index = 0; index < groupsToRemove.length; index++) {
        let result = await User_Group.removeUserFromGroup(
          username,
          groupsToRemove[index]
        )
      }
    }
  }
}

exports.getAllUsersAndGroups = async (req, res, next) => {
  try {
    let [user_groups, _] = await User_Group.getAllUsersAndGroups()
    //console.log(user_groups)
    //convert groupnames string to array
    //store username and groupnames in json object

    let usergroupJSON = {}
    const key = "usergroups"
    usergroupJSON[key] = []

    for (let i = 0; i < user_groups.length; i++) {
      let groupnameArray
      if (user_groups[i].groupnames == null) {
        groupnameArray = []
      } else {
        groupnameArray = user_groups[i].groupnames.split(", ")
      }

      usergroupJSON[key].push({
        username: user_groups[i].username,
        groupnames: groupnameArray
      })
    }

    JSON.stringify(usergroupJSON)

    res.status(200).json({
      usergroupJSON
    })
  } catch (error) {
    return next(
      new ErrorHandler(
        400,
        "Something went wrong, unable to retrieve user groups"
      )
    )
  }
}

exports.getActiveGroupsByUsername = async (req, res, next) => {
  try {
    console.log("entered usergroup controller")
    let username = req.params.username
    console.log(username)
    const [groups, _] = await User_Group.getUserActiveGroupsByUsername(username)
    res.status(200).json({ groups })
  } catch (error) {
    console.log(error)
    next(error)
  }
}
