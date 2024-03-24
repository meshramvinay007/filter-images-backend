const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());
app.use(cors());

const connection = "mongodb://localhost:27017/ImageFilterDB";

const mongodbConnection = mongoose
  .connect(connection)
  .then(() => console.log("Mongodb connected"))
  .catch((err) => console.error("Error connecting db", err));

const ImageSchema = mongoose.Schema({
  id: Number,
  cocoUrl: String,
  flickrUrl: String,
  height: Number,
  width: Number,
  fileName: String,
  dateCaptured: String,
});

const CategorySchema = mongoose.Schema({
  id: Number,
  supercategory: String,
  name: String,
});

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

const AnnotationModel = mongoose.model("Annotation", annotationSchema);

const CategoryModel = mongoose.model("Category", CategorySchema);

const ImageModel = mongoose.model("Image", ImageSchema);

const storeAnnotationData = async () => {
  try {
    const mongodbConnection = await mongoose.connect(connection);

    if (mongodbConnection) {
      console.log("Mongodb Connected");
    }

    const rawData = fs.readFileSync("instances_train2017.json"); //should use file which contains data such as images, categores and annotations
    const cocoData = JSON.parse(rawData);
    const annotations = cocoData.annotations.map((annotation) => ({
      imageId: annotation.image_id,
      categoryId: annotation.category_id,
      bbox: {
        x: annotation.bbox[0],
        y: annotation.bbox[1],
        width: annotation.bbox[2],
        height: annotation.bbox[3],
      },
    }));

    console.log("Anotations", annotations);

    AnnotationModel.insertMany(annotations)
      .then((res) => console.log("Successfully inserted annotations"))
      .catch((err) => console.error("Error inserting docs", err));
  } catch (error) {
    console.error("Error storing metadata", error);
  }
};

const storeImageData = async () => {
  try {
    const mongodbConnection = await mongoose.connect(connection);

    if (mongodbConnection) {
      console.log("Mongodb Connected");
    }

    const rawData = fs.readFileSync("instances_train2017.json");
    const cocoData = JSON.parse(rawData);
    const images = cocoData.images.map((image) => ({
      id: image.id,
      fileName: image.file_name,
      cocoUrl: image.coco_url,
      flickrUrl: image.flickr_url,
      height: image.height,
      width: image.width,
      dateCaptured: image.date_captured,
    }));

    console.log("images", images);

    ImageModel.insertMany(images)
      .then((res) => {
        console.log("Successfully inserted categories");
        mongoose.disconnect();
      })
      .catch((err) => console.error("Error inserting docs", err));
  } catch (error) {
    console.error("Error storing metadata", error);
  }
};

app.get("/getCategories", async (req, res) => {
  try {
    const categories = await CategoryModel.find();

    if (!categories.length) {
      console.log("Categories not found");
    }

    res.send({ categories });
  } catch (err) {}
});

app.get("/getAllImages", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = 50;
  const skip = (page - 1) * pageSize;

  try {
    // Fetch data from MongoDB
    const results = await ImageModel.find().skip(skip).limit(pageSize);
    const totalCount = await ImageModel.countDocuments();

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

app.post("/getFilteredImages", async (req, res) => {
  try {
    const categoryNames = req.body.categories;
    const page = parseInt(req.query.page) || 1;
    const pageSize = 50;
    const skip = (page - 1) * pageSize;
    const categories = await CategoryModel.find({
      name: { $in: categoryNames },
    });
    if (!categories.length) {
      console.log("Categories not found");
    }

    const categoryIds = categories.map((category) => category.id);
    const annotations = await AnnotationModel.find({
      categoryId: { $in: categoryIds },
    });

    // Extract unique imageIds from annotations
    const imageIds = [
      ...new Set(annotations.map((annotation) => annotation.imageId)),
    ];

    const totalCount = imageIds.length;

    // Fetch images based on imageIds with pagination
    const results = await ImageModel.find({ id: { $in: imageIds } })
      .skip(skip)
      .limit(pageSize);

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

app.listen(4000, () => {
  console.log("App runninng on port 4000");
});
