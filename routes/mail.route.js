const express = require("express");
const router = express.Router();

const controller = require("../controllers/mail.controller");

router.get("/", controller.index);
router.patch("/lock-account/:id", controller.lockAccount);
router.patch("/unlock-account/:id", controller.unlockAccount);
router.patch("/lock-all", controller.lockAll);
router.patch("/unlock-all", controller.unlockAll);
router.post("/send-email", controller.sendEmail);

module.exports = router;
