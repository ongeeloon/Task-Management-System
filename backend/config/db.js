const dotenv = require("dotenv").config() //allows environment variables to be set on process.env
const mysql = require("mysql2")

//create pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

//mysql.createPool is a place where connections get stored.
//When you request a connection from a pool,you will receive a connection that is not currently being used, or a new connection.
//If you're already at the connection limit, it will wait until a connection is available before it continues.

module.exports = pool.promise() //use promise to use async and await. mysql2 provides promise wrapper for async/await
