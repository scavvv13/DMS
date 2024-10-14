const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();

const app = express();

//middleware
app.use(express.json());

//routes

//server starter
app.listen(process.env.PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});
