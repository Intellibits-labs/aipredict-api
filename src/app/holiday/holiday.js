const httpStatus = require("http-status");
const pick = require("../../utils/pick");
const ApiError = require("../../utils/ApiError");
const catchAsync = require("../../utils/catchAsync");
const { holidayService } = require("../../services");
const moment = require("moment-timezone");

// const userService = require("../../services/user.service");
const toggleHoliday = catchAsync(async (req, res) => {
  req.body.month = +req.body.month + 1 + "";
  if (req.body.month.length == 1) req.body.month = "0" + req.body.month;
  if (req.body.day.length == 1) req.body.day = "0" + req.body.day;
  console.log(
    "🚀 ~ file: holiday.js:14 ~ toggleHoliday ~ dateVal:",
    req.body.year + "-" + req.body.month + "-" + req.body.day
  );
  date = new Date(req.body.year + "-" + req.body.month + "-" + req.body.day);
  next_date = format(new Date(date.setDate(date.getDate() + 1)));
  console.log(
    "🚀 ~ file: holiday.js:19 ~ toggleHoliday ~ next_date:",
    next_date
  );
  const result = await holidayService.findHolidays({
    date: {
      $gte: req.body.year + "-" + req.body.month + "-" + req.body.day,
      $lt: next_date
    }
  });
  console.log("🚀 ~ file: holiday.js:15 ~ toggleHoliday ~ result:", result);

  let newHoliday;
  x = {};
  if (result.length == 0) {
    newHoliday = await holidayService.createHoliday({
      date: req.body.year + "-" + req.body.month + "-" + req.body.day
    });
    x = { result: 1, data: newHoliday };
  } else {
    newHoliday = await holidayService.deleteHoliday(result[0]._id);
    x = { result: 0, data: newHoliday };
  }
  const allData = await holidayService.findHolidays({});
  res.send(allData);
});
const getHoliday = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["name", "role"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await holidayService.queryHoliday({}, options);
  res.send(result);
});
const getAllHoliday = catchAsync(async (req, res) => {
  const result = await holidayService.findHolidays({});
  res.send(result);
});
function format(inputDate) {
  let date, month, year;

  date = inputDate.getDate();
  month = inputDate.getMonth() + 1;
  year = inputDate.getFullYear();

  date = date.toString().padStart(2, "0");

  month = month.toString().padStart(2, "0");

  return `${year}-${month}-${date}`;
}
module.exports = {
  getHoliday,
  toggleHoliday,
  getAllHoliday
};
