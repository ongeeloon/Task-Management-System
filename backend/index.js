const dotenv = require("dotenv").config() //allows environment variables to be set on process.env
const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const xssClean = require("xss-clean")
const hpp = require("hpp")
const errorHandling = require("./middlewares/errorHandling")

const app = express()
app.use(express.json()) // to parse json bodies in the request object (jwtauth requires)
app.use(cors({ credentials: true, origin: "http://127.0.0.1:3000" })) //for Cross-Origin Resource Sharing
app.use(cookieParser()) // Set cookie parser
app.use(xssClean()) // Prevent XSS attacks
app.use(hpp()) // Prevent Parameter Pollution

//Import all routes
const authRoute = require("./routes/authRoute")
const userRoute = require("./routes/userRoute")
const groupRoute = require("./routes/groupRoute")
const userGroupRoute = require("./routes/userGroupRoute")
const viewRoute = require("./routes/viewRoute")
const applicationRoute = require("./routes/applicationRoute")
const taskRoute = require("./routes/taskRoute")
const planRoute = require("./routes/planRoute")

app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/group", groupRoute)
app.use("/api/userGroup", userGroupRoute)
app.use("/api/views", viewRoute)
app.use("/api/application", applicationRoute)
app.use("/api/task", taskRoute)
app.use("/api/plan", planRoute)

//Error handling middleware
app.use(errorHandling)

//Listen on pc port
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
