const Joi = require("joi");
const { password } = require("./custom.validation");

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    mobile: Joi.string()
      .required()
      .length(8)
      .pattern(/^[0-9]+$/)
  })
};

const login = {
  body: Joi.object().keys({
    mobile: Joi.string()
      .required()
      .length(10)
      .pattern(/^[0-9]+$/)
  })
};
const loginmail = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
};
const verifyotp = {
  body: Joi.object().keys({
    userid: Joi.string().required(),
    otp: Joi.string().required()
  })
};
const verifymailotp = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    otp: Joi.string().required()
  })
};

const logout = {
  body: Joi.object().keys({
    refresh_token: Joi.string().required()
  })
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required()
  })
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required()
  })
};

const forgotPasswordMobile = {
  body: Joi.object().keys({
    mobile: Joi.string()
      .length(8)
      .required()
      .pattern(/^[0-9]+$/)
  })
};
const resetpass = {
  body: Joi.object().keys({
    mobile: Joi.string()
      .length(8)
      .pattern(/^[0-9]+$/)
      .required()
  })
};
const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required()
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password)
  })
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required()
  })
};
const googleAuth = {
  body: Joi.object().keys({
    idToken: Joi.string().required()
  })
};
const facebookAuth = {
  body: Joi.object().keys({
    idToken: Joi.string().required(),
    name: Joi.string().required(),
    email: Joi.string().email().optional(),
    picture: Joi.string().required(),
    facebookId: Joi.string().required()
  })
};
module.exports = {
  register,
  login,
  verifyotp,
  verifymailotp,
  logout,
  loginmail,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resetpass,
  forgotPasswordMobile,
  googleAuth,
  facebookAuth
};
