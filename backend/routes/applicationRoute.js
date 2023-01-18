const express = require("express")
const router = express.Router()

//Controller
const {
  createNewApplication,
  getAllApplications,
  getApplicationByAppName,
  editApplication,
  getApplicationPermissions
} = require("../controllers/applicationController")

//Middleware
const { authenticateToken } = require("../middlewares/authenticateToken")
const { authoriseRoles } = require("../middlewares/authoriseRoles")
const { validateApplicationObject } = require("../middlewares/validateInputs")

//Routes => /api/application
router
  .route("/create")
  .post(authenticateToken, validateApplicationObject, createNewApplication)
router.route("/").get(authenticateToken, getAllApplications)
router.route("/:appName").get(authenticateToken, getApplicationByAppName)
router
  .route("/permissions/:appName")
  .get(authenticateToken, getApplicationPermissions)
router
  .route("/edit")
  .post(authenticateToken, validateApplicationObject, editApplication)

module.exports = router
