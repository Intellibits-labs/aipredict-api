const express = require("express");
const validate = require("../../middlewares/validate");
const dashboardController = require("./dashboard");
const { auth } = require("../../middlewares/auth");

const router = express.Router();

router.get("/", auth("getDashboard"), dashboardController.getDashboard);

module.exports = router;
