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
      required: true
    },
    region: {
      type: String,
      required: true
    },
    marketOpen: {
      type: String,
      required: true
    },
    marketClose: {
      type: String,
      required: true
    },
    timezone: {
      type: String,
      required: true
    },
    currency: {
      type: String,
      required: true
    },
    matchScore: {
      type: String,
      required: true
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
