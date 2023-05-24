const httpStatus = require("http-status");
const { findOne } = require("../app/prediction/prediction.model");
const Prediction = require("../app/prediction/prediction.model");
const ApiError = require("../utils/ApiError");

const createPrediction = async (userBody) => {
  const prediction = await Prediction.create(userBody);
  return prediction;
};

const queryPrediction = async (filter, options) => {
  const prediction = await Prediction.paginate(filter, options);
  return prediction;
};
const findPrediction = async (filter) => {
  const prediction = await Prediction.find(filter);
  return prediction;
};
const findPredictionById = async (id) => {
  const prediction = await Prediction.findById(id);
  return prediction;
};
const updatePrediction = async (filter, updateBody) => {
  const prediction = await Prediction.findOne(filter);
  if (!prediction) {
    throw new ApiError(httpStatus.NOT_FOUND, "prediction not found");
  }
  Object.assign(prediction, updateBody);
  await prediction.save();
  return prediction;
};
module.exports = {
  createPrediction,
  queryPrediction,
  findPrediction,
  updatePrediction,
  findPredictionById
};
