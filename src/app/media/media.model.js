const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { toJSON, paginate } = require("../../plugins");
const { roles } = require("../../config/roles");

const mediaSchema = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true
    },

    src: {
      type: String
    },
    status: {
      type: String,
      default: "1"
    }
  },
  {
    timestamps: true
  }
);

const Media = mongoose.model("Media", mediaSchema);

module.exports = Media;
