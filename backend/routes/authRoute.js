const express = require("express")
const router = express.Router()

//Controller
const { login, logout } = require("../controllers/authController")

//Middleware
const { authenticateToken } = require("../middlewares/authenticateToken")

//Routes => "/api/auth"

router.route("/login").post(login)
router.route("/logout").get(authenticateToken, logout)

module.exports = router
