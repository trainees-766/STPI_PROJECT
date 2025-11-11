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
    // IP details stored as an object so frontend can send structured fields
    ipDetails: {
      gateway: { type: String, default: "" },
      networkIp: { type: String, default: "" },
      startIp: { type: String, default: "" },
      lastIp: { type: String, default: "" },
      subnetMask: { type: String, default: "" },
    },
    bandwidth: {
      type: String,
      required: true,
    },
    // Bridge details stored as nested objects for both STPI side and customer side
    bridgeDetails: {
      stpi: {
        bridgeIp: { type: String, default: "" },
        frequency: { type: String, default: "" },
        ssid: { type: String, default: "" },
        wpa2PreSharedKey: { type: String, default: "" },
        peakRssi: { type: String, default: "" },
        channelBandwidth: { type: String, default: "" },
      },
      customer: {
        bridgeIp: { type: String, default: "" },
        frequency: { type: String, default: "" },
        ssid: { type: String, default: "" },
        wpa2PreSharedKey: { type: String, default: "" },
        peakRssi: { type: String, default: "" },
        channelBandwidth: { type: String, default: "" },
      },
    },
    prtgGraphLink: {
      type: String,
      default: "",
    },
    // Service periods: array of { date, bandwidth }
    servicePeriods: [
      new mongoose.Schema(
        {
          date: { type: String, required: false },
          bandwidth: { type: String, required: false },
        },
        { _id: false }
      ),
    ],
    // Bandwidth details: { free, purchased, total }
    bandwidthDetails: {
      free: { type: Number, default: 0 },
      purchased: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
    },
    // Router details: array of small objects { name, port }
    routerDetails: [
      new mongoose.Schema(
        {
          name: { type: String, default: "" },
          port: { type: String, default: "" },
        },
        { _id: false }
      ),
    ],
    // Path diagram: textual representation of how customer is connected
    pathDiagram: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Customer", customerSchema);
