const express = require("express")
const router = express.Router()

//Controller
const {
  createNewUser,
  getAllUsers,
  getUserByUsername,
  updatePasswordUser,
  updateEmailUser,
  updateProfileAdmin
} = require("../controllers/userController")

//Middleware
const { authenticateToken } = require("../middlewares/authenticateToken")
const { authoriseRoles } = require("../middlewares/authoriseRoles")
const { validateUserObject, validateEmail, validatePassword } = require("../middlewares/validateInputs")
//authoriseRoles('admin')

//Routes => "/api/users"
router.route("/create").post(authenticateToken, validateUserObject, createNewUser)
router.route("/").get(authenticateToken, getAllUsers)
router.route("/:username").get(authenticateToken, getUserByUsername)
//User update password
router.route("/updatePassword").post(authenticateToken, validatePassword, updatePasswordUser) 
//User update email
router.route("/updateEmail").post(authenticateToken, validateEmail, updateEmailUser) 
//Admin update user's profile
router.route("/adminUpdateAll").post(authenticateToken, validateUserObject, updateProfileAdmin) 

module.exports = router
