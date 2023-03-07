const httpStatus = require("http-status");
const catchAsync = require("../../utils/catchAsync");
const {
  authService,
  userService,
  tokenService,
  emailService,
  cartService
} = require("./../../services");
const ApiError = require("../../utils/ApiError");
const { OAuth2Client } = require("google-auth-library");

// const msg91 = require("@walkover/msg91")(
//   "362140AzoBLvLRaG60bf2e55P1",
//   "DININGDEALS",
//   "4"
// );
// const fetch = require("node-fetch");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

// const request = require("request");

const otpGenerator = require("otp-generator");

const register = catchAsync(async (req, res) => {
  const otpvalue = await otpGenerator.generate(6, {
    upperCase: false,
    specialChars: false,
    alphabets: false
  });
  const datestr = new Date();
  const generatedDate = datestr.toString();
  const otpData = {
    otpvalue,
    generatedDate
  };
  console.log(otpData);
  // msg91.send(mobileNo, "MESSAGE", "DLT_TE_ID", function (err, response) {
  //   console.log(err);
  //   console.log(response);
  // });
  // const options = {
  //   hostname:
  //     "https://api.msg91.com/api/v2/sendsms?authkey=362140AzoBLvLRaG60bf2e55P1&mobiles=" +
  //     req.body.mobile +
  //     "&country=973&message=" +
  //     otpData +
  //     " is your One-Time-Password(OTP) to register at your DININGDEALS account&sender=DININGDEALS",
  //   port: 443,
  //   path: "/todos",
  //   method: "GET"
  // };

  req.body["otp"] = otpData;
  const user = await userService.createUser(req.body);
  // const tokens = await tokenService.generateAuthTokens(user);
  // request(
  //   {
  //     method: "GET",
  //     uri:
  //       "https://api.msg91.com/api/v2/sendsms?authkey=362140AzoBLvLRaG60bf2e55P1&mobiles=" +
  //       req.body.mobile +
  //       "&country=973&sender=DININGDEALS&message=" +
  //       otpData +
  //       " is your One-Time-Password(OTP) to register at your DININGDEALS account"
  //   },
  //   function (error, response, body) {
  // console.log(
  //   "🚀 ~ file: auth.controller.js ~ line 66 ~ register ~ body",
  //   body
  // );
  // console.log(
  //   "🚀 ~ file: auth.controller.js ~ line 66 ~ register ~ response",
  //   response
  // );

  //     if (!body.errors) {
  //       console.log(body);
  //       res.status(httpStatus.CREATED).send({ user });
  //       // res.status(httpStatus.CREATED).send(body);
  //     } else {
  //       console.error("Error:", body.errors);
  //       res.status(httpStatus.INTERNAL_SERVER_ERROR).send(body.errors);
  //     }
  //   }
  // );
  fetch(
    "https://api.msg91.com/api/v2/sendsms?authkey=362140AzoBLvLRaG60bf2e55P1&mobiles=" +
      req.body.mobile +
      "&country=973&sender=DININGDEALS&message=" +
      otpvalue +
      " is your One-Time-Password(OTP) to register at your DININGDEALS account",
    {
      method: "get"
    }
  )
    .then((res) => res.text())
    .then((json) => {
      console.log(json);
      res.status(httpStatus.CREATED).send({ user });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "Something went wrong" });
    });
});

const verifyOtp = catchAsync(async (req, res) => {
  const user = await authService.verifyOtp(req.body.userid, req.body.otp);
  if (!user || user.role == "admin") {
    throw new ApiError(httpStatus.NOT_FOUND, "Something went wrong");
  }
  const status = user?.name ? "LOGIN" : "REGISTER";
  // if (req.body.type == "0") {
  if (user.role == "user") {
    const cart = await cartService.findCart({ user: req.body.userid });
    if (!cart) {
      let cartData = await cartService.createCart({ user: req.body.userid });
      await userService.updateUserById(user._id, { cart: cartData._id });
    }
  }
  const tokens = await tokenService.generateAuthTokens({
    id: req.body.userid
  });
  res.send({ user, tokens, status: status });
  // }
  // else if (req.body.type == "1") {
  //   const resetPasswordToken =
  //     await tokenService.generateResetPasswordTokenMobile(user.mobile);
  //   res.send({
  //     id: user._id,
  //     resetPasswordToken: resetPasswordToken
  //   });
  // }

  // const user = await authService.loginUserWithEmailAndPassword(email, password);
  // const resetPasswordToken =
  //   await tokenService.generateResetPasswordTokenMobile(req.body.mobile);
  // const tokens = await tokenService.generateAuthTokens({ id: req.body.userid });
  // res.send({ user, tokens });
});
const verifymailOtp = catchAsync(async (req, res) => {
  req.body.type = "1";
  const user = await authService.verifyMailOtp(req.body.email, req.body.otp);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "Something went wrong");
  }
  console.log(
    "🚀 ~ file: auth.controller.js ~ line 85 ~ verifyOtp ~ user",
    user
  );
  if (req.body.type == "0") {
    const tokens = await tokenService.generateAuthTokens({
      id: req.body.userid
    });
    res.send({ user, tokens });
  } else if (req.body.type == "1") {
    const resetPasswordToken = await tokenService.generateResetPasswordToken(
      user.email
    );
    res.send({
      id: user._id,
      resetPasswordToken: resetPasswordToken
    });
  }

  // const user = await authService.loginUserWithEmailAndPassword(email, password);
  // const resetPasswordToken =
  //   await tokenService.generateResetPasswordTokenMobile(req.body.mobile);
  // const tokens = await tokenService.generateAuthTokens({ id: req.body.userid });
  // res.send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});
