const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer");

// Get all RF customers
router.get("/rf", async (req, res) => {
  try {
    const customers = await Customer.find({ section: "rf" });
    console.log(customers);
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all LAN customers
router.get("/lan", async (req, res) => {
  try {
    const customers = await Customer.find({ section: "lan" });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/rf", async (req, res) => {
  try {
    const customer = new Customer({ ...req.body, section: "rf" });
    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/lan", async (req, res) => {
  try {
    const customer = new Customer({ ...req.body, section: "lan" });
    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/rf/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { ...req.body, section: "rf" },
      { new: true, runValidators: true }
    );
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json(customer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update LAN customer
router.put("/lan/:id", async (req, res) => {
  console.log(req.params.id);

  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { ...req.body, section: "lan" },
      { new: true, runValidators: true }
    );
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json(customer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete RF customer
router.delete("/rf/:id", async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete LAN customer
router.delete("/lan/:id", async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
