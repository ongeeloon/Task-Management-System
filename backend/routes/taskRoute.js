const express = require("express")
const router = express.Router()

//Controller
const {
  createNewTask,
  getAllTasksByAppName,
  editTask,
  editTaskState
} = require("../controllers/taskController")

//Middleware
const { authenticateToken } = require("../middlewares/authenticateToken")
const { authoriseRoles } = require("../middlewares/authoriseRoles")
const { validateTaskObject } = require("../middlewares/validateInputs")

//Routes => /api/task
router
  .route("/create")
  .post(authenticateToken, validateTaskObject, createNewTask)
router.route("/:appname").get(authenticateToken, getAllTasksByAppName)
router.route("/edit").post(authenticateToken, validateTaskObject, editTask)
router.route("/editState").post(authenticateToken, editTaskState)

module.exports = router
