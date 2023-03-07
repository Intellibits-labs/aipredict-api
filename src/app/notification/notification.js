const httpStatus = require("http-status");
const pick = require("../../utils/pick");
const ApiError = require("../../utils/ApiError");
const catchAsync = require("../../utils/catchAsync");
// const OneSignal = require("onesignal-node");
// var request = require("request");
// const fetch = require("node-fetch");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

// const client = new OneSignal.Client(
//   "ad1e2c66-aaa1-4232-ba9b-2c988dc4c37f",
//   "ZjI3OWIxZTMtNTJkMS00YjFhLWE5YjgtY2FjODVkMTY3MTdl",
//   { apiRoot: "https://onesignal.com/api/v1/" }
// );
// const testSMS = catchAsync(async (req, res) => {
//   request(
//     {
//       method: "GET",
//       uri:
//         "https://api.msg91.com/api/v2/sendsms?authkey=362140AzoBLvLRaG60bf2e55P1&mobiles=" +
//         "33916059" +
//         "&country=973&sender=DININGDEALS&message=" +
//         "4444" +
//         " is your One-Time-Password(OTP) to register at your DININGDEALS account"
//     },
//     function (error, response, body) {
//       console.log(
//         "🚀 ~ file: auth.controller.js ~ line 66 ~ register ~ body",
//         body
//       );
//       // console.log(
//       //   "🚀 ~ file: auth.controller.js ~ line 66 ~ register ~ response",
//       //   response
//       // );

//       if (!body.errors) {
//         console.log(body);
//         res.status(httpStatus.CREATED).send(body);
//       } else {
//         console.error("Error:", body.errors);
//         res.status(httpStatus.INTERNAL_SERVER_ERROR).send(body.errors);
//       }
//     }
//   );
// });
const sendNotification = catchAsync(async (req, res) => {
  var restKey = "ZjVkODFkOGQtYzBlMC00N2ExLTkzOTgtZTNkNDM0ZjI2MzY3";
  var appID = "caa9c055-c3aa-49d8-bb92-47a41e40604b";
  // request(
  //   {
  //     method: "POST",
  //     uri: "https://onesignal.com/api/v1/notifications",
  //     headers: {
  //       authorization: "Basic " + restKey,
  //       "content-type": "application/json"
  //     },
  //     json: true,
  //     body: {
  //       app_id: appID,
  //       contents: { en: req.body.message },
  //       headings: {
  //         en: req.body.title
  //       },
  //       included_segments: ["Subscribed Users"]
  //     }
  //   },
  //   function (error, response, body) {
  //     console.log(
  //       "🚀 ~ file: notification.js ~ line 37 ~ sendNotification ~ body",
  //       body
  //     );
  //     console.log(
  //       "🚀 ~ file: notification.js ~ line 37 ~ sendNotification ~ response",
  //       response
  //     );
  //     if (!body.errors) {
  //       console.log(body);
  //       res.status(httpStatus.CREATED).send(body);
  //     } else {
  //       console.error("Error:", body.errors);
  //       res.status(httpStatus.INTERNAL_SERVER_ERROR).send(body.errors);
  //     }
  //   }
  // );
  fetch("https://onesignal.com/api/v1/notifications", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      authorization: "Basic " + restKey
    },
    body: JSON.stringify({
      app_id: appID,
      contents: { en: req.body.message },
      headings: {
        en: req.body.title
      },
      included_segments: ["Subscribed Users"]
    })
  })
    .then((res) => res.json())
    .then((json) => {
      console.log(json);
      res.status(httpStatus.CREATED).send(json);
    })
    .catch((err) => {
      console.error(err);
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "Something went wrong" });
    });

  //   const response = await client.createNotification(notification);
  //   console.log(
  //     "🚀 ~ file: notification.js ~ line 27 ~ sendNotification ~ response",
  //     response
  //   );
});

module.exports = {
  sendNotification
};
