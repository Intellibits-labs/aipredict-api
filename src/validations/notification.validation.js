const Joi = require("joi");
// const { password, objectId } = require("./custom.validation");

const sendNotification = {
  body: Joi.object().keys({
    title: Joi.string().min(1),
    message: Joi.string().min(1)
  })
};

module.exports = {
  sendNotification
};
