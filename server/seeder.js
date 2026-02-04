const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const Vehicle = require('./models/Vehicle');
const ServiceRecord = require('./models/ServiceRecord');

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await ServiceRecord.deleteMany();
        await Vehicle.deleteMany();
        await User.deleteMany();

        const createdUser = await User.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
        });

        const vehicles = [
            {
                user: createdUser._id,
                type: 'Car',
                brand: 'Toyota',
                model: 'Camry',
                year: 2018,
                registrationNumber: 'XYZ-1234',
                currentMileage: 58000,
                lastServiceMileage: 52000, // 6000 km diff -> Critical
                lastServiceDate: new Date('2024-01-01'),
                issues: ['Brake noise'],
            },
            {
                user: createdUser._id,
                type: 'Bike',
                brand: 'Honda',
                model: 'CBR 650R',
                year: 2022,
                registrationNumber: 'HND-999',
                currentMileage: 12000,
                lastServiceMileage: 11000, // 1000 km diff -> Good
                lastServiceDate: new Date('2024-06-01'),
                issues: [],
            },
        ];

        await Vehicle.insertMany(vehicles);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await ServiceRecord.deleteMany();
        await Vehicle.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
