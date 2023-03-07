const Stock = require("../app/stock/stock.model");
const config = require("../config/config");
const ApiError = require("../utils/ApiError");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const searchStocks = async (query) => {
  const response = await fetch(
    "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=" +
      query +
      "&apikey=D8RD6URVYI28VC34",
    {
      method: "get",
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
  const result = await response.json();
  return result;
};
const getMetaData = async (query) => {
  const response = await fetch(
    "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" +
      query +
      "&apikey=D8RD6URVYI28VC34",
    {
      method: "get",
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
  const result = await response.json();
  return result;
};

const getStockBySymbol = async (symbol) => {
  return Stock.findOne({ symbol });
};
const createStock = async (userBody) => {
  const result = await Stock.create(userBody);
  return result;
};
const queryStocks = async (filter, options) => {
  const results = await Stock.paginate(filter, options);
  return results;
};
const findStocks = async (filter) => {
  const results = await Stock.find(filter).sort({ name: 1 });
  return results;
};
module.exports = {
  searchStocks,
  getMetaData,
  getStockBySymbol,
  createStock,
  queryStocks,
  findStocks
};
