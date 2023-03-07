const express = require("express");
const validate = require("../../middlewares/validate");
const feedbackController = require("./feedback");
const { auth } = require("../../middlewares/auth");
const { feedbackValidation } = require("../../validations/");

const router = express.Router();

router.get("/", auth("getFeedbacks"), feedbackController.getFeedback);
router.post(
  "/new",
  auth("newFeedback"),
  validate(feedbackValidation.createFeedback),
  feedbackController.newFeedback
);
module.exports = router;
