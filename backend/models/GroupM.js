const db = require("../config/db")

class GroupM {
  constructor(groupname) {
    this.groupname = groupname
  }

  insertNewGroup() {
    let sql = `INSERT INTO groupm(
      groupname
      ) 
      VALUES(
        '${this.groupname}'
        )`

    return db.execute(sql)
  }

  static findAllGroups() {
    let sql = "SELECT * FROM groupm;"

    return db.execute(sql)
  }

  static findGroupByGroupname(groupname) {
    let sql = `SELECT * FROM groupm WHERE groupname='${groupname}';`

    return db.execute(sql)
  }
}

module.exports = GroupM
