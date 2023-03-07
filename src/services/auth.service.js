const httpStatus = require("http-status");
const tokenService = require("./token.service");
const userService = require("./user.service");
const Token = require("../models/token.model");
const ApiError = require("../utils/ApiError");
const { tokenTypes } = require("../config/tokens");
const otpGenerator = require("otp-generator");

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }
  if ((await user.isAdmin("user")) || user.status == "0") {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid User");
  }

  return user;
};
/**
 * Login with mobile and password
 * @param {string} mobile
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithMobileAndPassword = async (mobile, password) => {
  const user = await userService.getUserByMobile(mobile);
  if (user.status != "1") {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Your Account is Suspended");
  }
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Incorrect mobile or password");
  }

  if (!(await user.isAdmin("user")) && !(await user.isAdmin("editor"))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid User");
  }

  // let updateuser = await userService.updateUserById(user.id, otpData);
  // throw new ApiError(httpStatus.OK, "NOT_VERIFIED");
  // return otpData;
  // }
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({
    token: refreshToken,
    type: tokenTypes.REFRESH,
    blacklisted: false
  });
  console.log(
    "🚀 ~ file: auth.service.js:63 ~ logout ~ refreshTokenDoc",
    refreshTokenDoc
  );
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, "Not found");
  }
  const user = await userService.getUserById(refreshTokenDoc.user);
  console.log("🚀 ~ file: auth.service.js:67 ~ logout ~ user", user);
  if (user.id == refreshTokenDoc.user) {
    await refreshTokenDoc.remove();
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, "Something went wrong");
  }
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(
      refreshToken,
      tokenTypes.REFRESH
    );
    const user = await userService.getUserById(refreshTokenDoc.user);

    if (!user) {
      throw new Error();
    }
    if (user.status != "1") {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Your Account is Suspended");
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(
      resetPasswordToken,
      tokenTypes.RESET_PASSWORD
    );
    const user = await userService.getUserById(resetPasswordTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await userService.updateUserById(user.id, { password: newPassword });
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password reset failed");
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(
      verifyEmailToken,
      tokenTypes.VERIFY_EMAIL
    );
    const user = await userService.getUserById(verifyEmailTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
    await userService.updateUserById(user.id, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Email verification failed");
  }
};

/**
 * Verify otp
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyOtp = async (userid, otp) => {
  try {
    const user = await userService.getUserById(userid);
    if (!user) {
      throw new Error();
    }

    if (user.otp.otpvalue == otp) {
      await userService.updateUserById(user.id, { verified: "1" });
      user["verified"] = "1";
      return user;
    } else {
      throw new Error();
    }
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "OTP verification failed");
  }
};
const verifyMailOtp = async (email, otp) => {
  try {
    const user = await userService.getUserByEmail(email);
    if (!user) {
      throw new Error();
    }

    if (user.otp.otpvalue == otp) {
      await userService.updateUserById(user.id, { verified: "1" });
      user["verified"] = "1";
      return user;
    } else {
      throw new Error();
    }
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "OTP verification failed");
  }
};
module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  verifyOtp,
  verifyMailOtp,
  loginUserWithMobileAndPassword,
  refreshAuth,
  resetPassword,
  verifyEmail
  // resetPasswordbyMobile
};
