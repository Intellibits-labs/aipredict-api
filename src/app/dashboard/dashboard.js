const httpStatus = require("http-status");
const pick = require("../../utils/pick");
const ApiError = require("../../utils/ApiError");
const catchAsync = require("../../utils/catchAsync");
const {
  feedbackService,
  userService,
  stockService,
  predictionService
} = require("../../services");

const getDashboard = catchAsync(async (req, res) => {
  const user = await userService.queryUsers({ role: "user" }, {});
  const pUser = await userService.queryUsers({ role: "predictor" }, {});
  const stocks = await stockService.queryStocks({}, {});
  const predictions = await predictionService.queryPrediction({}, {});
  res.send({
    users: user.totalResults,
    predictors: pUser.totalResults,
    stocks: stocks.totalResults,
    predictions: predictions.totalResults
  });
});

module.exports = {
  getDashboard
};
