require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Course = require("./models/Course");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/courses", require("./routes/courses"));
app.use("/api/feedback", require("./routes/feedback"));

const seedCourses = async () => {
  if (await Course.countDocuments()) return;
  await Course.insertMany([
    { code: "MMCA314D", name: "Web Development using Full Stack", faculty: "Dr. Rao" },
    { code: "MMCA302", name: "Data Structures", faculty: "Prof. Mehta" },
    { code: "MMCA305", name: "Database Management Systems", faculty: "Dr. Iyer" },
  ]);
  console.log("Seeded sample courses");
};

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    await seedCourses();
    app.listen(process.env.PORT || 5000, () => console.log("API running on port", process.env.PORT || 5000));
  })
  .catch((e) => console.error("DB connection failed:", e.message));
