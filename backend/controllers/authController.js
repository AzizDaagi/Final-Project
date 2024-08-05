const User = require("../models/User")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const authController = {}

// Sign token
const signToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

// User login
authController.login = async (req, res) => {
    try{
        const { email, password } = req.body

        // Check if user exists and check password
        const user = await User.findOne({email}).select("+password")
        if(!user || !(await bcrypt.compare(password, user.password))){
            return res.status(401).json({error: "Invalid email or password"})
        }

        // Generate token if email and password are valid
        const token = signToken(user._id)
        res.status(200).json({token})
    } catch (err) {
        res.status(500).json({ error: err.message})
    }
}

module.exports = authController