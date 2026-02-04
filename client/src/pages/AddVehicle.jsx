import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ArrowLeft, Car, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const AddVehicle = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        type: 'Car',
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        registrationNumber: '',
        currentMileage: '',
        lastServiceMileage: '', // Optional
        lastServiceDate: '', // Optional
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/vehicles', formData);
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            alert('Failed to add vehicle');
        }
    };

    return (
        <div className="min-h-screen pt-24 px-4 pb-12 max-w-3xl mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Garage
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl p-8"
            >
                <div className="flex items-center gap-4 mb-8 border-b border-slate-700 pb-6">
                    <div className="bg-blue-600/20 p-3 rounded-xl text-blue-400">
                        <Car className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Add New Vehicle</h1>
                        <p className="text-slate-400">Enter your vehicle details to start tracking</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Vehicle Type</label>
                            <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-blue-500">
                                <option value="Car">Car</option>
                                <option value="Bike">Bike</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Registration Number</label>
                            <input type="text" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-blue-500" placeholder="e.g. ABC-1234" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Brand</label>
                            <input type="text" name="brand" value={formData.brand} onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-blue-500" placeholder="e.g. Toyota" required />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Model</label>
                            <input type="text" name="model" value={formData.model} onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-blue-500" placeholder="e.g. Camry" required />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Year</label>
                            <input type="number" name="year" value={formData.year} onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-blue-500" required />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Current Mileage (km)</label>
                            <input type="number" name="currentMileage" value={formData.currentMileage} onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-blue-500" placeholder="e.g. 50000" required />
                        </div>

                        {/* Optional Initial Service Record */}
                        <div className="md:col-span-2 border-t border-slate-700/50 pt-4 mt-2">
                            <p className="text-sm text-slate-500 mb-4">Optional: Last Known Service (Leave empty if new or unknown)</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Last Service Mileage</label>
                                    <input type="number" name="lastServiceMileage" value={formData.lastServiceMileage} onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Last Service Date</label>
                                    <input type="date" name="lastServiceDate" value={formData.lastServiceDate} onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-blue-500" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-6">
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/20"
                        >
                            <Check className="h-5 w-5" />
                            Save Vehicle
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AddVehicle;
