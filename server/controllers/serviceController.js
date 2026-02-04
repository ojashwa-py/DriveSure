const ServiceRecord = require('../models/ServiceRecord');
const Vehicle = require('../models/Vehicle');

// @desc    Get service records for a vehicle
// @route   GET /api/vehicles/:vehicleId/services
// @access  Private
const getServices = async (req, res) => {
    const records = await ServiceRecord.find({ vehicle: req.params.vehicleId }).sort({ date: -1 });
    res.status(200).json(records);
};

// @desc    Add service record
// @route   POST /api/vehicles/:vehicleId/services
// @access  Private
const addService = async (req, res) => {
    const { date, mileage, cost, notes } = req.body;
    const vehicleId = req.params.vehicleId;

    if (!date || !mileage || !cost) {
        return res.status(400).json({ message: 'Please add all required fields' });
    }

    const vehicle = await Vehicle.findById(vehicleId);

    if (!vehicle) {
        return res.status(404).json({ message: 'Vehicle not found' });
    }

    if (vehicle.user.toString() !== req.user.id) {
        return res.status(401).json({ message: 'User not authorized' });
    }

    const service = await ServiceRecord.create({
        vehicle: vehicleId,
        date,
        mileage,
        cost,
        notes,
    });

    // Update vehicle last service info
    // Only update if this service is more recent/higher mileage than current record?
    // Assume user adds latest service.
    vehicle.lastServiceDate = date;
    vehicle.lastServiceMileage = mileage;

    // If service mileage is greater than current mileage (e.g. corrected), update current
    if (mileage > vehicle.currentMileage) {
        vehicle.currentMileage = mileage;
    }

    await vehicle.save();

    res.status(201).json(service);
};

module.exports = {
    getServices,
    addService,
};
