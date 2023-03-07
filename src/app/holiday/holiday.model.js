const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { toJSON, paginate } = require("../../plugins");
const { roles } = require("../../config/roles");

const holidaySchema = mongoose.Schema(
  {
    date: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// add plugin that converts mongoose to json
holidaySchema.plugin(toJSON);
holidaySchema.plugin(paginate);
holidaySchema.plugin(require("mongoose-autopopulate"));

const Holiday = mongoose.model("Holiday", holidaySchema);
// const Option = mongoose.model("Option", optionSchema);

module.exports = Holiday;
