const mongoose = require('mongoose');

const serviceRecordSchema = new mongoose.Schema({
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    date: { type: Date, required: true },
    mileage: { type: Number, required: true },
    cost: { type: Number, required: true },
    notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('ServiceRecord', serviceRecordSchema);
