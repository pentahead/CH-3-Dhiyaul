require("dotenv").config(); // To enable .env 
const express = require("express");
const fileUpload = require("express-fileupload");
const routes = require("./src/routes");
const {
  errorHandler,
  NotFoundURLHandler,
} = require("./src/middlewares/errorHandler");

// Make/initialize express aplication
const app = express();
const port = process.env.PORT || 4000;

// Middleware untuk parsing JSON
app.use(express.json());

// to read form-body if you want to upload file
app.use(fileUpload({}));

// Use routes
app.use("/", routes);

//Enpoint untuk mengecek enpoint /
app.get("/", (req, res, next) => {
  res.status(200).json({ messages: "Ping successfully!" });
});

// Middleware untuk menangani 404 Not Found
app.use("*", NotFoundURLHandler);

// Middleware untuk menangani error
app.use(errorHandler);

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
