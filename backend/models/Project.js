const mongoose = require("mongoose");

const coLocationSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    managerName: { type: String, required: true },
    managerEmail: { type: String, required: true },
    managerPhone: { type: String, required: true },
    managerDesignation: { type: String, required: true },
    adminName: { type: String, required: true },
    adminEmail: { type: String, required: true },
    adminPhone: { type: String, required: true },
    adminDesignation: { type: String, required: true },
    rackSpaceUnits: { type: Number, required: true },
    dataTransferGB: { type: Number, required: true },
    activationDate: { type: String, required: true },
    agreementEntered: { type: Boolean, required: true },
    totalAnnualCharges: { type: Number, required: true },
    quarterlyCharges: { type: Number, required: true },
    remarks: { type: String },
    prtgGraphLink: { type: String },
    ipDetails: {
      gateway: String,
      networkIp: String,
      startIp: String,
      lastIp: String,
      subnetMask: String,
    },
    bandwidthDetails: {
      free: Number,
      purchased: Number,
      total: Number,
    },
    servicePeriods: [
      {
        date: String,
        bandwidth: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CoLocation", coLocationSchema);
