const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors")
require("dotenv").config();

const authRoutes = require("./routes/auth");
const placeRoutes = require("./routes/places");

const app = express();

app.use(cors())
app.use(express.static("uploads"));

app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, PATCH, DELETE"
//   );
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   next();
// });

app.use("/auth", authRoutes);
app.use("/places", placeRoutes);

const PORT = process.env.PORT || 4000;

mongoose
  .connect(process.env.MONGODB_KEY, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4
  })
  .then((result) => {
    app.listen(PORT);
  })
  .catch((err) => console.log(err));
