const mongoose = require("mongoose");

async function connection() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
    } catch (er) {
        console.log("Error connecting to MongoDB:", er);
        process.exit(1); // Stop the server if the connection fails
    }
}

module.exports = connection;
