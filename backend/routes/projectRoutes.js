const express = require("express");
const router = express.Router();
const CoLocation = require("../models/Project");
const { log } = require("console");

// Get all co-locations
router.get("/", async (req, res) => {
  try {
    const coLocations = await CoLocation.find();
    res.json(coLocations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single co-location
router.get("/:id", async (req, res) => {
  try {
    const coLocation = await CoLocation.findById(req.params.id);
    if (!coLocation) {
      return res.status(404).json({ error: "Co Location not found" });
    }
    res.json(coLocation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create co-location
router.post("/add", async (req, res) => {
  console.log(req.body);
  try {
    const coLocation = new CoLocation(req.body);
    await coLocation.save();
    res.status(201).json(coLocation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update co-location
router.put("/:id", async (req, res) => {
  try {
    const coLocation = await CoLocation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!coLocation) {
      return res.status(404).json({ error: "Co Location not found" });
    }
    res.json(coLocation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete co-location
router.delete("/:id", async (req, res) => {
  try {
    const coLocation = await CoLocation.findByIdAndDelete(req.params.id);
    if (!coLocation) {
      return res.status(404).json({ error: "Co Location not found" });
    }
    res.json({ message: "Co Location deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
