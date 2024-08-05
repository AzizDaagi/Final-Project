const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors")

dotenv.config();


// Connection to Data Base
connectDB();

const app = express();

// Allow all origins
app.use(cors())

// Middleware
app.use(express.json());
app.use(helmet()); // Add security headers
app.use(morgan('combined')); // HTTP request logging

// Routes
const routes = require("./routes/routes")
app.use(routes)

app.get("/", (req, res) => {
  res.send("Yekhdm jawou bh sahbi");
});

// Starting the server
const PORT = process.env.PORT || 5000;
const server = app
  .listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  })
  .on("error", (err) => {
    console.error(`Server failed to start: ${err.message}`);
  });

// Importing the socket file to establish real time connections when needed
const setupSocket = require("./config/socket");
setupSocket(server);
