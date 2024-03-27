const express = require("express");
const router = express.Router();
const imageController = require("../controllers/ImageController");
const categoryController = require("../controllers/CategoryController");

router.get("/getCategories", categoryController.getCategories);
router.get("/getAllImages", imageController.getAllImages);
router.post("/getFilteredImages", imageController.getFilteredImages);

module.exports = router;
