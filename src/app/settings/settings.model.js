const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { toJSON, paginate } = require("../../plugins");
const { roles } = require("../../config/roles");

const settingsSchema = mongoose.Schema(
  {
    version: {
      type: String,
      required: true
    },
    ios_version: {
      type: Number,
      required: true
    },
    android_version: {
      type: Number,
      required: true
    },
    updateStatus: {
      type: Number,
      required: true,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// add plugin that converts mongoose to json
settingsSchema.plugin(toJSON);
settingsSchema.plugin(paginate);
// reviewSchema.plugin(require("mongoose-autopopulate"));

const Settings = mongoose.model("Settings", settingsSchema);

module.exports = Settings;
