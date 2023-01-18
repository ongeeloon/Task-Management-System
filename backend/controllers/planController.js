const Plan = require("../models/Plan")
const { validationResult } = require("express-validator")
const ErrorHandler = require("../utils/ErrorHandler")

exports.createNewPlan = async (req, res, next) => {
  //validate inputs
  const validationErrors = await validationResult(req)
  if (!validationErrors.isEmpty()) {
    return res.status(422).json({
      validationErrors: validationErrors.array()
    })
    console.log(validationErrors)
  }
  else{

  //If input is valid
  let { planName, planStartDate, planEndDate, planAppAcronym, planColour } =
    req.body

  //Check if plan already exists in db
  const [existingPlan, _] = await Plan.findPlanByPlanNameAndAppName(
    planName,
    planAppAcronym
  )

  //If plan does not exist yet, proceed to create plan
  if (existingPlan[0] == null) {
    try {
      let newPlan = new Plan(
        planName,
        planStartDate,
        planEndDate,
        planAppAcronym,
        planColour
      )

      newPlan = await newPlan.insertNewPlan()

      console.log(newPlan)

      return res.status(201).json({
        newplancreated: newPlan,
        message: "New plan successfully created"
      })
    } catch (error) {
      console.log(error)
    }
  }
  //Plan already exists in DB
  else {
    return next(
      new ErrorHandler(
        401,
        "Plan already exists, please use a different plan name"
      )
    )
  }
}
}

exports.getAllPlansByAppName = async (req, res, next) => {
  try {
    let appname = req.params.appname
    console.log(appname)
    const [plans, _] = await Plan.findAllPlansByAppName(appname)
    res.status(200).json({ plans })
  } catch (error) {
    console.log(error)
    next(error)
  }
}
