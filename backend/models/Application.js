const db = require("../config/db")

class Application {
  constructor(
    appName,
    appDescription,
    appRNumber,
    appStartDate,
    appEndDate,
    appPermitCreate,
    appPermitOpen,
    appPermitToDo,
    appPermitDoing,
    appPermitDone
  ) {
    this.appName = appName
    this.appDescription = appDescription
    this.appRNumber = appRNumber
    this.appStartDate = appStartDate
    this.appEndDate = appEndDate
    this.appPermitCreate = appPermitCreate
    this.appPermitOpen = appPermitOpen
    this.appPermitToDo = appPermitToDo
    this.appPermitDoing = appPermitDoing
    this.appPermitDone = appPermitDone
  }

  insertNewApplication() {
    if (this.appDescription == undefined) {
      this.appDescription = ""
    } else {
      this.appDescription = `${this.appDescription}`
    }

    let sql = `INSERT INTO application(
      app_acronym,
      app_description, 
      app_RNumber, 
      app_startdate, 
      app_enddate, 
      app_permitcreate, 
      app_permitopen, 
      app_permittodo, 
      app_permitdoing, 
      app_permitdone
    )
    VALUES(
        '${this.appName}',
        "${this.appDescription}",
        ${this.appRNumber},
        "${this.appStartDate}",
        "${this.appEndDate}",
        '${this.appPermitCreate}',
        '${this.appPermitOpen}',
        '${this.appPermitToDo}',
        '${this.appPermitDoing}',
        '${this.appPermitDone}'
        )`

    return db.execute(sql)
  }

  static findAllApplications() {
    let sql = "SELECT * FROM application;"

    return db.execute(sql)
  }

  static findApplicationByAppName(appName) {
    let sql = `SELECT * FROM application WHERE app_acronym='${appName}';`

    return db.execute(sql)
  }

  static getApplicationPermissions(appName) {
    let sql = `SELECT 
      app_permitcreate,
      app_permitopen, 
      app_permittodo,      
      app_permitdoing,
      app_permitdone
    FROM application WHERE app_acronym='${appName}';`

    return db.execute(sql)
  }

  static updateApplicationByAppName(
    appName,
    appDescription,
    appStartDate,
    appEndDate,
    appPermitCreate,
    appPermitOpen,
    appPermitToDo,
    appPermitDoing,
    appPermitDone
  ) {
    if (appDescription == undefined) {
      appDescription = ""
    } else {
      appDescription = `'${appDescription}'`
    }

    let sql = `UPDATE application
    SET 
      app_description=${appDescription}, 
      app_startdate="${appStartDate}", 
      app_enddate="${appEndDate}", 
      app_permitcreate='${appPermitCreate}',
      app_permitopen='${appPermitOpen}', 
      app_permittodo='${appPermitToDo}',
      app_permitdoing='${appPermitDoing}',
      app_permitdone='${appPermitDone}'
    WHERE 
    app_acronym='${appName}'`

    return db.execute(sql)
  }

  static getRNumberByAppName(appName) {
    let sql = `SELECT app_RNumber FROM application WHERE app_acronym='${appName}';`

    return db.execute(sql)
  }

  static updateRNumber(appName, newRNumber) {
    let sql = `UPDATE application
    SET app_RNumber=${newRNumber} 
    WHERE app_acronym='${appName}';`

    return db.execute(sql)
  }
}

module.exports = Application
