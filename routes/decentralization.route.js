const express = require("express");
const router = express.Router();

const controller = require("../controllers/decentralization.controller");

router.get("/", controller.index);
router.patch("/:id/:value", controller.handleRoles);

module.exports = router;