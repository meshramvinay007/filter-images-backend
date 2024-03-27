const mongoose =require("mongoose");
const fs =require("fs");

const storeAnnotationData = async () => {
    try {
      const mongodbConnection = await mongoose.connect(connection);
  
      if (mongodbConnection) {
        console.log("Mongodb Connected");
      }
  
      const rawData = fs.readFileSync("./instances_train2017.json"); //should use file which contains data such as images, categores and annotations
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
  
  storeAnnotationData();