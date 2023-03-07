const mongoose = require("mongoose");
const { toJSON, paginate } = require("../../plugins");

const predictionSchema = mongoose.Schema(
  {
    stock: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stock",
      required: true,
      autopopulate: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      autopopulate: true
    },
    buyPrice: {
      type: Number,
      required: true
    },
    sellPrice: {
      type: Number,
      required: true
    },
    currentPrice: {
      type: Number,
      required: true
    },
    tradeDate: {
      type: String,
      required: true
    },
    note: {
      type: String,
      required: false
    },
    stopLoss: {
      type: Number,
      required: false
    },
    expectedROI: {
      type: Number,
      default: 0
    },
    ROI: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      default: "PENDING",
      enum: ["PENDING", "COMPLETED", "FAILED", "DELETED"]
    },
    type: {
      type: String,
      default: "INTRADAY",
      enum: ["INTRADAY", "DELIVERY"]
    }
  },
  {
    timestamps: true
  }
);

// add plugin that converts mongoose to json
predictionSchema.plugin(toJSON);
predictionSchema.plugin(paginate);
predictionSchema.plugin(require("mongoose-autopopulate"));

const Prediction = mongoose.model("Prediction", predictionSchema);

module.exports = Prediction;
