const carsService = require("../services/carsService");
const { successResponse } = require("../utils/responseHandler");
const { NotFoundError } = require("../utils/requestHandler");
// Mendapatkan semua car
const getCars = (req, res, next) => {
  const filters = req.query;
  const cars = carsService.getAllCars(filters);
  if (cars.length === 0) {
    throw new NotFoundError("No cars found with the provided criteria.");
  }
  successResponse(res, cars);
};

// Mendapatkan car berdasarkan ID
const getCarById = (req, res, next) => {
  const car = carsService.getCarById(req.params.id);
  if (!car) {
    throw new NotFoundError(carsService.getCarById.errors);
  }
  successResponse(res, car);
};

// Menambahkan car baru
const addCar = async (req, res, next) => {
  const newCar = await carsService.addCar(req.body, req.files?.image);
  successResponse(res, newCar, 201);
};

// update car berdasarkan ID
const updateCar = async (req, res, next) => {
  const updatedCar = await carsService.updateCar(
    req.params.id,
    req.body,
    req.files?.image
  );
  successResponse(res, updatedCar);
};

// Menghapus car
const deleteCar = (req, res, next) => {
  const deletedCar = carsService.deleteCar(req.params.id);
  successResponse(res, deletedCar);
};

module.exports = {
  getCars,
  getCarById,
  addCar,
  updateCar,
  deleteCar,
};
