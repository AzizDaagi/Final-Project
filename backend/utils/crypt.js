const bcrypt = require("bcrypt")
const saltRounds = 10

// Hashing a password
const hashPassword = async (password) => {
    try{
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        return hashedPassword
    } catch (err){
        console.error("Error hashing password:", err)
    }
}

// Verifying a password
const comparePassword = async (plainPassword, hashedPassword) => {
    try{
        const isMatch = await bcrypt.compare(plainPassword, hashedPassword)
        return isMatch
    } catch(err){
        console.log("Error comparing passwords:", err)
    }
}

module.exports = { hashPassword, comparePassword}