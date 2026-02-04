const Vehicle = require('../models/Vehicle');
const ServiceRecord = require('../models/ServiceRecord');

// @desc    Get all vehicles for user
// @route   GET /api/vehicles
// @access  Private
const getVehicles = async (req, res) => {
    if (process.env.DB_CONNECTED === 'false') {
        return res.status(200).json([
            {
                _id: 'mock_vehicle_1',
                user: 'mock_user_id',
                type: 'Car',
                brand: 'Tesla',
                model: 'Model 3',
                year: 2023,
                registrationNumber: 'MOCK-123',
                currentMileage: 15000,
                lastServiceMileage: 10000,
                lastServiceDate: new Date().toISOString(),
                issues: ['Tire pressure low']
            },
            {
                _id: 'mock_vehicle_2',
                user: 'mock_user_id',
                type: 'Bike',
                brand: 'Yamaha',
                model: 'R15',
                year: 2021,
                registrationNumber: 'MOCK-999',
                currentMileage: 5000,
                lastServiceMileage: 4000,
                lastServiceDate: new Date().toISOString(),
                issues: []
            }
        ]);
    }

    const vehicles = await User.findOne({ email: 'guest@example.com' }) ? [] : await Vehicle.find({ user: req.user.id }); // Fallback if using mixed mode, but simple is better
    // Actually just:
    const dbVehicles = await Vehicle.find({ user: req.user.id });
    res.status(200).json(dbVehicles);
};

// @desc    Get single vehicle by ID
// @route   GET /api/vehicles/:id
// @access  Private
const getVehicleById = async (req, res) => {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
        return res.status(404).json({ message: 'Vehicle not found' });
    }

    if (vehicle.user.toString() !== req.user.id) {
        return res.status(401).json({ message: 'User not authorized' });
    }

    res.status(200).json(vehicle);
};

// @desc    Create new vehicle
// @route   POST /api/vehicles
// @access  Private
const createVehicle = async (req, res) => {
    const { type, brand, model, year, registrationNumber, currentMileage, issues } = req.body;

    if (!type || !brand || !model || !year || !currentMileage) {
        return res.status(400).json({ message: 'Please add all required fields' });
    }

    if (process.env.DB_CONNECTED === 'false') {
        return res.status(201).json({
            _id: 'mock_vehicle_' + Math.floor(Math.random() * 1000),
            user: 'mock_user_id',
            type,
            brand,
            model,
            year,
            registrationNumber,
            currentMileage,
            issues,
            lastServiceMileage: req.body.lastServiceMileage || 0,
            lastServiceDate: req.body.lastServiceDate || null,
        });
    }

    const vehicle = await Vehicle.create({
        user: req.user.id,
        type,
        brand,
        model,
        year,
        registrationNumber,
        currentMileage,
        issues,
        lastServiceMileage: req.body.lastServiceMileage || 0,
        lastServiceDate: req.body.lastServiceDate || null,
    });

    res.status(201).json(vehicle);
};

// @desc    Update vehicle
// @route   PUT /api/vehicles/:id
// @access  Private
const updateVehicle = async (req, res) => {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
        return res.status(404).json({ message: 'Vehicle not found' });
    }

    if (vehicle.user.toString() !== req.user.id) {
        return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });

    res.status(200).json(updatedVehicle);
};

// @desc    Delete vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private
const deleteVehicle = async (req, res) => {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
        return res.status(404).json({ message: 'Vehicle not found' });
    }

    if (vehicle.user.toString() !== req.user.id) {
        return res.status(401).json({ message: 'User not authorized' });
    }

    await vehicle.deleteOne();

    // Also delete associated service records
    await ServiceRecord.deleteMany({ vehicle: req.params.id });

    res.status(200).json({ id: req.params.id });
};

module.exports = {
    getVehicles,
    getVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle,
};
