const httpStatus = require("http-status");
const pick = require("../../utils/pick");
const ApiError = require("../../utils/ApiError");
const catchAsync = require("../../utils/catchAsync");
const jwt = require("jsonwebtoken");

const {
  stockService,
  userService,
  predictionService
} = require("../../services");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
var _ = require("lodash");
const config = require("../../config/config");

const searchStocks = catchAsync(async (req, res) => {
  const result = await stockService.searchStocks(req.params.query);
  console.log("🚀 ~ file: stock.js:9 ~ searchStocks ~ result", result);
  res.send(result);
});
const searchStocks2 = catchAsync(async (req, res) => {
  const stocks = await stockService.queryStocks(
    { name: new RegExp(req.params.query, "i") },
    {}
  );
  res.send(stocks);
});
const getMetaData = catchAsync(async (req, res) => {
  const result = await stockService.getMetaData(req.params.stock);
  console.log("🚀 ~ file: stock.js:9 ~ searchStocks ~ result", result);
  res.send(result);
});
const getStocks = catchAsync(async (req, res) => {
  let filter = pick(req.query, ["role", "status"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await stockService.queryStocks(filter, options);
  let responseResult = [];
  // await asyncForEach(result.results, async (element) => {
  //   let res = await fetch(
  //     "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" +
  //       element.symbol +
  //       "&apikey=D8RD6URVYI28VC34",
  //     {
  //       method: "get",
  //       headers: {
  //         "Content-Type": "application/json"
  //       }
  //     }
  //   );
  //   let jsonRes = await res.json();
  //   console.log(
  //     "🚀 ~ file: stock.js:38 ~ awaitasyncForEach ~ jsonRes",
  //     jsonRes
  //   );
  //   if (jsonRes && jsonRes["Global Quote"]) element.meta = jsonRes;
  //   let temp = {
  //     ...element.toJSON(),
  //     meta: jsonRes ? jsonRes : null
  //   };
  // responseResult.push(temp);
  // });

  res.send(result);
});
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
const allStocks = catchAsync(async (req, res) => {
  let filter = pick(req.query, ["role", "status"]);
  const result = await stockService.findStocks(filter);
  res.send(result);
});
const searchStock = catchAsync(async (req, res) => {
  const stocks = await stockService.queryStocks(
    { name: new RegExp(req.params.query, "i") },
    {}
  );
  const users = await userService.queryUsers(
    { name: new RegExp(req.params.query, "i") },
    {}
  );
  const token = req.headers.authorization.replace("Bearer ", "");
  // filter = {};
  // filter["status"] = "COMPLETED";
  // if (token !== "null" && token) {
  //   const payload = jwt.verify(token, config.jwt.secret);

  //   if (payload && payload.sub) {
  //     filter = {};
  //     filter["$or"] = [{ status: "COMPLETED" }, { status: "FAILED" }];
  //   }
  // }
  // const predictions = await predictionService.queryPrediction(
  //   {
  //     "stock.name": new RegExp(req.params.query, "i"),
  //     status: { $ne: "DELETED" }
  //   },
  //   {}
  // );
  res.send({ stocks, users });
});
module.exports = {
  searchStocks,
  getStocks,
  getMetaData,
  searchStock,
  allStocks,
  searchStocks2
};
