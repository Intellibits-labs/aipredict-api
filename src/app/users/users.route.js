const express = require("express");
const { auth } = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const userValidation = require("../../validations/user.validation");
const userController = require("./users.js");

const router = express.Router();

router
  .route("/")
  .post(
    auth("manageUsers"),
    validate(userValidation.createUser),
    userController.createUser
  )
  .get(
    auth("getUsers"),
    validate(userValidation.getUsers),
    userController.getUsers
  );

router.get("/me", auth("me"), userController.me);
router.get("/predictors", userController.getPredictors);
router.get("/topredictor/:id", auth("toPredictor"), userController.toPredictor);
router.get("/touser/:id", auth("toPredictor"), userController.toUser);
router.post(
  "/update",
  auth("updateMe"),
  validate(userValidation.updateNormalUser),
  userController.updateMe
);
router.post(
  "/update-user/:userId",
  auth("updateUser"),
  validate(userValidation.updateNormalUser),
  userController.updateUser
);
router.get("/status/:id", auth("updateUser"), userController.updateStatus);
router
  .route("/:userId")
  .get(
    auth("getUsers"),
    validate(userValidation.getUser),
    userController.getUser
  );

module.exports = router;
