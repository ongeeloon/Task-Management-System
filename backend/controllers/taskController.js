const Task = require("../models/Task")
const User_Group = require("../models/User_Group")
const User = require("../models/User")
const Application = require("../models/Application")
const { validationResult } = require("express-validator")
const ErrorHandler = require("../utils/ErrorHandler")
const sendEmail = require("../utils/sendEmail")

exports.createNewTask = async (req, res, next) => {
  //validate inputs
  const validationErrors = await validationResult(req)
  if (!validationErrors.isEmpty()) {
    return res.status(422).json({
      validationErrors: validationErrors.array()
    })
    console.log(validationErrors)
  } else {
    //If input is valid
    let {
      taskName,
      taskDescription,
      taskNotes,
      taskPlanName,
      taskAppAcronym,
      taskState,
      taskCreator,
      taskOwner,
      taskCreateDate
    } = req.body

    //Create task ID from app_acronym + running number
    //Get R number from app
    const [appRNumber, __] = await Application.getRNumberByAppName(
      taskAppAcronym
    )
    console.log(appRNumber[0].app_RNumber)
    const originalRNumber = appRNumber[0].app_RNumber
    const RNumberPlusOne = originalRNumber + 1
    const taskID = taskAppAcronym + "_" + RNumberPlusOne.toString()
    console.log(taskID)

    //Assign new R number back to app
    const [result, ___] = await Application.updateRNumber(
      taskAppAcronym,
      RNumberPlusOne
    )

    //Check if task ID already exists in DB
    const [existingTaskID, _] = await Task.findTaskByTaskID(taskID)

    //If task ID does not exist yet, proceed to create task
    if (existingTaskID[0] == null) {
      try {
        let fullAuditLog = await generateCreateNewTaskAuditLog(
          taskOwner,
          taskState,
          taskNotes
        )

        let newTask = new Task(
          taskID,
          taskName,
          taskDescription,
          fullAuditLog,
          taskPlanName,
          taskAppAcronym,
          taskState,
          taskCreator,
          taskOwner,
          taskCreateDate
        )

        newTask = await newTask.insertNewTask()
        console.log(newTask)

        //get the newly created task object
        const [myNewTask, _] = await Task.findTaskByTaskID(taskID)
        console.log(myNewTask[0])

        return res.status(201).json({
          newtaskcreated: myNewTask[0],
          message: "New task successfully created"
        })
      } catch (error) {
        console.log(error)
      }
    }
    //Task ID in db
    else {
      return next(new ErrorHandler(401, "Task ID already exists"))
    }
  }
}

