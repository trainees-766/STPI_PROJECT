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
      type: [String],
      default: [],
    },
    financialExpenses: [
      {
        year: String,
        amount: String,
        description: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Unit", unitSchema);
