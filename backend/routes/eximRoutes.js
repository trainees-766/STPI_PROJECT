const express = require("express");
const router = express.Router();
const Unit = require("../models/Unit");

// Get all STPI units
router.get("/stpi", async (req, res) => {
  try {
    const units = await Unit.find({ type: "stpi" });
    res.json(units);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all Non-STPI units
router.get("/non-stpi", async (req, res) => {
  try {
    const units = await Unit.find({ type: "non-stpi" });
    res.json(units);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create STPI unit
router.post("/stpi", async (req, res) => {
  console.log(req.body);

  try {
    const unit = new Unit({ ...req.body, type: "stpi" });
    await unit.save();
    res.status(201).json(unit);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create Non-STPI unit
router.post("/non-stpi", async (req, res) => {
  try {
    const unit = new Unit({ ...req.body, type: "non-stpi" });
    await unit.save();
    res.status(201).json(unit);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update STPI unit
router.put("/stpi/:id", async (req, res) => {
  try {
    const unit = await Unit.findByIdAndUpdate(
      req.params.id,
      { ...req.body, type: "stpi" },
      { new: true, runValidators: true }
    );
    if (!unit) {
      return res.status(404).json({ error: "Unit not found" });
    }
    res.json(unit);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update Non-STPI unit
router.put("/non-stpi/:id", async (req, res) => {
  try {
    const unit = await Unit.findByIdAndUpdate(
      req.params.id,
      { ...req.body, type: "non-stpi" },
      { new: true, runValidators: true }
    );
    if (!unit) {
      return res.status(404).json({ error: "Unit not found" });
    }
    res.json(unit);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete STPI unit
router.delete("/stpi/:id", async (req, res) => {
  try {
    const unit = await Unit.findByIdAndDelete(req.params.id);
    if (!unit) {
      return res.status(404).json({ error: "Unit not found" });
    }
    res.json({ message: "Unit deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Non-STPI unit
router.delete("/non-stpi/:id", async (req, res) => {
  try {
    const unit = await Unit.findByIdAndDelete(req.params.id);
    if (!unit) {
      return res.status(404).json({ error: "Unit not found" });
    }
    res.json({ message: "Unit deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
