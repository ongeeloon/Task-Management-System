const GroupM = require("../models/GroupM")
const { validationResult } = require("express-validator")
const ErrorHandler = require("../utils/ErrorHandler")

exports.createNewGroup = async (req, res, next) => {
  
   //validate inputs
   const validationErrors = await validationResult(req)
   if (!validationErrors.isEmpty()) {
     return res.status(422).json({
       validationErrors: validationErrors.array()
     })
     console.log(validationErrors)
   }
  //If input is valid
  else {
    let { groupname } = req.body
    console.log("groupname reached groupcontroller:", groupname)
    //Check if groupname already exists in db
    const [existingGroupname, _] = await GroupM.findGroupByGroupname(groupname)
    console.log(existingGroupname)
    //If groupname does not exist yet, proceed to create group
    if (existingGroupname[0] == null) {
      try {
        let groupM = new GroupM(groupname)
        groupM = await groupM.insertNewGroup()
        console.log(groupM)
        res.status(201).json({
          newgroupcreated: groupM,
          message: "New group successfully created"
        })
      } catch (error) {
        console.log(error)
      }
    }
    //Groupname already exists in db
    else {
      return next(
        new ErrorHandler(
          401,
          "Groupname already exists, please use a different groupname"
        )
      )
    }
  }
}

exports.getAllGroups = async (req, res, next) => {
  try {
    const [groups, _] = await GroupM.findAllGroups()
    res.status(200).json({ groups })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

exports.getGroupByGroupname = async (req, res, next) => {
  try {
    let groupname = req.params.groupname
    let [group, _] = await GroupM.findGroupByGroupname(groupname)
    res.status(200).json({ group })
  } catch (error) {
    console.log(error)
    next(error) //need to change error handling mechanisms
  }
}
