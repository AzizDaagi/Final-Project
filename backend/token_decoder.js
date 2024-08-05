const jwt = require("jsonwebtoken")

const token = "";

const decoded = jwt.decode(token, {complete: true})

console.log(decoded)