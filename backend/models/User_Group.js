const db = require("../config/db")

class User_Group {
  constructor(username, groupname, isActive) {
    this.username = username
    this.groupname = groupname
    this.isActive = isActive
  }

  static async checkIfUserGroupExists(username, groupname) {
    let sql = `SELECT * 
    FROM user_group
    WHERE username = '${username}'
    AND groupname = '${groupname}'`

    const [userGroup, _] = await db.execute(sql)
    console.log(userGroup)
    if (userGroup.length === 0) {
      return false
    } else {
      return true
    }
  }

  static async checkIfUserGroupActive(username, groupname) {
    let sql = `SELECT isActive
    FROM user_group
    WHERE username = '${username}'
    AND groupname = '${groupname}'`

    const [isActive, _] = await db.execute(sql)
    return isActive
  }

  static updateUserGroupToActive(username, groupname) {
    let sql = `UPDATE user_group
    SET isActive = true
    WHERE username = '${username}' 
    AND groupname = '${groupname}' ;`

    return db.execute(sql)
  }
  static async addUserToGroup(username, groupname) {
    if ((await this.checkIfUserGroupExists(username, groupname)) == true) {
      //If userGroup exists in db
      if ((await this.checkIfUserGroupActive(username, groupname)) == true) {
        //If currently active, don't need to do anything
        return
      }
      return this.updateUserGroupToActive(username, groupname) //If currently inactive, activate
    } else {
      //If userGroup does not exist yet, insert new entry
      let sql = `INSERT INTO user_group(
      username,
      groupname,
      isActive
      ) VALUES(
        '${username}',
        '${groupname}',
        true
        )`

      return db.execute(sql)
    }
  }

  static async removeUserFromGroup(username, groupname) {
    if ((await this.checkIfUserGroupExists(username, groupname)) == true) {
      //If userGroup exists in db
      if ((await this.checkIfUserGroupActive(username, groupname)) == false) {
        //If currently inactive, don't need to do anything
        return
      }
      //If currently active, deactivate
      let sql = `UPDATE user_group
      SET isActive = false
      WHERE username = '${username}' 
      AND groupname = '${groupname}' ;`

      return db.execute(sql)
    } else {
      //usergroup does not exist in db, return
      return
    }
  }

  static async getUserActiveGroupsByUsername(username) {
    let sql = `SELECT groupname 
    FROM user_group 
    WHERE username = '${username}'
    AND isActive = true
    `
    return db.execute(sql)
  }

  static async getAllUsersWithActiveGroups() {
    let sql = `SELECT username, 
    GROUP_CONCAT(groupname) as "groupnames" 
    FROM user_group 
    WHERE isActive = true 
    GROUP BY username`

    return db.execute(sql)
  }

  static async getAllUsersAndGroups() {
    let sql = `SELECT user.username, 
    GROUP_CONCAT(user_group.groupname ORDER BY user_group.groupname ASC SEPARATOR ', ')
    as 'groupnames'
    FROM user 
    LEFT JOIN user_group 
    ON user.username = user_group.username 
    AND user_group.isActive=true
    GROUP BY user.username `

    return db.execute(sql)
  }

  static async getAllProjectLeads() {
    let sql = `SELECT username 
    FROM user_group 
    WHERE groupname = 'project-lead'
    AND isActive = true
    `

    return db.execute(sql)
  }
}

module.exports = User_Group
