const mongoose = require("mongoose");

const CategorySchema = mongoose.Schema({
  id: Number,
  supercategory: String,
  name: String,
});

module.exports = mongoose.model("Category", CategorySchema);
