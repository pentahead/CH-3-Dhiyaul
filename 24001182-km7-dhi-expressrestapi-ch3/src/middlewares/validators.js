const { body, validationResult } = require("express-validator");
const { BadRequestError } = require("../utils/requestHandler");

// validate rules for body dan files
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
  body("year").isInt({ gt: 1885 }).withMessage("Tahun harus lebih dari 1885"),
  body("options").isArray().withMessage("Opsi harus berupa array").optional(),
  body("specs").isArray().withMessage("Spesifikasi harus berupa array").optional(),
  (req, res, next) => {
    if (!req.files || !req.files.image) {
      return next(); //cek if  there is an image or not, then next
    }
    const file = req.files.image;
    if (!file.name || !file.data) {
      return res.status(400).json({ status: false, errors: [{ msg: "File tidak valid. Nama file dan data harus ada" }] });
    }
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 50 * 1024 * 1024; 
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({ status: false, errors: [{ msg: "Tipe file tidak didukung. Gunakan JPEG, PNG, atau GIF" }] });
    }
    if (file.size > maxSize) {
      return res.status(400).json({ status: false, errors: [{ msg: "Ukuran file terlalu besar. Maksimum 50MB" }] });
    }
    next();
  },
];

// Middleware untuk memeriksa hasil validasi
const validateCar = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: false, errors: errors.array() });
  }
  next();
};

module.exports = {
  carValidationRules,
  validateCar,
};
