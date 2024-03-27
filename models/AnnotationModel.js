const mongoose = require("mongoose");

const annotationSchema = mongoose.Schema({
  imageId: Number,
  categoryId: Number,
  bbox: {
    x: Number,
    y: Number,
    w: Number,
    h: Number,
  },
});

module.exports = mongoose.model("Annotation", annotationSchema);
