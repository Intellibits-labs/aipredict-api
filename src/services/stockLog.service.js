const StockLog = require("../app/stockLog/stockLog.model");
const config = require("../config/config");
const ApiError = require("../utils/ApiError");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const getStockLogBySymbol = async (symbol) => {
  return StockLog.findOne({ symbol });
};
const createStockLog = async (userBody) => {
  const result = await StockLog.create(userBody);
  return result;
};
const queryStockLogs = async (filter, options) => {
  const results = await StockLog.paginate(filter, options);
  return results;
};
const findStockLogs = async (filter) => {
  const results = await StockLog.find(filter).sort({ name: 1 });
  return results;
};
module.exports = {
  getStockLogBySymbol,
  createStockLog,
  queryStockLogs,
  findStockLogs
};
