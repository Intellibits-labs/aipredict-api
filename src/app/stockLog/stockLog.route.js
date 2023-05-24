const express = require("express");
const validate = require("../../middlewares/validate");
const { auth } = require("../../middlewares/auth");
const stockLogController = require("./stockLog");
const { stockLogValidation } = require("../../validations");

const router = express.Router();

// router.get("/", stockLogController.getStockLogs);
router.post(
  "/import",
  auth("importStockLog"),
  validate(stockLogValidation),
  stockLogController.importStockLog
);
// router.get(
//   "/search/:query",
//   auth("getStockLogSearch"),
//   stockLogController.searchStockLogs
// );
router.get(
  "/stock/:stock",
  auth("importStockLog"),
  stockLogController.allStockByStock
);
// router.get("/searchstockLog/:query", stockLogController.searchStockLog);
// router.get("/:stockLog", auth("getStockLogSearch"), stockLogController.getSTOCKS);
module.exports = router;
