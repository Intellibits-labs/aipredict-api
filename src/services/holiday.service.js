const httpStatus = require("http-status");
const Holiday = require("../app/holiday/holiday.model");
const ApiError = require("../utils/ApiError");

const createHoliday = async (userBody) => {
  const holiday = await Holiday.create(userBody);
  return holiday;
};
const deleteHoliday = async (userBody) => {
  const holiday = await Holiday.remove(userBody);
  return holiday;
};
const queryHoliday = async (filter, options) => {
  const holiday = await Holiday.paginate(filter, options);
  return holiday;
};
const findHolidays = async (filter) => {
  const holiday = await Holiday.find(filter);
  return holiday;
};
module.exports = {
  createHoliday,
  queryHoliday,
  findHolidays,
  deleteHoliday
};
