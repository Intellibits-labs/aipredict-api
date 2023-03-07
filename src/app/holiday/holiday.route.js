const express = require("express");
const validate = require("../../middlewares/validate");
const holidayController = require("./holiday");
const { auth } = require("../../middlewares/auth");
const { holidayValidation } = require("../../validations/");

const router = express.Router();

router.get("/", auth("getHolidays"), holidayController.getHoliday);
router.get("/all", auth("getHolidays"), holidayController.getAllHoliday);
router.post(
  "/toggle",
  auth("toggleHoliday"),
  validate(holidayValidation.toggleHoliday),
  holidayController.toggleHoliday
);
module.exports = router;
