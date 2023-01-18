const { text } = require("body-parser")
const nodemailer = require("nodemailer")

function sendEmail(taskID, currentUsername, newState, emailAddress) {
  var transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "a9e01df7f242f2",
      pass: "de19cecbfe3ef5"
    }
  })

  var mailOptions = {
    from: "a9e01df7f242f2",
    to: `${emailAddress}`,
    subject: `Task ID <${taskID}> Status Update`,
    text: `Hello,
    This email is to inform you that Task ID ${taskID} has been set to ${newState} by ${currentUsername}. Thank you!`
  }

  transport.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
    } else {
      console.log("Email sent: " + info.response)
    }
  })
}

module.exports = sendEmail
