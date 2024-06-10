const express = require("express");
const router = express.Router();

const controller = require("../controllers/product-management.controller");
const upload = require("../middlewares/multer");

router.get("/", controller.productList);
router.get("/create", controller.create);
router.post("/create", upload.single("images"), controller.createNewProduct);
router.delete("/delete/:id", controller.deleteProduct);
router.get("/edit/:id", controller.edit);
router.post("/edit/:id", upload.single("images"), controller.editProduct);

module.exports = router;