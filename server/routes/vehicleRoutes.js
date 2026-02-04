const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getVehicles,
    getVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle,
} = require('../controllers/vehicleController');
const { getServices, addService } = require('../controllers/serviceController');

router.route('/')
    .get(protect, getVehicles)
    .post(protect, createVehicle);

router.route('/:id')
    .get(protect, getVehicleById)
    .put(protect, updateVehicle)
    .delete(protect, deleteVehicle);

// Service routes nested
router.route('/:vehicleId/services')
    .get(protect, getServices)
    .post(protect, addService);

module.exports = router;
