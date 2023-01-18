const db = require("../config/db")

class Task {
  constructor(
    taskID,
    taskName,
    taskDescription,
    taskNotes,
    taskPlanName,
    taskAppAcronym,
    taskState,
    taskCreator,
    taskOwner,
    taskCreateDate
  ) {
    this.taskID = taskID
    this.taskName = taskName
    this.taskDescription = taskDescription
    this.taskNotes = taskNotes
    this.taskPlanName = taskPlanName
    this.taskAppAcronym = taskAppAcronym
    this.taskState = taskState
    this.taskCreator = taskCreator
    this.taskOwner = taskOwner
    this.taskCreateDate = taskCreateDate
  }

  insertNewTask() {
    if (this.taskPlanName == undefined) {
      this.taskPlanName = null
    } else {
      this.taskPlanName = `'${this.taskPlanName}'`
    }

    if (this.taskDescription == undefined) {
      this.taskDescription = ""
    } else {
      this.taskDescription = `${this.taskDescription}`
    }

    let sql = `INSERT INTO task(
      task_id,
      task_name,
      task_description, 
      task_notes,
      task_plan_name, 
      task_app_acronym,
      task_state, 
      task_creator, 
      task_owner,
      task_createdate
    )
    VALUES(
        '${this.taskID}',
        '${this.taskName}',
        "${this.taskDescription}",
        '${this.taskNotes}',
        ${this.taskPlanName},
        '${this.taskAppAcronym}',
        '${this.taskState}',
        '${this.taskCreator}',
        '${this.taskOwner}',
        "${this.taskCreateDate}"
        )`

    return db.execute(sql)
  }

  static findAllTasksByAppName(appName) {
    let sql = `SELECT * FROM task WHERE task_app_acronym='${appName}';`

    return db.execute(sql)
  }

  static findTaskByTaskID(taskID) {
    let sql = `SELECT * FROM task WHERE task_id='${taskID}';`

    return db.execute(sql)
  }

  static updateTaskByTaskID2(
    taskID,
    taskName,
    taskDescription,
    fullAuditLog,
    taskPlanName,
    taskState,
    taskOwner
  ) {
    if (taskPlanName == undefined) {
      taskPlanName = null
    } else {
      taskPlanName = `'${taskPlanName}'`
    }

    if (this.taskDescription == undefined) {
      this.taskDescription = ""
    } else {
      this.taskDescription = `${this.taskDescription}`
    }

    let sql = `UPDATE task
    SET 
      task_name='${taskName}', 
      task_description="${taskDescription}", 
      task_notes=CONCAT('${fullAuditLog}', task_notes), 
      task_plan_name=${taskPlanName}, 
      task_state='${taskState}',
      task_owner='${taskOwner}'
    WHERE 
      task_id='${taskID}'`

    return db.execute(sql)
  }

  static updateTaskState(taskID, newTaskState, currentUsername, fullAuditLog) {
    let sql = `UPDATE task
    SET 
      task_state='${newTaskState}',
      task_owner='${currentUsername}',
      task_notes=CONCAT('${fullAuditLog}', task_notes)
    WHERE 
      task_id='${taskID}'`

    return db.execute(sql)
  }

  static findAllTasksByTaskStateAndAppName(taskState, appName) {
    let sql = `SELECT * FROM task 
    WHERE task_state='${taskState}'
    AND task_app_acronym='${appName}' ;`

    return db.execute(sql)
  }
}

module.exports = Task
