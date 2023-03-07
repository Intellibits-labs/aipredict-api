const Joi = require("joi");
const { password, objectId } = require("./custom.validation");

const updateSettings = {
  body: Joi.object().keys({
    version: Joi.string().required(),
    updateStatus: Joi.string().required()
  })
};

module.exports = {
  updateSettings
};