const loginmobile = catchAsync(async (req, res) => {
  const { mobile } = req.body;
  const user = await userService.getUserByMobile(mobile);
  console.log(
    "🚀 ~ file: auth.controller.js ~ line 102 ~ loginmobile ~ user",
    user
  );
  if (!user) {
    const otpvalue = await otpGenerator.generate(4, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false
    });
    const datestr = new Date();
    const generatedDate = datestr.toString();
    const otpData = {
      otpvalue,
      generatedDate
    };
    req.body["otp"] = otpData;
    console.log(
      "🚀 ~ file: auth.controller.js ~ line 195 ~ loginmobile ~ req.body",
      req.body
    );
    const userData = await userService.createUser(req.body);

    res.send({
      status: "REGISTER",
      otpvalue: otpData,
      id: userData._id,
      resetPasswordToken: "none"
    });
  } else {
    const otpvalue = await otpGenerator.generate(4, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false
    });
    const datestr = new Date();
    const generatedDate = datestr.toString();
    const otpData = {
      otpvalue,
      generatedDate
    };
    const userUpdate = await userService.updateUserById(user._id, {
      otp: otpData
    });
    res.send({
      status: "LOGIN",
      otpvalue: otpData,
      id: userUpdate._id,
      resetPasswordToken: "none"
    });
    // const tokens = await tokenService.generateAuthTokens(user);
    // res.send({ user, tokens });
  }
});
const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refresh_token);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const user = await userService.getUserByMobile(req.body.mobile);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  console.log(
    "🚀 ~ file: auth.controller.js ~ line 149 ~ forgotPassword ~ user",
    user
  );

  const otpvalue = await otpGenerator.generate(6, {
    upperCase: false,
    specialChars: false,
    alphabets: false
  });
  console.log(
    "🚀 ~ file: auth.controller.js ~ line 156 ~ forgotPassword ~ otpvalue",
    otpvalue
  );
  const datestr = new Date();
  const generatedDate = datestr.toString();
  const otpData = {
    otpvalue,
    generatedDate
  };
  const userUpdate = await userService.updateUserById(user._id, {
    otp: otpData
  });
  // const resetPasswordToken =
  //   await tokenService.generateResetPasswordTokenMobile(req.body.mobile);

  // await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  fetch(
    "https://api.msg91.com/api/v2/sendsms?authkey=362140AzoBLvLRaG60bf2e55P1&mobiles=" +
      req.body.mobile +
      "&country=973&sender=DININGDEALS&message=" +
      otpData.otpvalue +
      " is your One-Time-Password(OTP) at your DININGDEALS account",
    {
      method: "get"
    }
  )
    .then((res) => res.text())
    .then((json) => {
      console.log(json);
      res
        .status(httpStatus.OK)
        .send({ id: userUpdate._id, resetPasswordToken: "none" });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "Something went wrong" });
    });
});

