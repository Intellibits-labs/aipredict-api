const express = require("express");
const validate = require("../../middlewares/validate");
const authValidation = require("../../validations/auth.validation");
const authController = require("./auth.controller");
const { authGoogle } = require("../../middlewares/auth");
const passport = require("passport");

const router = express.Router();

router.post(
  "/loginmob",
  validate(authValidation.login),
  authController.loginmobile
);
router.post(
  "/verifyotp",
  validate(authValidation.verifyotp),
  authController.verifyOtp
);
router.post(
  "/forgot",
  validate(authValidation.forgotPassword),
  authController.emailforgotPassword
);
router.post(
  "/verify",
  validate(authValidation.verifymailotp),
  authController.verifymailOtp
);
router.post(
  "/reset-password",
  validate(authValidation.resetPassword),
  authController.resetPassword
);
router.post("/login", validate(authValidation.loginmail), authController.login);
router.post(
  "/refresh-tokens",
  validate(authValidation.refreshTokens),
  authController.refreshTokens
);
router.post(
  "/google",
  validate(authValidation.googleAuth),
  authController.googleSignup
);
router.post(
  "/facebook",
  validate(authValidation.facebookAuth),
  authController.facebookSignup
);
// router.get(
//   "/auth/google/callback",
//   passport.authenticate("google", {
//     failureRedirect: "/login",
//     scope: ["email", "profile"]
//   }),
//   function (req, res) {
//     // Successful authentication, redirect home.
//     console.log("here");
//     res.send({ ss: 2 });
//   }
// );
router.post(
  "/logout",

  validate(authValidation.logout),
  authController.logout
);
module.exports = router;
