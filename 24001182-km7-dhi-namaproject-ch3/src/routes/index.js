const express = require('express');
const carsRoutes = require('./cars');

const router = express.Router();

router.use('/cars', carsRoutes);

module.exports = router;
