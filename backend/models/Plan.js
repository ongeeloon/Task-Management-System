const db = require("../config/db")

class Plan {
  constructor(
    planName,
    planStartDate,
    planEndDate,
    planAppAcronym,
    planColour
  ) {
    this.planName = planName
    this.planStartDate = planStartDate
    this.planEndDate = planEndDate
    this.planAppAcronym = planAppAcronym
    this.planColour = planColour
  }

  insertNewPlan() {
    let sql = `INSERT INTO plan(
      plan_name,
      plan_startdate,
      plan_enddate, 
      plan_app_acronym,
      plan_colour
    )
    VALUES(
        '${this.planName}',
        "${this.planStartDate}",
        "${this.planEndDate}",
        '${this.planAppAcronym}',
        '${this.planColour}'
        )`

    return db.execute(sql)
  }

  static findAllPlansByAppName(appName) {
    let sql = `SELECT * FROM plan WHERE plan_app_acronym='${appName}';`

    return db.execute(sql)
  }

  static findPlanByPlanNameAndAppName(planName, appName) {
    let sql = `SELECT * FROM plan 
    WHERE plan_name='${planName}'
    AND plan_app_acronym='${appName}';`

    return db.execute(sql)
  }
}

module.exports = Plan
