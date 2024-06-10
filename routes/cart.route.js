const express = require("express");
const router = express.Router();

const controller = require("../controllers/cart.controller");
const { checkAuthenticated } = require("../middlewares/authenticated");
const { cartInitialized } = require("../middlewares/cart-initialized");

router.get("/", checkAuthenticated, cartInitialized, controller.index);
router.post("/increase/:id", controller.increaseQuantity);
router.post("/decrease/:id", controller.decreaseQuantity);
router.post("/add-to-cart/:id", controller.addToCart);
router.delete("/delete/:id", controller.deleteProduct);
router.post("/delete-products", controller.deleteSelected);
router.post("/pay-now", controller.payProducts);
router.get("/view-cart", controller.viewCart);
router.get("/view-cart/processing", controller.processing);
router.get("/view-cart/shipped", controller.shipped);
router.patch("/view-cart/shipped/:id/received", controller.shipped);
router.get("/view-cart/cancelled", controller.cancelled);
router.patch("/view-cart/:id/cancelled", controller.cancelled);
router.get("/view-cart/delivered", controller.delivered);

module.exports = router;
