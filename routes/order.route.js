const express = require("express");
const router = express.Router();

const controller = require("../controllers/order.controller");

router.get("/", controller.index);
router.get("/processing", controller.processing);
router.get("/shipped", controller.shipped);
router.patch("/:id/shipped", controller.shipped);
router.get("/cancelled", controller.cancelled);
router.patch("/:id/cancelled", controller.cancelled);
router.get("/delivered", controller.delivered);

module.exports = router;
