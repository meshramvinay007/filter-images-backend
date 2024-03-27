const storeImageData = async () => {
    try {
      const mongodbConnection = await mongoose.connect(connection);
  
      if (mongodbConnection) {
        console.log("Mongodb Connected");
      }
  
      const rawData = fs.readFileSync("./instances_train2017.json");
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
          console.log("Successfully inserted images");
          mongoose.disconnect();
        })
        .catch((err) => console.error("Error inserting docs", err));
    } catch (error) {
      console.error("Error storing metadata", error);
    }
  };

  storeImageData()