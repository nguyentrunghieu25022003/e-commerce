const express = require("express");
const router = express.Router();

const controller = require("../controllers/product.controller");

const { checkAuthenticated } = require("../middlewares/authenticated");

router.get("/", checkAuthenticated, controller.index);
router.get("/detail/:id", controller.getProduct);
router.post("/detail/:id/comment/create", controller.createComment);
router.delete(
  "/detail/:id/comment/delete/:commentId",
  controller.deleteComment
);
router.post("/detail/:id/add-to-cart/:quantity", controller.addToCart);

module.exports = router;
