const mongoose = require("mongoose");

const unitSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["stpi", "non-stpi"],
      required: true,
    },
    name: {
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
    legalAgreements: {
      type: [String],
      default: [],
    },
    aprReports: {
      type: [String],
      default: [],
    },
    softexDetails: {
      type: [
        {
          year: String,
          month: String,
          amount: String,
          mpr: String,
        },
      ],
      default: [],
    },
    financialExpenses: [
      {
        year: String,
        amount: String,
        description: String,
      },
    ],
    // Director / Manager details
    managerName: { type: String, default: "" },
    managerEmail: { type: String, default: "" },
    managerPhone: { type: String, default: "" },
    managerDesignation: { type: String, default: "" },
    // Contact details
    contactName: { type: String, default: "" },
    contactEmail: { type: String, default: "" },
    contactPhone: { type: String, default: "" },
    // Registration / company identifiers
    roc: { type: String, default: "" },
    gst: { type: String, default: "" },
    iec: { type: String, default: "" },
    // Address
    address: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Unit", unitSchema);
