const { v4: uuidv4 } = require('uuid');
const carsRepository = require('../repositories/carsRepository');
const { imageUpload } = require('../utils/image-kit');

const carsService = {
  // Mendapatkan semua car atau melakukan filter
  getAllCars: (filters) => {
    let cars = carsRepository.getAllCars();
    const { model, manufacture } = filters;

    if (model) {
      cars = cars.filter((car) =>
        car.model.toLowerCase().includes(model.toLowerCase())
      );
    }

    if (manufacture) {
      cars = cars.filter((car) =>
        car.manufacture.toLowerCase().includes(manufacture.toLowerCase())
      );
    }

    return cars;
  },

  // Mendapatkan car berdasarkan ID
  getCarById: (id) => {
    return carsRepository.getCarById(id);
  },

  // Menambahkan car baru
  addCar: async (carData, imageFile) => {
    let imageUrl;
    if (imageFile && imageFile.data) {
      try {
        imageUrl = await imageUpload(imageFile);
      } catch (error) {
        throw error;
      }
    } else {
    }
    const newCar = {
      id: uuidv4(),
      ...carData,
      image: imageUrl,
    };
    carsRepository.addCar(newCar);
    return newCar;
  },
  // update car berdasarkan ID
  updateCar: async (id, carData, imageFile) => {
    const car = carsRepository.getCarById(id);
    
    if (!car) {
      throw new Error('Car not found');
    }
    
    let imageUrl = car.image;
    if (imageFile && imageFile.data) {
      try {
        imageUrl = await imageUpload(imageFile);
      } catch (error) {
        throw error;
      }
    }
    
    const updatedCar = { ...car, ...carData, image: imageUrl };
    carsRepository.updateCar(id, updatedCar);

    return updatedCar;
  },

  // Menghapus car berdasarkan ID
  deleteCar: (id) => {
    return carsRepository.deleteCar(id);
  },
};

module.exports = carsService;
