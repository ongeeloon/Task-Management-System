const jwt = require("jsonwebtoken")

function generateToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, 
        {expiresIn:'120m' }) 
}

module.exports = generateToken