const emailforgotPassword = catchAsync(async (req, res) => {
  const user = await userService.getUserByEmail(req.body.email);
  if (!user || user.role == "user") {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  console.log(
    "🚀 ~ file: auth.controller.js ~ line 149 ~ forgotPassword ~ user",
    user
  );

  const otpvalue = await otpGenerator.generate(6, {
    upperCase: false,
    specialChars: false,
    alphabets: false
  });
  console.log(
    "🚀 ~ file: auth.controller.js ~ line 156 ~ forgotPassword ~ otpvalue",
    otpvalue
  );
  const datestr = new Date();
  const generatedDate = datestr.toString();
  const otpData = {
    otpvalue,
    generatedDate
  };
  const userUpdate = await userService.updateUserById(user._id, {
    otp: otpData
  });
  const resetPasswordToken = await tokenService.generateResetPasswordToken(
    req.body.email
  );
  // await emailService.sendResetPasswordEmail(
  //   req.body.email,
  //   resetPasswordToken,
  //   user.name,
  //   otpvalue
  // );
  res.status(httpStatus.OK).send({ status: "success", otp: otpvalue });
  // fetch(
  //   "https://api.msg91.com/api/v2/sendsms?authkey=362140AzoBLvLRaG60bf2e55P1&mobiles=" +
  //     req.body.mobile +
  //     "&country=973&sender=DININGDEALS&message=" +
  //     otpData.otpvalue +
  //     " is your One-Time-Password(OTP) at your DININGDEALS account",
  //   {
  //     method: "get"
  //   }
  // )
  //   .then((res) => res.text())
  //   .then((json) => {
  //     console.log(json);
  //     res
  //       .status(httpStatus.OK)
  //       .send({ id: userUpdate._id, resetPasswordToken: "none" });
  //   })
  //   .catch((err) => {
  //     console.error(err);
  //     res
  //       .status(httpStatus.INTERNAL_SERVER_ERROR)
  //       .send({ error: "Something went wrong" });
  //   });
});
const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.OK).send({ message: "Success" });
});
const emailsendOtp = catchAsync(async (req, res) => {
  const user = await userService.getUserByEmail(req.body.email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  console.log(
    "🚀 ~ file: auth.controller.js ~ line 149 ~ forgotPassword ~ user",
    user
  );

  const otpvalue = await otpGenerator.generate(6, {
    upperCase: false,
    specialChars: false,
    alphabets: false
  });
  console.log(
    "🚀 ~ file: auth.controller.js ~ line 156 ~ forgotPassword ~ otpvalue",
    otpvalue
  );
  const datestr = new Date();
  const generatedDate = datestr.toString();
  const otpData = {
    otpvalue,
    generatedDate
  };
  const userUpdate = await userService.updateUserById(user._id, {
    otp: otpData
  });
  await emailService.sendResetPasswordEmail(
    req.body.email,
    user.name,
    otpvalue
  );
  res.status(httpStatus.OK).send({ mobile: user.mobile });
});
const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(
    req.user
  );
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});
const resetpass = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});
const googleSignup = catchAsync(async (req, res) => {
  console.log(
    "🚀 ~ file: auth.controller.js:425 ~ googleSignup ~ req.body",
    req.body
  );
  const client = new OAuth2Client("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");
  const ticket = await client.verifyIdToken({
    idToken: req.body.idToken,
    audience:
      "468687185923-5melpr67h7a2vrnfsbjhac2mqcgv6odf.apps.googleusercontent.com" // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  console.log(
    "🚀 ~ file: auth.controller.js:440 ~ googleSignup ~ payload",
    payload
  );
  const userid = payload["sub"];
  console.log(
    "🚀 ~ file: auth.controller.js:441 ~ googleSignup ~ userid",
    userid
  );
  const user = await userService.findUsers({ email: payload.email });
  console.log("🚀 ~ file: auth.controller.js:450 ~ googleSignup ~ user", user);
  if (user.length == 1) {
    const tokens = await tokenService.generateAuthTokens({
      id: user[0]._id
    });
    res.send({ user: user[0], tokens });
  } else {
    const newUser = await userService.createUser({
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      googleId: userid,
      role: "user",
      provider: "GOOGLE"
    });
    console.log(
      "🚀 ~ file: auth.controller.js:463 ~ googleSignup ~ newUser",
      newUser
    );
    const tokens = await tokenService.generateAuthTokens({
      id: newUser._id
    });

    res.send({ user: newUser, tokens });
  }
});
const facebookSignup = catchAsync(async (req, res) => {
  const tokenData = await fetch(
    "https://graph.facebook.com/oauth/access_token?client_id=502993548596475&client_secret=ad9e82dd22e1593d166cd58f625c0fae&grant_type=client_credentials&redirect_uri=https://indiapredict.com",
    {
      method: "get",
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
  let accessTokenData = await tokenData.json();
  if (accessTokenData && accessTokenData.access_token) {
    const verifyTokenData = await fetch(
      `https://graph.facebook.com/debug_token?input_token=${req.body.idToken}&access_token=${accessTokenData.access_token}`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    let verificationData = await verifyTokenData.json();
    if (
      verificationData &&
      verificationData.data &&
      verificationData.data.is_valid
    ) {
      const user = await userService.findUsers({
        facebookId: req.body.facebookId
      });
      console.log(
        "🚀 ~ file: auth.controller.js:450 ~ googleSignup ~ user",
        user
      );
      if (user.length == 1) {
        const tokens = await tokenService.generateAuthTokens({
          id: user[0]._id
        });
        res.send({ user: user[0], tokens });
      } else {
        const newUser = await userService.createUser({
          email: req.body.email,
          name: req.body.name,
          picture: req.body.picture,
          facebookId: req.body.facebookId,
          role: "user",
          provider: "FACEBOOK"
        });
        console.log(
          "🚀 ~ file: auth.controller.js:463 ~ googleSignup ~ newUser",
          newUser
        );
        const tokens = await tokenService.generateAuthTokens({
          id: newUser._id
        });

        res.send({ user: newUser, tokens });
      }
    } else {
      //invalid
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Invalid Token");
    }
  } else {
    //wrong
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Access Token error");
  }
});
module.exports = {
  register,
  login,
  loginmobile,
  verifyOtp,
  verifymailOtp,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  emailforgotPassword,
  emailsendOtp,
  sendVerificationEmail,
  verifyEmail,
  resetpass,
  googleSignup,
  facebookSignup
};
