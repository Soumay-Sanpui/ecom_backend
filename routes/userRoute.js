const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fetchUser = require('../middleware/fetchUser.js')
const { body, validationResult } = require('express-validator')
const User = require('../models/User')

const JWT_SECRECT = "-mjaED8muHZY7Wdi6C1ZF8UccgHZ0-rPfCQUKUOHC1s"

const router = express.Router()

// Route 1: Creating User
// Route 1: Creating User
router.post('/createuser', [
    body('name', "Enter a valid Name").isLength({ min: 5 }),
    body('email', "Enter a valid Email").isEmail(),
    body('password', "Enter a strong password").isLength({ min: 6 }),
    body('age', "Enter a valid Age").isInt({ min: 0 }),
    body('gender', "Enter a valid Gender").isIn(['Male', 'Female', 'Other']),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { name, email, password, age, gender } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: "User with the same email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(password, salt);

        user = await User.create({
            name,
            email,
            password: secPass,
            age,
            gender,
        });

        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRECT);
        console.log(authToken);
        res.json({ authToken });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});


//Route 2: Loging User 
router.post('/login', [
    body('email', "Enter a valid Email : ").isEmail(),
    body('password', "Enter a Password : ").exists()
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() })
    }

    const { email, password } = req.body
    try {
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ error: "Please enter correct credential" })
        }
        const passwordCompare = await bcrypt.compare(password, user.password)
        if (!passwordCompare) {
            return res.status(400).json({ error: "Please enter correct credential" })
        }

        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRECT)
        res.json({ authToken })

    } catch (error) {
        console.log(error)
        res.status(500).send("Internal Server Error")
    }
})

//Route 3: Fetching UserDetail (Login required)
router.post('/getuser', fetchUser, async (req, res) => {

    try {
        let userID = req.user.id // id attached by fetchUser middleware
        const user = await User.findById(userID).select("-password")
        res.send(user)
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal Server Error")
    }
})

module.exports = router