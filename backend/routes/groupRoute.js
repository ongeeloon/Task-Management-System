const express = require("express")
const router = express.Router()

//Controller
const {
  createNewGroup,
  getAllGroups,
  getGroupByGroupname
} = require("../controllers/groupController")

//Middleware
const { authenticateToken } = require("../middlewares/authenticateToken")
const { validateGroupnameObject } = require("../middlewares/validateInputs")

//Routes => "/api/group"
router
  .route("/create")
  .post(validateGroupnameObject, authenticateToken, createNewGroup)
router.route("/").get(authenticateToken, getAllGroups)
router.route("/:groupname").get(authenticateToken, getGroupByGroupname)

module.exports = router
