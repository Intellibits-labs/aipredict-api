const express = require("express");
const validate = require("../../middlewares/validate");
const { auth } = require("../../middlewares/auth");
const stockController = require("./stock");

const router = express.Router();

router.get("/", stockController.getStocks);
router.get("/all", stockController.allStocks);
router.get(
  "/search/:query",
  auth("getStockSearch"),
  stockController.searchStocks
);
router.get(
  "/quote/:stock",
  auth("getStockSearch"),
  stockController.getMetaData
);
router.get("/searchstock/:query", stockController.searchStock);
// router.get("/:stock", auth("getStockSearch"), stockController.getSTOCKS);
module.exports = router;
