const mongoose = require("mongoose");
const fs = require("fs");

const connection = "mongodb://localhost:27017/ImageFilterDB";

const storeCateegories = async () => {
  try {
    const mongodbConnection = await mongoose.connect(connection);

    if (mongodbConnection) {
      console.log("Mongodb Connected");
    }

    const rawData = fs.readFileSync("./instances_train2017.json");
    const cocoData = JSON.parse(rawData);
    const categories = cocoData.categories.map((category) => ({
      id: category.id,
      name: category.name,
      supercategory: category.supercategory,
    }));

    console.log("categories", categories);

    ImageModel.insertMany(categories)
      .then((res) => {
        console.log("Successfully inserted categories");
        mongoose.disconnect();
      })
      .catch((err) => console.error("Error inserting docs", err));
  } catch (error) {
    console.error("Error storing metadata", error);
  }
};

storeCateegories();
