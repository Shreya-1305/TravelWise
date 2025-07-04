const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load env variables
dotenv.config({ path: "./.env" });

const app = require("./app");

// DB connection
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true, // Optional in older MongoDB drivers
  })
  .then(() => console.log("✅ Connected to MongoDB successfully"))
  .catch((err) => {
    console.error("❌ DB connection error:", err);
    process.exit(1);
  });

// Start server
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`🚀 TravelWise server running on port ${port}...`);
});
