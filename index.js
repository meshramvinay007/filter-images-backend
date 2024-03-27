const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const routes = require("./routes/routes");

const app = express();

app.use(bodyParser.json());
app.use(cors());

const connection = "mongodb://localhost:27017/ImageFilterDB";

mongoose.connect(connection)
  .then(() => console.log("Mongodb connected"))
  .catch((err) => console.error("Error connecting db", err));

app.use("/", routes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
