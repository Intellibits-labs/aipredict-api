const httpStatus = require("http-status");
const config = require("../config/config");
const ApiError = require("../utils/ApiError");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const sendPushNotification = async (body) => {
  let appID = "";
  let restKey = "";
  if (body.role == "user") {
    restKey = config.onesignal.onesignal_user_restkey;
    appID = config.onesignal.onesignal_user_appid;
  } else if (body.role == "store") {
    restKey = config.onesignal.onesignal_store_restkey;
    appID = config.onesignal.onesignal_store_appid;
  } else if (body.role == "driver") {
    restKey = config.onesignal.onesignal_driver_restkey;
    appID = config.onesignal.onesignal_driver_appid;
  }
  fetch("https://onesignal.com/api/v1/notifications", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      authorization: "Basic " + restKey
    },
    body: JSON.stringify({
      app_id: appID,
      contents: { en: body.message },
      headings: {
        en: body.title
      },
      included_segments: ["Subscribed Users"],
      include_external_user_ids: body.user
    })
  })
    .then((res) => res.json())
    .then((json) => {
      console.log(json);
      return json;
    })
    .catch((err) => {
      console.error(err);
      return err;
    });
};

module.exports = {
  sendPushNotification
};
