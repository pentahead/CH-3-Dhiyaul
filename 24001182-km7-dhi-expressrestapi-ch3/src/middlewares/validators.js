const { body, validationResult } = require("express-validator");
const { BadRequestError } = require("../utils/requestHandler");

// validate rules for body dan files
const carValidationRules = [
  body("plate")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Plate tidak boleh kosong"),
  body("manufacture")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Manufacture tidak boleh kosong"),
  body("model")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Model tidak boleh kosong"),
  body("rentPerDay")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("rentPerDay tidak boleh kosong")
    .customSanitizer(value => {
      const parsed = parseInt(value);
      return isNaN(parsed) ? null : parsed;
    })
    .isInt({ gt: 0 })
    .withMessage("rentPerDay harus berupa angka positif"),
  body("capacity")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Capacity tidak boleh kosong")
    .customSanitizer(value => {
      const parsed = parseInt(value);
      return isNaN(parsed) ? null : parsed;
    })
    .isInt({ gt: 0 })
    .withMessage("Capacity harus berupa angka positif"),
  body("description")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("description tidak boleh kosong"),
  body("availableAt")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("availableAt tidak boleh kosong")
    .customSanitizer(value => {
      const date = new Date(value);
      return isNaN(date.getTime()) ? null : date.toISOString();
    })
    .isISO8601()
    .withMessage("availableAt harus dalam format ISO8601"),
  body("transmission")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("transmission tidak boleh kosong"),
  body("available")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("available tidak boleh kosong")
    .customSanitizer(value => value.toLowerCase() === 'true')
    .isBoolean()
    .withMessage("available harus berupa boolean"),
  body("type")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Tipe tidak boleh kosong"),
  body("year")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("year tidak boleh kosong")
    .customSanitizer(value => {
      const parsed = parseInt(value);
      return isNaN(parsed) ? null : parsed;
    })
    .isInt({ gt: 1885 })
    .withMessage("year harus lebih dari 1885"),
  body("options")
    .optional()
    .isString()
    .customSanitizer(value => {
      if (!value || value.trim() === "") return null;
      try {
        return JSON.parse(value);
      } catch (e) {
        throw new Error("options harus berupa JSON array yang valid");
      }
    })
    .isArray()
    .withMessage("options harus berupa array"),
  body("specs")
    .optional()
    .isString()
    .customSanitizer(value => {
      if (!value || value.trim() === "") return null;
      try {
        return JSON.parse(value);
      } catch (e) {
        throw new Error("specsifications harus berupa JSON array yang valid");
      }
    })
    .isArray()
    .withMessage("specsifications harus berupa array"),
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
    throw new BadRequestError("");
  }
  next();
};

module.exports = {
  carValidationRules,
  validateCar,
};
