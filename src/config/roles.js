const roles = ["user", "admin", "predictor"];

const roleRights = new Map();
roleRights.set(roles[0], [
  "me",
  "getStocks",

  "getStockPredictions",
  "getPredictions",
  "getPredictors",
  "updateMe",
  "getHolidays"
]);
roleRights.set(roles[1], [
  "me",
  "uploadImage",
  "toPredictor",
  "getUsers",
  "getStockPredictions",
  "getPredictors",
  "getPredictions",
  "getDashboard",
  "updateMe",
  "updateUser",
  "toggleHoliday",
  "getHolidays",
  "importStockLog"
]);
roleRights.set(roles[2], [
  "me",
  "getStockSearch",
  "getMyPredictions",
  "getPredictions",
  "newPrediction",
  "getStocks",
  "getPredictors",
  "getStockPredictions",
  "updatePredictions",
  "updateMe",
  "getHolidays"
]);

module.exports = {
  roles,
  roleRights
};
