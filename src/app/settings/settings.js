const httpStatus = require("http-status");
const pick = require("../../utils/pick");
const ApiError = require("../../utils/ApiError");
const catchAsync = require("../../utils/catchAsync");
const { settingsService } = require("../../services");

const getSettings = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["id"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await settingsService.querySettings({}, { limit: "1" });
  res.send(result);
});

module.exports = {
  getSettings
};
