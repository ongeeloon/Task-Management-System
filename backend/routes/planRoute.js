const express = require("express")
const router = express.Router()

//Controller
const {
  createNewPlan,
  getAllPlansByAppName
} = require("../controllers/planController")

//Middleware
const { authenticateToken } = require("../middlewares/authenticateToken")
const { authoriseRoles } = require("../middlewares/authoriseRoles")
const { validatePlanObject } = require("../middlewares/validateInputs")

//Routes => /api/plan
router
  .route("/create")
  .post(authenticateToken, validatePlanObject, createNewPlan)
router.route("/:appname").get(authenticateToken, getAllPlansByAppName)

module.exports = router
