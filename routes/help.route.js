const express = require("express");
const router = express.Router();

const controller = require("../controllers/help.controller");

router.get("/", controller.index);

module.exports = router;
