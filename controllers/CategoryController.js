const CategoryModel = require("../models/CategoryModel");

exports.getCategories =
  ("/getCategories",
  async (req, res) => {
    try {
      const categories = await CategoryModel.find();

      if (!categories.length) {
        console.log("Categories not found");
      }

      res.send({ categories });
    } catch (err) {
      console.error("Error fetching catgories data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
