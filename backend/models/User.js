const db = require("../config/db")

class User {
  constructor(username, password, email, statusActive) {
    this.username = username
    this.password = password
    this.email = email
    this.statusActive = statusActive
  }

  insertNewUser() {
    let sql = `INSERT INTO user(
      username,
      password, 
      email, 
      statusActive
      ) VALUES(
        '${this.username}',
        '${this.password}',
        '${this.email}',
        ${this.statusActive}
        )`

    return db.execute(sql)
  }

  static findAllUsers() {
    let sql = "SELECT * FROM user;"

    return db.execute(sql)
  }

  static findUserByUsername(username) {
    let sql = `SELECT * FROM user WHERE username='${username}';`

    return db.execute(sql)
  }

  static updatePassword(username, newPassword) {
    let sql = `UPDATE user 
    SET password = '${newPassword}' 
    WHERE username = '${username}'`

    return db.execute(sql)
  }

  static updateEmail(username, newEmail) {
    let sql = `UPDATE user 
    SET email = '${newEmail}' 
    WHERE username = '${username}'`

    return db.execute(sql)
  }

  static updateStatusActive(username, newStatus) {
    let sql = `UPDATE user 
    SET statusActive = ${newStatus} 
    WHERE username = '${username}'`

    return db.execute(sql)
  }

  static findEmailByUsername(username) {
    let sql = `SELECT email FROM user WHERE username='${username}';`

    return db.execute(sql)
  }
}

module.exports = User
