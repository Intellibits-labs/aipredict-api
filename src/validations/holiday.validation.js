const Joi = require("joi");
const { password, objectId } = require("./custom.validation");

const toggleHoliday = {
  body: Joi.object().keys({
    day: Joi.string().required(),
    month: Joi.string().required(),
    year: Joi.string().required()
  })
};
const getHoliday = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId)
  })
};

module.exports = {
  toggleHoliday,
  getHoliday
};
