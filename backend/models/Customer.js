const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    section: {
      type: String,
      enum: ["rf", "lan", "incubation"],
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    managerName: {
      type: String,
      required: true,
    },
    managerPhone: {
      type: String,
      required: true,
    },
    managerEmail: {
      type: String,
      required: true,
    },
    managerDesignation: {
      type: String,
      required: true,
    },
    leaderName: {
      type: String,
      required: true,
    },
    leaderPhone: {
      type: String,
      required: true,
    },
    leaderEmail: {
      type: String,
      required: true,
    },
    leaderDesignation: {
      type: String,
      required: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    ipDetails: {
      type: String,
      required: true,
    },
    bandwidth: {
      type: String,
      required: true,
    },
    bridgeDetails: {
      type: String,
      required: true,
    },
    prtgGraphLink: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Customer", customerSchema);
