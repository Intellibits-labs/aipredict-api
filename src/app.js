const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const cors = require("cors");
const passport = require("passport");
const httpStatus = require("http-status");
const config = require("./config/config");
const morgan = require("./config/morgan");
const { jwtStrategy, googleStrategy } = require("./config/passport");
const { authLimiter } = require("./middlewares/rateLimiter");
const routes = require("./routes");
const { errorConverter, errorHandler } = require("./middlewares/error");
const ApiError = require("./utils/ApiError");
const path = require("path");
const swaggerUI = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const cronjob = require("../cronjob");

// const webpush = require("web-push");

const app = express();

// const PUBLIC_VAPID =
//   "BOQ0Kw8ea1chL_qMv12My2K05mz8Ob9dpoUviJXDZBi-SG0FR1PpbgE61BVNeba2ir53aCiqUUEqDny5sDMeNsk";
// const PRIVATE_VAPID = "UNC-pOU6qNi4NICRg66iq6dc-i-GFHhDLIml-ZrzL38";

if (config.env !== "test") {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "aipredict API",
      version: "1.0.0"
    }
  },
  apis: ["./src/app/users/users.route.js"]
};
const swaggerDocs = swaggerJSDoc(swaggerOptions, {
  authAction: {
    JWT: {
      name: "JWT",
      schema: {
        type: "apiKey",
        in: "header",
        name: "Authorization",
        description: ""
      },
      value: "Bearer <JWT>"
    }
  }
});
app.use(
  "/api-docs",
  swaggerUI.serve,
  swaggerUI.setup(swaggerDocs, {
    swaggerOptions: {}
  })
);
// set security HTTP headers

app.use(helmet({ crossOriginResourcePolicy: false }));
// webpush.setVapidDetails(
//   "mailto:vaishnavmtr@gmail.com",
//   PUBLIC_VAPID,
//   PRIVATE_VAPID
// );

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options("*", cors());

// jwt authentication
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);
// passport.use(googleStrategy);
// serialize and deserialize
// passport.serializeUser(function (user, done) {
//   done(null, user);
// });
// passport.deserializeUser(function (obj, done) {
//   done(null, obj);
// });
// passport.use("google", googleStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === "production") {
  app.use("/v1/auth", authLimiter);
}
cronjob();
// var assetsPath = "/uploads";
// app.use(express.static(assetsPath));
console.log("🚀 ~ file: app.js ~ line 82 ~ (config.env)", config.env);
// console.log(
//   "Static path:",
//   path.join(
//     __dirname + (config.env === "production")
//       ? "/../../../../../uploads"
//       : "/uploads"
//   )
// );
const staticPath = path.join(
  __dirname,
  config.env === "production" ? "/../../../../../uploads" : "/uploads"
);

console.log("🚀 ~ file: app.js ~ line 92 ~ staticPath", staticPath);
app.use("/uploads", express.static(staticPath, { fallthrough: false }));
// v1 api routes
app.use("/v1", routes);

app.get("/health-check", async (req, res) => {
  res.json({ message: "OK" });
});
// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;