exports.getAllTasksByAppName = async (req, res, next) => {
  try {
    const appName = req.params.appname
    const [tasks, _] = await Task.findAllTasksByAppName(appName)
    res.status(200).json({ tasks })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

exports.editTask = async (req, res, next) => {
  //validate inputs
  const validationErrors = await validationResult(req)
  if (!validationErrors.isEmpty()) {
    return res.status(422).json({
      validationErrors: validationErrors.array()
    })
    console.log(validationErrors)
  } else {
    //If input is valid
    let {
      taskID,
      taskName,
      taskDescription,
      newNotes,
      taskPlanName,
      taskState,
      taskOwner
    } = req.body

    //Find task by task ID
    const [editingTask, _] = await Task.findTaskByTaskID(taskID)

    //If task exists, edit task
    if (editingTask[0]) {
      try {
        const fullAuditLog = await generateEditTaskAuditLog(
          editingTask,
          taskName,
          taskDescription,
          taskPlanName,
          newNotes,
          taskOwner,
          taskState
        )
        console.log("full audit log if no change: " + fullAuditLog)

        if (fullAuditLog == "") {
          return res.status(400).json({
            message:
              "Task fields have not been changed. Unable to process request."
          })
        } else {
          let updatedTask = await Task.updateTaskByTaskID2(
            taskID,
            taskName,
            taskDescription,
            fullAuditLog,
            taskPlanName,
            taskState,
            taskOwner
          )
          console.log(updatedTask)

          //get the updated task object
          const [myEditedTask, _] = await Task.findTaskByTaskID(taskID)
          console.log(myEditedTask[0])

          return res.status(200).json({
            editedTask: myEditedTask[0],
            message: "Task successfully edited"
          })
        }
      } catch (error) {
        console.log(error)
      }
    }
    //Task ID does not exist in db
    else {
      return next(
        new ErrorHandler(
          400,
          "Bad request. The request could not be understood by the server due to malformed syntax."
        )
      )
    }
  }
}

exports.editTaskState = async (req, res, next) => {
  let { taskID, newState, currentUsername } = req.body

  //Find task by task ID
  const [editingTask, _] = await Task.findTaskByTaskID(taskID)

  //If task exists, edit task
  if (editingTask[0]) {
    try {
      //update task
      const fullAuditLog = await generateUpdateTaskStateAuditLog(
        currentUsername,
        newState
      )

      let taskChangedState = await Task.updateTaskState(
        taskID,
        newState,
        currentUsername,
        fullAuditLog
      )
      console.log(taskChangedState)

      //get the updated task object
      const [myEditedTask, _] = await Task.findTaskByTaskID(taskID)
      console.log(myEditedTask[0])

      //Send email to project lead if state change to done
      if (newState == "Done") {
        //get all project leads
        const [projectLeads, _] = await User_Group.getAllProjectLeads()
        console.log(projectLeads)

        //get emails of project leads and send email
        for (let i = 0; i < projectLeads.length; i++) {
          const username = projectLeads[i].username
          console.log(username)
          const [emailAddress, _] = await User.findEmailByUsername(username)
          console.log(emailAddress[0].email)
          sendEmail(taskID, currentUsername, newState, emailAddress[0].email)
        }
      }

      return res.status(200).json({
        editedTask: myEditedTask[0]
      })
    } catch (error) {
      console.log(error)
    }
  }
  //Task ID does not exist in db
  else {
    return next(
      new ErrorHandler(
        400,
        "Bad request. The request could not be understood by the server due to malformed syntax."
      )
    )
  }
}
async function generateCreateNewTaskAuditLog(taskOwner, taskState, taskNotes) {
  let actions = []
  actions.push("Task created")

  let fullAuditLog = ""
  if (actions.length > 0) {
    fullAuditLog += await generateAuditLog(taskOwner, taskState, actions)
  }
  if (taskNotes !== undefined) {
    fullAuditLog += await generateAuditLogNotes(taskOwner, taskState, taskNotes)
  }

  return fullAuditLog
}

async function generateEditTaskAuditLog(
  editingTask,
  taskName,
  taskDescription,
  taskPlanName,
  newNotes,
  taskOwner,
  taskState
) {
  let actions = []

  if (taskName !== editingTask[0].task_name) {
    actions.push("Task name updated")
  }
  if (taskDescription !== editingTask[0].task_description) {
    actions.push("Task description updated")
  }
  if (taskPlanName !== editingTask[0].task_plan_name) {
    actions.push("Task plan updated")
  }

  let fullAuditLog = ""
  if (actions.length > 0) {
    fullAuditLog += await generateAuditLog(taskOwner, taskState, actions)
  }
  if (newNotes !== "") {
    fullAuditLog += await generateAuditLogNotes(taskOwner, taskState, newNotes)
  }

  return fullAuditLog
}

async function generateUpdateTaskStateAuditLog(taskOwner, taskState) {
  let actions = []
  actions.push("Task state updated")

  let fullAuditLog = ""
  if (actions.length > 0) {
    fullAuditLog += await generateAuditLog(taskOwner, taskState, actions)
  }
  return fullAuditLog
}

async function generateAuditLog(taskOwner, taskState, actions) {
  const timestampString = generateTimestamp()
  const taskOwnerString = `${taskOwner}`
  const taskStateString = `${taskState}`
  const actionsString = actions.join(", ")

  const auditTrail =
    timestampString +
    " | " +
    taskStateString +
    " | " +
    taskOwnerString +
    " - " +
    actionsString +
    "\n"

  return auditTrail
}

async function generateAuditLogNotes(taskOwner, taskState, newNotes) {
  const timestampString = generateTimestamp()
  const taskOwnerString = `${taskOwner}`
  const taskStateString = `${taskState}`
  const notesString = `${newNotes}`
  console.log(notesString)

  const auditTrail =
    timestampString +
    " | " +
    taskStateString +
    " | " +
    taskOwnerString +
    " - " +
    "New Notes Added: " +
    notesString +
    "\n"

  return auditTrail
}

function generateTimestamp() {
  const timestamp = Date.now()
  const dateObject = new Date(timestamp)
  const day = dateObject.getDate()
  const month = dateObject.getMonth() + 1
  const year = dateObject.getFullYear()
  const hours = dateObject.getHours()
  const minutes = dateObject.getMinutes()
  const seconds = dateObject.getSeconds()

  const timestampString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  return timestampString
}
