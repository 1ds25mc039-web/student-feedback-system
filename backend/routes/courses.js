const router = require("express").Router();
const Course = require("../models/Course");
const { protect, allow } = require("../middleware/auth");

router.get("/", protect, async (req, res) => res.json(await Course.find().sort("code")));

router.post("/", protect, allow("admin"), async (req, res) => {
  try {
    res.status(201).json(await Course.create(req.body));
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

module.exports = router;
