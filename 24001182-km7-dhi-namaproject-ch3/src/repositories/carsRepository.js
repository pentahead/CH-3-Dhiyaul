const fs = require("fs");
const path = require("path");

const dataFilePath = path.join(__dirname, "../../data/cars.json");

const carsRepository = {
  // Membaca data dari file
  getAllCars: () => {
    const data = fs.readFileSync(dataFilePath, "utf-8");
    return JSON.parse(data);
  },

  // Menyimpan data ke file
  saveCars: (cars) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(cars, null, 2));
  },

  // Mendapatkan car berdasarkan ID
  getCarById: (id) => {
    const cars = carsRepository.getAllCars();
    return cars.find((car) => car.id === id);
  },

  // Menambahkan car baru
  addCar: (newCar) => {
    const cars = carsRepository.getAllCars();
    cars.push(newCar);
    carsRepository.saveCars(cars);
  },

  //update car
  updateCar: (id, updatedCar) => {
    let cars = carsRepository.getAllCars();
    const carIndex = cars.findIndex((c) => c.id === id);
    if (carIndex === -1) {
      throw new Error("Car not found");
    }
    cars[carIndex] = { ...cars[carIndex], ...updatedCar };
    carsRepository.saveCars(cars);
    return cars[carIndex];
  },

  // Menghapus car
  deleteCar: (id) => {
    let cars = carsRepository.getAllCars();
    const carIndex = cars.findIndex((c) => c.id === id);
    if (carIndex === -1) {
      throw new Error("Car not found");
    }
    const deletedCar = cars.splice(carIndex, 1)[0];
    carsRepository.saveCars(cars);
    return deletedCar;
  },
};

module.exports = carsRepository;
