const { x } = require("joi");
const mongoose = require("mongoose");
const cron = require("node-cron");
const {
  predictionService,
  stockService,
  userService
} = require("./src/services");

module.exports = () => {
  console.log(12);
  cron.schedule("0 30 15 * * *", async () => {
    const pendingPredictions = await predictionService.findPrediction({
      status: "PENDING",
      tradeDate: {
        $lt: new Date()
      }
    });

    pendingPredictions.forEach(async (x) => {
      const result = await stockService.getMetaData(x.stock.symbol);

      if (result["Global Quote"]["05. price"] <= x) {
        const ROI = (x.sellPrice - x.buyPrice - 0.1) / x.buyPrice;
        const updatePrediction = await predictionService.updatePrediction(
          { _id: x._id },
          { ROI: ROI, status: "COMPLETED" }
        );
        const userData = await userService.getUserById(x.user._id);
        const totalROI = userData.ROI + ROI;
        const totalCount = userData.predCount + 1;
        const userUpdate = await userService.updateUserById(x.user._id, {
          ROI: userData.ROI + ROI,
          predCount: userData.predCount + 1,
          annualROI: (totalROI / totalCount).toFixed(2)
        });
      } else {
        const updatePrediction = await predictionService.updatePrediction(
          { _id: x._id },
          { status: "FAILED" }
        );
      }
    });
  });
};
