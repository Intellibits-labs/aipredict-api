const httpStatus = require("http-status");
const Feedback = require("../app/feedback/feedback.model");
const ApiError = require("../utils/ApiError");

const createFeedback = async (userBody) => {
  const feedback = await Feedback.create(userBody);
  return feedback;
};
const queryFeedback = async (filter, options) => {
  const feedback = await Feedback.paginate(filter, options);
  return feedback;
};
module.exports = {
  createFeedback,
  queryFeedback
};
