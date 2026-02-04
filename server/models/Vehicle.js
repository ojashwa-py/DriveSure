const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['Car', 'Bike'], required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    registrationNumber: { type: String },
    currentMileage: { type: Number, required: true },
    issues: [{ type: String }], // List of reported issues
    lastServiceDate: { type: Date },
    lastServiceMileage: { type: Number },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Virtual for health score
vehicleSchema.virtual('healthScore').get(function () {
    let score = 100;

    // Calculate mileage since last service
    const lastServiceMiles = this.lastServiceMileage || 0;
    const mileageDiff = this.currentMileage - lastServiceMiles;

    // Rule: Mileage
    if (mileageDiff > 5000) {
        score -= 40; // Critical
    } else if (mileageDiff > 3000) {
        score -= 20; // Warning
    }

    // Rule: Age (assuming current year is 2026 based on prompt metadata, or just use JS Date)
    const currentYear = new Date().getFullYear();
    const age = currentYear - this.year;
    if (age > 5) {
        score -= (age - 5) * 2; // -2% for every year above 5
    }

    // Rule: Issues
    if (this.issues && this.issues.length > 0) {
        score -= this.issues.length * 10;
    }

    return Math.max(0, Math.min(score, 100));
});

// Virtual for status based on health score
vehicleSchema.virtual('status').get(function () {
    const score = this.healthScore;
    if (score >= 80) return 'Good';
    if (score >= 50) return 'Warning';
    return 'Critical';
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
