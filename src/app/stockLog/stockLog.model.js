const mongoose = require("mongoose");
const { toJSON, paginate } = require("../../plugins");

const stockLogSchema = mongoose.Schema(
  {
    open: {
      type: Number,
      required: true
    },
    high: {
      type: Number,
      required: true
    },
    low: {
      type: Number,
      required: true
    },
    close: {
      type: Number,
      required: true
    },
    stockSymbol: {
      type: String,
      required: true
    },
    stock: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stock",
      required: true,
      autopopulate: true
    },
    logDate: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// add plugin that converts mongoose to json
stockLogSchema.plugin(toJSON);
stockLogSchema.plugin(paginate);

mongoose.set("toObject", { getters: true });
mongoose.set("toJSON", { getters: true });
stockLogSchema.plugin(require("mongoose-autopopulate"));

const StockLog = mongoose.model("StockLog", stockLogSchema);

module.exports = StockLog;
