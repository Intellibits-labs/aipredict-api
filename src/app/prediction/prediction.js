const httpStatus = require("http-status");
const pick = require("../../utils/pick");
const ApiError = require("../../utils/ApiError");
const catchAsync = require("../../utils/catchAsync");
const { stockService, predictionService } = require("../../services");
const moment = require("moment-timezone");
const jwt = require("jsonwebtoken");
const config = require("../../config/config");

const newPrediction = catchAsync(async (req, res) => {
  req.body["user"] = req.user._id;

  const todayPredictions = await predictionService.findPrediction({
    createdAt: {
      $gte: moment().tz("Asia/Kolkata").startOf("day"),
      $lt: moment().tz("Asia/Kolkata").endOf("day")
    },
    status: { $ne: "DELETED" },
    user: req.user._id
  });
  console.log(
    "🚀 ~ file: prediction.js:17 ~ newPrediction ~ todayPredictions",
    todayPredictions.length
  );
  if (todayPredictions.length > 5) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Prediction creation limit exceeded"
    );
  }
  // const stockData = await stockService.getStockBySymbol(req.body.stock);

  // if (!stockData) {
  //   const stockInfo = await stockService.searchStocks(req.body.stock);
  //   console.log(
  //     "🚀 ~ file: prediction.js:12 ~ newPrediction ~ stockInfo",
  //     stockInfo
  //   );
  //   if (stockInfo.bestMatches.length == 1) {
  //     Object.keys(stockInfo.bestMatches[0]).forEach(function (key) {
  //       var newkey = key.split(" ")[1];
  //       console.log("🚀 ~ file: prediction.js:19 ~ newkey", newkey);
  //       stockInfo.bestMatches[0][newkey] = stockInfo.bestMatches[0][key];
  //       delete stockInfo.bestMatches[0][key];
  //     });
  //     const stock = await stockService.createStock(stockInfo.bestMatches[0]);
  //     req.body.stock = stock._id;
  //     const result = await predictionService.createPrediction(req.body);
  //     res.status(httpStatus.CREATED).send(result);
  //   } else {
  //     throw new ApiError(httpStatus.NOT_FOUND, "Stock not found ");
  //   }
  // } else {
  // req.body.stock = stockData._id;
  const stockInfo = await stockService.updateStock(
    { _id: req.body.stock },
    {
      status: "ACTIVE"
    }
  );
  req.body["expectedROI"] = req.body.sellPrice - req.body.buyPrice;
  const result = await predictionService.createPrediction(req.body);
  res.status(httpStatus.CREATED).send(result);
  // }
});
const getMyPrediction = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["name", "role"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  filter["user"] = req.user._id;
  filter["status"] = { $ne: "DELETED" };
  const result = await predictionService.queryPrediction(filter, options);
  res.send(result);
});
const getPredictions = catchAsync(async (req, res) => {
  let filter = pick(req.query, ["status", "type", "stock"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);

  const token = req.headers.authorization.replace("Bearer ", "");

  filter["$or"] = [{ status: "COMPLETED" }, { status: "FAILED" }];
  if (token !== "null" && token) {
    const payload = jwt.verify(token, config.jwt.secret);

    if (payload && payload.sub) {
      filter = pick(req.query, ["name", "status"]);
      if (!filter["status"]) {
        filter["status"] = { $ne: "DELETED" };
      }
    }
  }
  const result = await predictionService.queryPrediction(filter, options);
  res.send(result);
});
const getPredictionsByStock = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["name", "role"]);
  filter["stock"] = req.params.id;
  filter["status"] = { $ne: "DELETED" };
  const result = await predictionService.findPrediction(filter);
  res.send(result);
});
const deletePrediction = catchAsync(async (req, res) => {
  const prediction = await predictionService.findPredictionById(req.params.id);
  console.log(
    "🚀 ~ file: prediction.js:111 ~ deletePrediction ~ prediction.user._id",
    prediction.user.id
  );
  console.log(
    "🚀 ~ file: prediction.js:112 ~ deletePrediction ~ req.user._id",
    req.user._id
  );
  if (prediction && prediction.user.id == req.user.id) {
    console.log(
      "🚀 ~ file: prediction.js:111 ~ deletePrediction ~ prediction",
      prediction
    );
    const result = await predictionService.updatePrediction(
      { _id: prediction._id, status: "PENDING" },
      { status: "DELETED" }
    );
    res.send(result);
  } else {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Something went wrong"
    );
  }
});

const getPredictionsByUser = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["name", "role"]);
  filter["user"] = req.params.id;
  filter["status"] = { $ne: "DELETED" };

  const result = await predictionService.findPrediction(filter);
  res.send(result);
});
const updatePrediction = catchAsync(async (req, res) => {
  const prediction = await predictionService.findPredictionById(req.params.id);
  if (prediction && prediction.user.id == req.user.id) {
    const result = await predictionService.updatePrediction(
      { _id: prediction._id, status: "PENDING" },
      req.body
    );
    res.send(result);
  } else {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Something went wrong"
    );
  }
});
const searchPrediction = catchAsync(async (req, res) => {
  console.log(
    "🚀 ~ file: prediction.js:95 ~ searchPrediction ~ req.params.query",
    req.params.query
  );
  const result = await predictionService.findPrediction(
    // {
    //   $or: [
    // { $match: { $text: { $search: req.params.query } } },
    {
      "stock.name": new RegExp(req.params.query, "i"),
      status: { $ne: "DELETED" }
    },
    //   ]
    // },
    {}
  );
  res.send({ results: result });
});
module.exports = {
  newPrediction,
  getMyPrediction,
  getPredictionsByStock,
  getPredictionsByUser,
  getPredictions,
  searchPrediction,
  deletePrediction,
  updatePrediction
};
