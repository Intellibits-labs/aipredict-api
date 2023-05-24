const Stock = require("../app/stock/stock.model");
const config = require("../config/config");
const ApiError = require("../utils/ApiError");
// import { NseIndia } from "stock-nse-india";
const axios = require("axios");

// const nseIndia = new NseIndia();
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
const searchStocks2 = async (query) => {
  // nseIndia.f;
  const result = await searchStocksData(query);
  return result;
};

async function searchStocksData(searchString) {
  const options = {
    headers: {
      "X-Requested-With": "XMLHttpRequest",
      Referer: "https://www1.nseindia.com/ChartApp/install/charts/mainpage.jsp",
      Host: "www1.nseindia.com"
    },
    transformResponse: searchTransformer(false)
  };

  const url =
    "https://www1.nseindia.com/live_market/dynaContent/live_watch/get_quote/ajaxCompanySearch.jsp?search=" +
    encodeURIComponent(searchString);

  const response = await axios.get(url, options);
  return response.data;
}

// Function to transform search data
function searchTransformer(isIndex) {
  var matcher = "";
  if (isIndex) {
    matcher = /underlying=(.*?)&/;
  } else {
    matcher = /symbol=(.*?)&/;
  }

  return function (data) {
    var matches = data.match(/<li>(.*?)<\/li>/g);
    return matches.map(function (value1) {
      var symbol = value1.match(matcher);
      value1 = stripTags(value1).replace(symbol[1], "");
      return {
        name: value1 || "",
        symbol: symbol[1] || ""
      };
    });
  };
}
function stripTags(string) {
  return string.replace(/<(.|\n)*?>/g, "").trim();
}
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
const updateStock = async (filter, updateBody) => {
  const stock = await Stock.findOne(filter);
  if (!stock) {
    throw new ApiError(httpStatus.NOT_FOUND, "stock not found");
  }
  Object.assign(stock, updateBody);
  await stock.save();
  return stock;

  // const prediction = await Prediction.updateOne(filter, updateBody);
  // return prediction;
};
module.exports = {
  searchStocks,
  getMetaData,
  getStockBySymbol,
  createStock,
  queryStocks,
  findStocks,
  searchStocks2,
  updateStock
};
