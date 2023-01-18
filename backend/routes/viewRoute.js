//For React frontend

const express = require("express")
const router = express.Router()

//Controller
const { checkAdmin, getCurrentUser } = require("../controllers/viewController")

//Middleware
const { authenticateToken } = require("../middlewares/authenticateToken")

//Routes => "/api/views"
router.route("/checkAdmin").get(authenticateToken, checkAdmin)
router.route("/currentUser").get(authenticateToken, getCurrentUser)

module.exports = router
