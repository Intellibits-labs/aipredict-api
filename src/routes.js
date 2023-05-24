const express = require("express");
const authRoute = require("./app/auth/auth.route");
const userRoute = require("./app/users/users.route");
const mediaRoute = require("./app/media/media.route");
const feedbackRoute = require("./app/feedback/feedback.route");
const settingsRoute = require("./app/settings/settings.route");
const notificationRoute = require("./app/notification/notification.route");
const stockRoute = require("./app/stock/stock.route");
const predictionRoute = require("./app/prediction/prediction.route");
const dashboardRoute = require("./app/dashboard/dashboard.route");
const holidayRoute = require("./app/holiday/holiday.route");
const stockLogRoute = require("./app/stockLog/stockLog.route");
const router = express.Router();

router.use("/auth", authRoute);
router.use("/users", userRoute);
router.use("/media", mediaRoute);
router.use("/feedback", feedbackRoute);
router.use("/settings", settingsRoute);
router.use("/notification", notificationRoute);
router.use("/stock", stockRoute);
router.use("/prediction", predictionRoute);
router.use("/dashboard", dashboardRoute);
router.use("/holiday", holidayRoute);
router.use("/stock-log", stockLogRoute);

module.exports = router;
