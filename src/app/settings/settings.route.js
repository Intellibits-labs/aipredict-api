const express = require("express");
const validate = require("../../middlewares/validate");
// const authValidation = require("../../validations/auth.validation");
// const { reviewValidation } = require("../../validations");
const settingsController = require("./settings");
const { auth } = require("../../middlewares/auth");
const { settingsValidation } = require("../../validations");

const router = express.Router();

router.get(
  "/",
  auth("getSettings"),
  validate(settingsValidation),
  settingsController.getSettings
);
module.exports = router;
