import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import VehicleCard from '../components/VehicleCard';
import { PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        try {
            const { data } = await api.get('/vehicles');
            setVehicles(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this vehicle?')) {
            try {
                await api.delete(`/vehicles/${id}`);
                setVehicles(vehicles.filter(v => v.id !== id));
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">My Garage</h1>
                    <p className="text-slate-400">Manage your fleet health and history</p>
                </div>
                <Link
                    to="/add-vehicle"
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-lg shadow-blue-500/20"
                >
                    <PlusCircle className="h-5 w-5" />
                    <span>Add Vehicle</span>
                </Link>
            </div>

            {loading ? (
                <div className="text-center text-slate-500 py-12">Loading assets...</div>
            ) : vehicles.length === 0 ? (
                <div className="text-center py-20 bg-slate-800/20 rounded-2xl border border-dashed border-slate-700">
                    <h3 className="text-xl text-slate-300 font-semibold mb-2">No vehicles yet</h3>
                    <p className="text-slate-500 mb-6">Start tracking your first vehicle today</p>
                    <Link
                        to="/add-vehicle"
                        className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                    >
                        Add Now
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vehicles.map((vehicle) => (
                        <VehicleCard
                            key={vehicle.id || vehicle._id}
                            vehicle={vehicle}
                            onDelete={() => handleDelete(vehicle._id || vehicle.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
