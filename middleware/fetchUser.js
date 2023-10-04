const jwt = require("jsonwebtoken")
const JWT_SECRECT = "-mjaED8muHZY7Wdi6C1ZF8UccgHZ0-rPfCQUKUOHC1s"

const fetchUser = async (req, res, next) => {
    const token = await req.header('auth-token')
    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }
    try {
        const data = jwt.verify(token, JWT_SECRECT)
        req.user = data.user
        next()
    } catch (error) {
        console.log(error.message)
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }
}

module.exports = fetchUser
