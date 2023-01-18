const Application = require("../models/Application")
const { validationResult } = require("express-validator")
const ErrorHandler = require("../utils/ErrorHandler")

exports.createNewApplication = async (req, res, next) => {
  //validate inputs
  const validationErrors = await validationResult(req)
  if (!validationErrors.isEmpty()) {
    return res.status(422).json({
      validationErrors: validationErrors.array()
    })
    console.log(validationErrors)
  } else {
    //If input is valid
    let {
      appName,
      appDescription,
      appRNumber,
      appStartDate,
      appEndDate,
      appPermitCreate,
      appPermitOpen,
      appPermitToDo,
      appPermitDoing,
      appPermitDone
    } = req.body

    //Check if app name already exists in DB
    const [existingAppName, _] = await Application.findApplicationByAppName(
      appName
    )

    //If app name does not exist yet, proceed to create application
    if (existingAppName[0] == null) {
      try {
        let newApp = new Application(
          appName,
          appDescription,
          appRNumber,
          appStartDate,
          appEndDate,
          appPermitCreate,
          appPermitOpen,
          appPermitToDo,
          appPermitDoing,
          appPermitDone
        )

        newApp = await newApp.insertNewApplication()
        console.log(newApp)

        //get the newly created app object
        const [myNewApp, _] = await Application.findApplicationByAppName(
          appName
        )
        console.log(myNewApp[0])

        return res.status(201).json({
          newappcreated: myNewApp[0],
          message: "New application successfully created"
        })
      } catch (error) {
        console.log(error)
      }
    }
    //Appname already exists in db
    else {
      return next(
        new ErrorHandler(
          401,
          "Application name already exists, please use a different name"
        )
      )
    }
  }
}

exports.getAllApplications = async (req, res, next) => {
  try {
    const [applications, _] = await Application.findAllApplications()
    res.status(200).json({ applications })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

exports.getApplicationByAppName = async (req, res, next) => {
  try {
    let appName = req.params.appName
    let [application, _] = await Application.findApplicationByAppName(appName)
    res.status(200).json({ application })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

exports.getApplicationPermissions = async (req, res, next) => {
  try {
    let appName = req.params.appName
    let [appPermissions, _] = await Application.getApplicationPermissions(
      appName
    )

    res.status(200).json({ appPermissions })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

exports.editApplication = async (req, res, next) => {
  //validate inputs
  const validationErrors = await validationResult(req)
  if (!validationErrors.isEmpty()) {
    return res.status(422).json({
      validationErrors: validationErrors.array()
    })
    console.log(validationErrors)
  } else {
    //If input is valid
    let {
      appName,
      appDescription,
      appRNumber,
      appStartDate,
      appEndDate,
      appPermitCreate,
      appPermitOpen,
      appPermitToDo,
      appPermitDoing,
      appPermitDone
    } = req.body

    //Find app by appname
    const [editingApp, _] = await Application.findApplicationByAppName(appName)

    //If app exists, edit app
    if (editingApp[0]) {
      try {
        //update app
        let updatedApp = await Application.updateApplicationByAppName(
          appName,
          appDescription,
          appStartDate,
          appEndDate,
          appPermitCreate,
          appPermitOpen,
          appPermitToDo,
          appPermitDoing,
          appPermitDone
        )
        console.log(updatedApp)

        return res.status(200).json({
          message: "Application successfully edited"
        })
      } catch (error) {
        console.log(error)
      }
    }
    //Appname does not exist in the db
    else {
      return next(
        new ErrorHandler(
          400,
          "Bad request. The request could not be understood by the server due to malformed syntax."
        )
      )
    }
  }
}
