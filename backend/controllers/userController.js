const User = require("../models/User")
const User_Group = require("../models/User_Group")
const bcrypt = require("bcryptjs")
const { validationResult } = require("express-validator")
const ErrorHandler = require("../utils/ErrorHandler")

exports.createNewUser = async (req, res, next) => {
  //validate inputs
  const validationErrors = await validationResult(req)
  if (!validationErrors.isEmpty()) {
    console.log(`Validation Errors: ${validationErrors.errors}`)
    return res.status(422).json({
      validationErrors: validationErrors.array()
    })
    console.log(validationErrors)
  }
  //If input is valid
  else {
    let { username, password, email, statusActive } = req.body

    //Check if username already exists in db
    const [existingUsername, _] = await User.findUserByUsername(username)

    //If username doesn't exist in db, proceed to create user
    if (existingUsername[0] == null) {
      try {
        let hashedPassword = await bcrypt.hash(password, 10) //hash password (plain text password, saltRounds)
        let user = new User(username, hashedPassword, email, statusActive)
        user = await user.insertNewUser()
        console.log(user)

        return res.status(201).json({
          newusercreated: user,
          message: "New user successfully created"
        })
      } catch (error) {
        console.log(error)
      }
    }
    //Username already exists in db
    else {
      return next(
        new ErrorHandler(
          401,
          "Username already exists, please use a different username"
        )
      )
    }
  }
}

exports.getAllUsers = async (req, res, next) => {
  try {
    const [users, _] = await User.findAllUsers()
    res.status(200).json({ users })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

exports.getUserByUsername = async (req, res, next) => {
  try {
    let username = req.params.username
    let [user, _] = await User.findUserByUsername(username)
    res.status(200).json({ user }) //to extract first user of the array instead of the whole thing - user: user[0]. So that we have user as an object
  } catch (error) {
    console.log(error)
    next(error) //need to change error handling mechanisms
  }
}

//users update their own profiles - password, email
exports.updatePasswordUser = async (req, res, next) => {
  //get username from jwt token
  const username = req.user.name
  //validate inputs
  console.log(req)
  const validationErrors = await validationResult(req)
  if (!validationErrors.isEmpty()) {
    return res.status(422).json({
      validationErrors: validationErrors.array()
    })
    console.log(validationErrors)
  }
  //If input is valid
  else {
    try {
      let { password } = req.body
      //hash password (plain text password, saltRounds)
      let hashedPassword = await bcrypt.hash(password, 10)
      let result = await User.updatePassword(username, hashedPassword)
      res.status(200).json({
        updatedPassword: hashedPassword,
        message: "User password successfully updated"
      })
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
}

exports.updateEmailUser = async (req, res, next) => {
  //get username from jwt token
  const username = req.user.name
  //validate inputs
  console.log(req)
  const validationErrors = await validationResult(req)
  if (!validationErrors.isEmpty()) {
    return res.status(422).json({
      validationErrors: validationErrors.array()
    })
    console.log(validationErrors)
  }
  //If input is valid
  else {
    try {
      let { email } = req.body
      let result = await User.updateEmail(username, email)
      res.status(200).json({
        updatedEmail: email,
        message: "User email successfully updated"
      })
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
}
//admins update the users' profiles - password, email, activeStatus
exports.updateProfileAdmin = async (req, res, next) => {
  //need to check which fields have been updated, update only the fields updated in front end
  const validationErrors = await validationResult(req)
  if (!validationErrors.isEmpty()) {
    return res.status(422).json({
      validationErrors: validationErrors.array()
    })
    console.log(validationErrors)
  } else {
    if (req.body) {
      let password = ""
      let { username, email, statusActive } = req.body
      if (req.body.password) {
        password = req.body.password
      }
      console.log(
        `Username: ${username}, password: ${password}, email: ${email}, statusActive: ${statusActive}`
      )

      let user = await User.findUserByUsername(username)
      if (password !== "") {
        let hashedPassword = await bcrypt.hash(password, 10)
        let result = await User.updatePassword(username, hashedPassword)
        console.log("Password updated")
      }
      if (email !== user.email) {
        await User.updateEmail(username, email)
        console.log("Email updated")
      }
      if (statusActive !== user.statusActive) {
        await User.updateStatusActive(username, statusActive)
        console.log("Status Active updated")
      }

      res.status(200).json({
        message: "User updated"
      })
    } else {
      //Request does not contain the updated user
      return next(
        new ErrorHandler(401, "Updated entity was not sent in the right schema")
      )
    }
  }
  //validate inputs before update
  //promise.all()
}

//With "salt round" they actually mean the cost factor. The cost factor controls how much time is needed to calculate a single BCrypt hash. The higher the cost factor, the more hashing rounds are done. Increasing the cost factor by 1 doubles the necessary time
