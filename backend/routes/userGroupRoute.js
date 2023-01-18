const express = require("express")
const router = express.Router()

//Controller
const {
  addUserToGroup,
  removeUserFromGroup,
  // getAllUsersWithActiveGroups,
  editUserGroups,
  getAllUsersAndGroups,
  getActiveGroupsByUsername
} = require("../controllers/userGroupController")

//Middleware
const { authenticateToken } = require("../middlewares/authenticateToken")

//Routes => "/api/userGroup"
router.route("/add").post(authenticateToken, addUserToGroup)
router.route("/remove").post(authenticateToken, removeUserFromGroup)
//router.route("/getAllActiveUserGroups").get(authenticateToken, getAllUsersWithActiveGroups)
router
  .route("/getAllUsersAndGroups")
  .get(authenticateToken, getAllUsersAndGroups)
router.route("/edit").post(authenticateToken, editUserGroups)
router.route("/:username").get(authenticateToken, getActiveGroupsByUsername)

module.exports = router
