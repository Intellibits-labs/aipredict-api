const httpStatus = require("http-status");
const pick = require("../../utils/pick");
const ApiError = require("../../utils/ApiError");
const catchAsync = require("../../utils/catchAsync");
const { feedbackService } = require("../../services");
// const userService = require("../../services/user.service");
const newFeedback = catchAsync(async (req, res) => {
  req.body["user"] = req.user._id;
  const result = await feedbackService.createFeedback(req.body);
  res.status(httpStatus.CREATED).send(result);
});
const getFeedback = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["name", "role"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await feedbackService.queryFeedback({}, options);
  res.send(result);
});

module.exports = {
  getFeedback,
  newFeedback
};
