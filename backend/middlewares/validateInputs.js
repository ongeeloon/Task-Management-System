const { check, validationResult } = require("express-validator")

exports.validateUserObject = [
  check("username")
    .isAlphanumeric()
    .withMessage(
      "Username can only contain alphanumeric characters, no whitespace allowed"
    )
    .isLength({ max: 15 })
    .withMessage("Username can only have a maximum of 15 characters")
    .trim() //trims whitespace
    .escape() //replace certain characters (i.e. <, >, /, &, ', ") with the corresponding HTML entity
    .toLowerCase(), //username not case sensitive
  check("password")
    .optional()
    .isLength({ min: 8, max: 10 })
    .withMessage("Password must be between 8 and 10 characters long")
    .matches("[0-9]")
    .withMessage("Password must contain a number")
    .matches(/[a-zA-Z]/)
    .withMessage("Password must contain a letter")
    .matches(/[!@#$%^&*]/)
    .withMessage(
      "Password must contain at least one special character (!@#$%^&*)"
    )
    .custom(value => {
      return !/\s/.test(value)
    })
    .withMessage("Password cannot contain any whitespace")
    .trim(),
  check("email")
    .isEmail()
    .withMessage("Email address must be in an appropriate format")
    .trim()
    .normalizeEmail() //ensures the email address is in a safe and standard format.
]

exports.validatePassword = [
  check("password")
    .isLength({ min: 8, max: 10 })
    .withMessage("Password must be between 8 and 10 characters long")
    .matches("[0-9]")
    .withMessage("Password must contain a number")
    .matches(/[a-zA-Z]/)
    .withMessage("Password must contain a letter")
    .matches(/[!@#$%^&*]/)
    .withMessage(
      "Password must contain at least one special character (!@#$%^&*)"
    )
    .custom(value => {
      return !/\s/.test(value)
    })
    .withMessage("Password cannot contain any whitespace")
    .trim()
]

exports.validateEmail = [
  check("email")
    .isEmail()
    .withMessage("Email address must be in an appropriate format")
    .trim()
    .normalizeEmail() //ensures the email address is in a safe and standard format.
]

//Groupname validation and sanitisation
exports.validateGroupnameObject = [
  check("groupname")
    .matches(/^[A-Za-z0-9_]+$/)
    .withMessage("Groupname can only contain letters, numbers and underscores")
    .custom(value => {
      return !/\s/.test(value)
    })
    .withMessage("Groupname cannot contain any whitespace")
    .isLength({ max: 20 })
    .withMessage("Groupname can only have a maximum of 20 characters")
    .trim()
    .escape()
]

exports.validateApplicationObject = [
  check("appName")
    .notEmpty()
    .withMessage("Name is required")
    .isAlphanumeric()
    .withMessage(
      "Name can only contain alphanumeric characters, no whitespace or special characters allowed"
    )
    .trim()
    .escape(),
  check("appDescription").optional().trim().escape(),
  check("appRNumber")
    .notEmpty()
    .withMessage("R number is required")
    .isInt()
    .withMessage("R number must be integer"),
  check("appStartDate").notEmpty().withMessage("Start date is required"),
  check("appEndDate").notEmpty().withMessage("End date is required"),
  check("appPermitCreate").notEmpty().withMessage("Create permission required"),
  check("appPermitOpen").notEmpty().withMessage("Open permission required"),
  check("appPermitToDo").notEmpty().withMessage("To Do permission required"),
  check("appPermitDoing").notEmpty().withMessage("Doing permission required"),
  check("appPermitDone").notEmpty().withMessage("Done permission required")
]

exports.validateTaskObject = [
  check("taskName").notEmpty().withMessage("Name is required").trim().escape(),
  check("taskDescription").optional().trim().escape(),
  check("taskNotes")
    .optional()
    .trim() //trims whitespace
    .escape(), //replace certain characters (i.e. <, >, /, &, ', ") with the corresponding HTML entity
  check("newNotes").optional().trim().escape(),
  check("taskPlanName").optional(),
  check("taskAppAcronym")
    .notEmpty()
    .withMessage("Associated application is required"),
  check("taskState").notEmpty().withMessage("Task state required"),
  check("taskCreator").notEmpty().withMessage("Task creator required"),
  check("taskOwner").notEmpty().withMessage("Task owner required"),
  check("taskCreateDate").exists().withMessage("Create date required")
]

exports.validatePlanObject = [
  check("planName")
    .notEmpty()
    .withMessage("Name is required")
    .matches(/^[A-Za-z0-9_.]+$/)
    .withMessage("Name can only contain letters, numbers, underscores and dots")
    .custom(value => {
      return !/\s/.test(value)
    })
    .withMessage("Name cannot contain any whitespace")
    .trim()
    .escape(),
  check("planStartDate").notEmpty().withMessage("Start date is required"),
  check("planEndDate").notEmpty().withMessage("End date is required"),
  check("planAppAcronym")
    .notEmpty()
    .withMessage("Associated application required"),
  check("planColour").notEmpty().withMessage("Plan colour required")
]
