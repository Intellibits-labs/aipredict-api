const Joi = require("joi");
const { password, objectId } = require("./custom.validation");

const createStockLog = {
  body: Joi.object().keys({
    data: Joi.array().items(
      Joi.object({
        open: Joi.number().required(),
        high: Joi.number().required(),
        low: Joi.number().required(),
        close: Joi.number().required(),
        symbol: Joi.string().required()
      })
    ),
    date: Joi.string().required()
  })
};
const getStockLog = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId)
  })
};

module.exports = {
  createStockLog,
  getStockLog
};
