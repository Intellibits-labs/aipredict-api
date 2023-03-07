const Joi = require("joi");
const { password, objectId } = require("./custom.validation");

const createFeedback = {
  body: Joi.object().keys({
    message: Joi.string().required()
  })
};
const getFeedback = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId)
  })
};

module.exports = {
  createFeedback,
  getFeedback
};
