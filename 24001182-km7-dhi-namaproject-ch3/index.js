const express = require("express");
const { body, validationResult } = require("express-validator");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const app = express();
const PORT = 3000;

// Middleware untuk parsing JSON
app.use(express.json());

// Dummy data cars (jika file tidak ada)
let cars = [];

// Path untuk file data cars
const dataFilePath = "./data/cars.json"; // Menggunakan path relatif langsung

// Fungsi untuk membaca data cars dari file JSON
const loadDataFromFile = () => {
  fs.readFile(dataFilePath, (err, data) => {
    if (err) {
      console.error("Error reading file", err);
    } else {
      cars = JSON.parse(data);
    }
  });
};

// Load data cars saat server dijalankan
loadDataFromFile();

// Fungsi untuk menyimpan data car ke file JSON
const saveDataToFile = () => {
  fs.writeFileSync(dataFilePath, JSON.stringify(cars, null, 2), (err) => {
    if (err) {
      console.error("Error Writing file", err);
    }
  });
};

// validate schema
const carValidationRules = [
  body("plate")
    .isString()
    .notEmpty()
    .withMessage("Plat nomor tidak boleh kosong"),
  body("manufacture")
    .isString()
    .notEmpty()
    .withMessage("Merek tidak boleh kosong"),
  body("model").isString().notEmpty().withMessage("Model tidak boleh kosong"),
  body("image")
    .isString()
    .notEmpty()
    .withMessage("URL gambar tidak boleh kosong"),
  body("rentPerDay")
    .isInt({ gt: 0 })
    .withMessage("Harga sewa harus berupa angka positif"),
  body("capacity")
    .isInt({ gt: 0 })
    .withMessage("Kapasitas harus berupa angka positif"),
  body("description")
    .isString()
    .notEmpty()
    .withMessage("Deskripsi tidak boleh kosong"),
  body("availableAt")
    .isISO8601()
    .withMessage("Tanggal ketersediaan tidak valid"),
  body("transmission")
    .isString()
    .notEmpty()
    .withMessage("Transmisi tidak boleh kosong"),
  body("available")
    .isBoolean()
    .withMessage("Ketersediaan harus berupa boolean"),
  body("type").isString().notEmpty().withMessage("Tipe tidak boleh kosong"),
  body("year").isInt({ gt: 1885 }).withMessage("Tahun harus lebih dari 1885"), // Tahun mobil pertama kali diproduksi
  body("options").isArray().withMessage("Opsi harus berupa array"),
  body("specs").isArray().withMessage("Spesifikasi harus berupa array"),
];

// Middleware untuk memeriksa validasi
const validateCar = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

//middleware untuk memeriksa ID
const checkCarExists = (req, res, next) => {
  const car = cars.find((c) => c.id == req.params.id);
  if (!car) {
    const error = new Error("Car not found");
    error.status = 404;
    return next(error);
  }
  req.car = car; // Simpan di req untuk digunakan di endpoint berikutnya
  next();
};

const successResponse = (res, data) => {
  res.status(200).json({
    success: true,
    data,
  });
};

//Enpoint untuk mengecek enpoint /
app.get("/", (req, res, next) => {
  res.status(200).json({ messagea: "Ping successfully" });
});

// Endpoint untuk mendapatkan semua car atau melakukan filter
app.get("/cars", (req, res, next) => {
  const { model, manufacture } = req.query; // Ambil parameter model dan manufacture dari query

  let filteredcars = cars; // Mulai dengan semua cars

  // Filter car berdasarkan model jika ada parameter model
  if (model) {
    filteredcars = filteredcars.filter((cars) =>
      cars.model.toLowerCase().includes(cars.toLowerCase())
    );
  }

  // Filter car berdasarkan manufacture jika ada parameter manufacture
  if (manufacture) {
    filteredcars = filteredcars.filter((cars) =>
      cars.manufacture.toLowerCase().includes(manufacture.toLowerCase())
    );
  }

  // Cek apakah ada car yang ditemukan
  if (filteredcars.length === 0) {
    const error = new Error("No cars found with the provided criteria.");
    error.status = 404;
    return next(error);
  }

  // Kirim respons dengan data car yang difilter
  res.status(200).json({
    success: true,
    data: filteredcars,
  });
});

// Endpoint untuk mendapatkan car berdasarkan ID
app.get("/cars/:id", checkCarExists, (req, res, next) => {
  res.status(200).json({ success: true, data: req.car });
});

// Endpoint untuk menambah car baru
app.post("/cars", carValidationRules, validateCar, (req, res, next) => {
  const newCar = {
    id: uuidv4(), // Menggunakan UUID untuk ID yang unik
    ...req.body,
  };
  cars.push(newCar);
  saveDataToFile();
  res.status(201).json({ success: true, data: newCar });
});

// Endpoint untuk memperbarui data car
app.put(
  "/cars/:id",
  carValidationRules,
  validateCar,
  checkCarExists,
  (req, res, next) => {
    Object.assign(req.car, req.body);
    saveDataToFile();
    return res.status(200).json({ success: true, data: req.car });
  }
);

// Endpoint untuk menghapus car
app.delete("/cars/:id", checkCarExists, (req, res, next) => {
  const carIndex = cars.findIndex((c) => c.id == req.params.id);
  const deletedCar = cars.splice(carIndex, 1); // Menghapus car dari array
  saveDataToFile();
  return res
    .status(200)
    .json({ success: true, msg: "Car deleted!", data: deletedCar });
});

// Middleware untuk menangani respon 404 Not Found
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Resource not found",
  });
});

// Middleware untuk menangani error
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;

  // Error client-side (4xx)
  if (statusCode >= 400 && statusCode < 500) {
    return res.status(statusCode).json({
      success: false,
      status: statusCode,
      message: err.message || "Bad Request",
    });
  }

  // Error server-side (5xx)
  if (statusCode >= 500) {
    // Log error di server
    console.error(err.stack);
    // Pesan kesalahan untuk server error
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan. Silakan coba lagi nanti.",
    });
  }

  next();
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
