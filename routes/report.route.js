const express = require("express");
const router = express.Router();

const controller = require("../controllers/report.controller");

router.get("/", controller.index);
router.get("/chat/:id", controller.chat);

module.exports = router;