const express = require("express");
const validate = require("../../middlewares/validate");
// const authValidation = require("../../validations/auth.validation");
const { mediaValidation } = require("../../validations/");
const multer = require("multer");
const mediaController = require("./media");
const { auth } = require("../../middlewares/auth");

const { v4: uuidV4 } = require("uuid");
var path = require("path");

const router = express.Router();

const Storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/home/nodejs/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, uuidV4() + path.extname(file.originalname));
  }
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype == "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.imagetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: Storage,
  limits: {
    fileSize: 1572864,
    fileFilter: fileFilter
  }
});

router.post(
  "/upload",
  upload.single("filepond"),
  auth("uploadImage"),
  mediaController.upload
);
router.get("/revoke/:id", auth("uploadImage"), mediaController.disable);

module.exports = router;
