const express = require("express");
const validate = require("../../middlewares/validate");
const predictionController = require("./prediction");
const { auth } = require("../../middlewares/auth");
const { predictionValidation } = require("../../validations/");

const router = express.Router();

router.get("/", predictionController.getPredictions);
router.get(
  "/my",
  auth("getMyPredictions"),
  predictionController.getMyPrediction
);
router.get(
  "/:id",
  // auth("getStockPredictions"),
  predictionController.getPredictionsByStock
);
router.get(
  "/user/:id",
  // auth("getStockPredictions"),
  predictionController.getPredictionsByUser
);
router.get(
  "/stock/:id",
  // auth("getStockPredictions"),
  predictionController.getPredictionsByStock
);
router.get(
  "/delete/:id",
  auth("updatePredictions"),
  predictionController.deletePrediction
);
router.post(
  "/update/:id",
  auth("updatePredictions"),
  validate(predictionValidation.createPrediction),
  predictionController.updatePrediction
);
router.get("/search/:query", predictionController.searchPrediction);
router.post(
  "/new",
  auth("newPrediction"),
  validate(predictionValidation.createPrediction),
  predictionController.newPrediction
);
module.exports = router;
