const router = require("express").Router();
const Feedback = require("../models/Feedback");
const { protect, allow } = require("../middleware/auth");

// Student submits feedback for a course
router.post("/", protect, allow("student"), async (req, res) => {
  try {
    const { course, rating, comments } = req.body;
    if (!course || !rating) return res.status(400).json({ message: "Course and rating are required" });
    const fb = await Feedback.create({ student: req.user.id, course, rating, comments });
    res.status(201).json(fb);
  } catch (e) {
    if (e.code === 11000)
      return res.status(400).json({ message: "You have already submitted feedback for this course" });
    res.status(400).json({ message: e.message });
  }
});

// Student: own submissions
router.get("/mine", protect, allow("student"), async (req, res) =>
  res.json(await Feedback.find({ student: req.user.id }).populate("course"))
);

// Faculty/admin: all feedback (student identity hidden)
router.get("/", protect, allow("faculty", "admin"), async (req, res) => {
  const list = await Feedback.find().populate("course", "code name").sort("-createdAt");
  res.json(list.map((f) => ({ _id: f._id, course: f.course, rating: f.rating, comments: f.comments, createdAt: f.createdAt })));
});

// Faculty/admin: average rating per course
router.get("/summary", protect, allow("faculty", "admin"), async (req, res) => {
  const data = await Feedback.aggregate([
    { $group: { _id: "$course", avg: { $avg: "$rating" }, count: { $sum: 1 } } },
    { $lookup: { from: "courses", localField: "_id", foreignField: "_id", as: "course" } },
    { $unwind: "$course" },
    { $project: { _id: 0, code: "$course.code", name: "$course.name", avg: { $round: ["$avg", 2] }, count: 1 } },
  ]);
  res.json(data);
});

module.exports = router;
