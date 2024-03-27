const AnnotationModel = require("../models/AnnotationModel");
const CategoryModel = require("../models/CategoryModel");
const ImageModel = require("../models/ImageModel");

exports.getAllImages =
  ("/getAllImages",
  async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 50;
    const skip = (page - 1) * pageSize;

    try {
      // Fetch data from MongoDB
      const results = await ImageModel.find().skip(skip).limit(pageSize);
      
      const totalCount = await ImageModel.countDocuments();

      console.log("images",results)

      res.json({
        page,
        totalPages: Math.ceil(totalCount / pageSize),
        results,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

exports.getFilteredImages =
  ("/getFilteredImages",
  async (req, res) => {
    try {
      console.log("Body Request", req.body);
      const categoryNames = req.body.categories;
      const page = parseInt(req.query.page) || 1;
      console.log("page", page);
      const pageSize = 50;
      const skip = (page - 1) * pageSize;
      const categories = await CategoryModel.find({
        name: { $in: categoryNames },
      });
      console.log("categories", categories);
      if (!categories.length) {
        console.log("Categories not found");
      }

      const categoryIds = categories.map((category) => category.id);
      const annotations = await AnnotationModel.find({
        categoryId: { $in: categoryIds },
      });

      console.log("annotations", annotations);

      // Extract unique imageIds from annotations
      const imageIds = [
        ...new Set(annotations.map((annotation) => annotation.imageId)),
      ];

      const totalCount = imageIds.length;

      // Fetch images based on imageIds with pagination
      const results = await ImageModel.find({ id: { $in: imageIds } })
        .skip(skip)
        .limit(pageSize);

      console.log("images", results);

      res.json({
        page,
        totalPages: Math.ceil(totalCount / pageSize),
        results,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
