const mongoose = require("mongoose");

const ImageSchema = mongoose.Schema({
  id: Number,
  cocoUrl: String,
  flickrUrl: String,
  height: Number,
  width: Number,
  fileName: String,
  dateCaptured: String,
});

module.exports = mongoose.model("Image", ImageSchema);
