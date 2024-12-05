const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// Middleware
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

// Rate Limiting (Uncomment for production)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes.",
});
app.use(limiter);

// Routes
const auth = require("./routes/auth");
const routes = require("./routes/router");


app.use("/api/auth", auth);
app.use("/api", routes);



// Error Handler
app.use(errorHandler);

module.exports = app;
