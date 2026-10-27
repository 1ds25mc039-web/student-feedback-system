const mongoose = require("mongoose");
const schema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comments: { type: String, default: "" },
  },
  { timestamps: true }
);
schema.index({ student: 1, course: 1 }, { unique: true }); // one feedback per course
module.exports = mongoose.model("Feedback", schema);
