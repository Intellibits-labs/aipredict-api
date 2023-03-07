const express = require("express");
const validate = require("../../middlewares/validate");
// const authValidation = require("../../validations/auth.validation");
const { notificationValidation } = require("../../validations");
const notificationController = require("./notification");
const { auth } = require("../../middlewares/auth");

const router = express.Router();
router.post(
  "/send",
  auth("sendnotification"),
  validate(notificationValidation.sendNotification),
  notificationController.sendNotification
);

module.exports = router;
