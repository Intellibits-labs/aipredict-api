const httpStatus = require("http-status");
const pick = require("../../utils/pick");
const ApiError = require("../../utils/ApiError");
const catchAsync = require("../../utils/catchAsync");
const jwt = require("jsonwebtoken");
const moment = require("moment-timezone");

const {
  stockService,
  userService,
  predictionService,
  stockLogService
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
const getMetaData = catchAsync(async (req, res) => {
  const result = await stockService.getMetaData(req.params.stock);
  console.log("🚀 ~ file: stock.js:9 ~ searchStocks ~ result", result);
  res.send(result);
});
const getStocks = catchAsync(async (req, res) => {
  let filter = pick(req.query, ["role"]);
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
  let filter = pick(req.query, ["role"]);
  const result = await stockService.findStocks(filter);
  res.send(result);
});
const allStockByStock = catchAsync(async (req, res) => {
  let filter = pick(req.query, ["role"]);
  filter.stock = req.params.stock;
  const result = await stockLogService.findStockLogs(filter);
  res.send(result);
});
const searchStock = catchAsync(async (req, res) => {
  const stocks = await stockLogService.queryStockLogs(
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

const importStockLog = catchAsync(async (req, res) => {
  const result = [];
  const promises = [];

  // First for loop
  for (let index = 0; index < req.body.data.length; index++) {
    const element = req.body.data[index];
    const stockData = stockService.getStockBySymbol(element.symbol);
    const stockPromise = stockData.then(async (stockData) => {
      if (stockData && stockData.status === "ACTIVE") {
        let { open, high, close, low, symbol, stock } = element;
        let obj = { open, high, close, low, symbol };
        obj.stockSymbol = symbol;
        obj.stock = stockData._id;
        obj.logDate = req.body.date;
        return stockLogService.createStockLog(obj);
      }
    });

    promises.push(stockPromise);
  }

  await Promise.all(promises)
    .then(async (stocks) => {
      result.push(...stocks.filter(Boolean));

      // Second for loop (fetch predictions)
      const predictionPromises = [];
      const pendingPredictions = await predictionService.findPrediction({
        status: "PENDING",
        tradeDate: {
          $lt: new Date()
        }
      });

      for (let i = 0; i < pendingPredictions.length; i++) {
        const prediction = pendingPredictions[i];
        const createdAt = moment(prediction.createdAt);
        const tradeDate = prediction.tradeDate;

        const logs = await stockLogService.findStockLogs({
          tradeDate: { $lte: tradeDate },
          createdAt: { $gte: createdAt }
        });
        console.log("logs:", logs.length);

        // Assuming you have an array of Day objects named 'days' containing the stock data

        const A = prediction.buyPrice; // value for opening price
        const B = prediction.sellPrice; // value for sell price
        const C = prediction.stopLoss; // value for stop loss price
        const N = logs.length - 1; // Last day index
        let ROR = 0;
        for (let index = 0; index < logs.length; index++) {
          let buyPrice = null;
          let sellPrice = null;

          if (index === 1 && logs[index].open > A) {
            console.log("EXIT");
          } else {
            buyPrice = logs[index].open;

            for (let k = index; k <= N; k++) {
              if (logs[k].high > B) {
                sellPrice = B;
                break;
              }

              if (logs[k].low < C) {
                sellPrice = C;
                break;
              }
            }

            if (sellPrice === null) {
              sellPrice = logs[N].close;
            }

            ROR = (sellPrice - buyPrice) / buyPrice;
            console.log("Return on Investment:", ROR);
          }
        }
        const predictionPromise = predictionService.updatePrediction(
          { _id: prediction._id },
          { ROI: ROR, status: "COMPLETED" }
        );
        predictionPromises.push(predictionPromise);
      }

      await Promise.all(predictionPromises);

      // Process predictions if needed

      // Send response
      res.send({ status: "success", data: result });
    })
    .catch((error) => {
      // Handle error if any of the promises reject
      console.error(error);
      res.status(500).send({ status: "error", message: "An error occurred" });
    });
});
module.exports = {
  searchStocks,
  getStocks,
  getMetaData,
  searchStock,
  allStocks,
  importStockLog,
  allStockByStock
};
