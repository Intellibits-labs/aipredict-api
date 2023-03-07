const httpStatus = require("http-status");
const Settings = require("../app/settings/settings.model");
const ApiError = require("../utils/ApiError");

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const querySettings = async (filter, options) => {
  const settings = await Settings.paginate(filter, options);
  return settings;
};

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createSettings = async (userBody) => {
  // if (userBody.email && (await Restaurant.isEmailTaken(userBody.email))) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  // }
  const settings = await Settings.create(userBody);
  return settings;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getSettings = async (id) => {
  return Settings.find();
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateSettings = async (updateBody) => {
  const settings = await getSettings();
  if (!settings) {
    throw new ApiError(httpStatus.NOT_FOUND, "Setting not found");
  }
  //   if (
  //     updateBody.email &&
  //     (await Restaurant.isEmailTaken(updateBody.email, userId))
  //   ) {
  //     throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  //   }
  Object.assign(settings, updateBody);
  await settings.save();
  return settings;
};
module.exports = {
  querySettings,
  createSettings,
  updateSettings
};
