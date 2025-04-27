const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const apiRoutes = require("./routes/apiRoutes");
const connection = require("./connection");
const { getURLHandler } = require("./controllers/url");
const cron = require("node-cron");
const URL = require("./models/url");

require("dotenv").config();
connection();

const PORT = process.env.PORT || 8000;
const app = express();

/* Middlewares */
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

/* Routes */
app.use("/auth", authRoutes);
app.use("/api", apiRoutes);

/* Cron job to deactivate expired URLs */
async function deactivateUrls() {
  try {
    const now = new Date();
    const result = await URL.updateMany(
      { "urls.isActive": true, "urls.expiresAt": { $lt: now } },
      { $set: { "urls.$[].isActive": false } }
    );
    console.log(`${result.modifiedCount} user(s) had expired URLs deactivated.`);
  } catch (error) {
    console.error("Error deactivating expired URLs:", error.message);
  }
}

cron.schedule("* * * * *", () => {
  console.log("Running expiration check for URLs...");
  deactivateUrls();
});

/* Short URL redirect route */
app.get("/:id", getURLHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Frontend is served at http://localhost:${PORT}`);
});
