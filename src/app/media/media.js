const httpStatus = require("http-status");
const fs = require("fs");
const pick = require("../../utils/pick");
const ApiError = require("../../utils/ApiError");
const catchAsync = require("../../utils/catchAsync");
const Media = require("./media.model");
var path = require("path");

// const { restaurantService } = require("../../services");

const upload = catchAsync(async (req, res) => {
  console.log("🚀 ~ file: media.js ~ line 9 ~ upload ~ req", req);
  const image = new Media({
    // title: req.query.type,
    src: "uploads/" + path.parse(req.file.path).base,
    status: 1
  });
  image.save();
  console.log("🚀 ~ file: media.js ~ line 16 ~ image.save ~ res", image);
  // return res
  //   .status(200)
  //   .json({ msg: "image successfully saved", image: image._id });
  res.status(httpStatus.CREATED).send(image);
  //   });
});
const disable = catchAsync(async (req, res) => {
  // const image = new Media({
  //   // title: req.query.type,
  //   src: req.file.path,
  //   status: 1
  // });
  // image.save();
  //   console.log("🚀 ~ file: media.js ~ line 16 ~ image.save ~ res", res);
  // return res
  //   .status(200)
  //   .json({ msg: "image successfully saved", image: image._id });
  let media = await Media.findById(req.params.id);
  console.log("🚀 ~ file: media.js ~ line 38 ~ disable ~ media", media);
  if (!media) {
    throw new ApiError(httpStatus.NOT_FOUND, "Media not found");
  }
  fs.unlink(path.join(__dirname + "../../../../" + media.src), (err) => {
    if (err) {
      console.error(err);
      throw new ApiError(httpStatus.NOT_FOUND, "Media not found");
    }
    res.send({ status: "SUCCESS" });
  });
  // res.status(httpStatus.CREATED).send(image);
  //   });
});

module.exports = {
  upload,
  disable
};
