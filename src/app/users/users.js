const httpStatus = require("http-status");
const pick = require("../../utils/pick");
const ApiError = require("../../utils/ApiError");
const catchAsync = require("../../utils/catchAsync");
const { userService } = require("../../services");
const { getUserById } = require("../../services/user.service");

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  let filter = pick(req.query, ["role"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  if (!filter?.role) filter["role"] = { $ne: "admin" };
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  res.send(user);
});
const updateMe = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.user._id, req.body);
  res.send(user);
});
const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});
const updateStatus = catchAsync(async (req, res) => {
  console.log(
    "🚀 ~ file: users.js:38 ~ updateStatus ~ req.params.id",
    req.params.id
  );
  const userData = await userService.getUserById(req.params.id);
  if (!userData) {
  }
  let status = "0";
  if (userData.status == "0") status = "1";
  const user = await userService.updateUserById(req.params.id, {
    status: status
  });
  res.send(user);
});
const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});
const me = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.user._id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  res.send(user);
});

const toPredictor = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.id, {
    role: "predictor"
  });
  res.send(user);
});
const toUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.id, {
    role: "user"
  });
  res.send(user);
});
const getPredictors = catchAsync(async (req, res) => {
  let filter = pick(req.query, ["role"]);
  filter["role"] = "predictor";
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const user = await userService.queryUsers(filter, options);
  res.send(user);
});
module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateMe,
  deleteUser,
  me,
  toPredictor,
  toUser,
  getPredictors,
  updateStatus
};
