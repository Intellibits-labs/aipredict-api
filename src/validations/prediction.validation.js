const Joi = require("joi");
const { password, objectId } = require("./custom.validation");

const createPrediction = {
  body: Joi.object().keys({
    stock: Joi.string().required(),
    buyPrice: Joi.number().required(),
    sellPrice: Joi.number().required(),
    currentPrice: Joi.number().required(),
    stopLoss: Joi.number().required(),
    tradeDate: Joi.date().required(),
    note: Joi.string().optional().allow(""),
    type: Joi.string().required().valid("INTRADAY", "DELIVERY")
  })
};
const getPrediction = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId)
  })
};

module.exports = {
  createPrediction,
  getPrediction
};
