const Joi = require("joi");
const { password, objectId } = require("./custom.validation");

const uploadMedia = {
  body: Joi.object().keys({
    token: Joi.string()
  })
};
const revokeMedia = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId)
  })
};
module.exports = {
  uploadMedia,
  revokeMedia
};
