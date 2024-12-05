require("dotenv").config();
const connectDB = require("./src/config/db");
// const redisClient = require("./config/redis");
const app = require("./src/app");

const PORT = process.env.PORT || 5000;

(async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Connect to Redis
        // await redisClient.connect();
        // console.log("Connected to Redis...");

        // Start Express Server
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Server initialization error:", error);
        process.exit(1); // Exit the process with failure
    }
})();
