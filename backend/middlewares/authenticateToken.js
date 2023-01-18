const jwt = require("jsonwebtoken")

exports.authenticateToken = (req, res, next) => {
    const token =  req.cookies['accessToken']
    // const token = authHeader && authHeader.split(' ')[1] //split it with a space because there's a space between bearer and token. [1] to get second item in the array. authheader && -- if we have an authheader, then return the auth header token portion which we split up with the space. else, return undefined. 

    //if there is no token, let user know they don't yet have a token 
    if(token == null){
        return res.sendStatus(401)
    }

    //if token exists, verify the token 
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, jwtUser) => {
        if(err) return res.sendStatus(403)
        req.user = jwtUser
        next()
    })

  }

//adam3 accesstoken
//req header - key: authorization, value: Bearer ____(access token)
  //"accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWRhbTMiLCJpYXQiOjE2NjUzMDIyODN9.AMh4AIY8sPI1denrwb9TnrGl_nZAuqZPE0k1yKDAdiY"