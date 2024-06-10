const express = require("express");
const router = express.Router();

const controller = require("../controllers/contact.controller");
const { checkAuthenticated } = require("../middlewares/authenticated");

router.get("/", checkAuthenticated, controller.index);
router.post("/", controller.sendContact);

module.exports = router;