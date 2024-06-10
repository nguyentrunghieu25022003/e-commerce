const express = require("express");
const router = express.Router();

const controller = require("../controllers/password.controller");

router.get("/email", controller.index);
router.post("/send-email", controller.handlePassword);
router.get("/confirm", controller.confirmEmail);
router.post("/code-confirm", controller.handleCode);
router.get("/new-password", controller.newPassword);
router.patch("/update-password", controller.updatePassword);

module.exports = router;