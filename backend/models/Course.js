const mongoose = require("mongoose");
module.exports = mongoose.model(
  "Course",
  new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    faculty: { type: String, default: "TBA" },
  })
);
