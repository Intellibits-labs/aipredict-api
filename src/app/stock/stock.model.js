const mongoose = require("mongoose");
const { toJSON, paginate } = require("../../plugins");

const stockSchema = mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: false
    },
    region: {
      type: String,
      required: false
    },
    marketOpen: {
      type: String,
      required: false
    },
    marketClose: {
      type: String,
      required: false
    },
    timezone: {
      type: String,
      required: false
    },
    currency: {
      type: String,
      required: false
    },
    matchScore: {
      type: String,
      required: false
    },
    status: {
      type: String,
      default: "PENDING",
      enum: ["PENDING", "ACTIVE"]
    },
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Media",
      autopopulate: true,
      required: false
    }
  },
  {
    timestamps: true
  }
);

// add plugin that converts mongoose to json
stockSchema.plugin(toJSON);
stockSchema.plugin(paginate);

mongoose.set("toObject", { getters: true });
mongoose.set("toJSON", { getters: true });
stockSchema.plugin(require("mongoose-autopopulate"));

const Stock = mongoose.model("Stock", stockSchema);

module.exports = Stock;
