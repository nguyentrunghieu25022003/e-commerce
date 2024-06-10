const express = require("express");
const router = express.Router();
const passport = require("passport");

const controller = require("../controllers/home.controller");
const { checkNotAuthenticated } = require("../middlewares/authenticated");

router.get("/", controller.index);
router.get("/register", checkNotAuthenticated, controller.register);
router.post("/register", checkNotAuthenticated, controller.handleRegister);
router.get("/login", checkNotAuthenticated, controller.login);
router.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);
router.post("/logout", controller.logout);

module.exports = router;
