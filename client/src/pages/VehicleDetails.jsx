import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ArrowLeft, Calendar, Wrench, DollarSign, Plus, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';

import { motion } from 'framer-motion';
import Vehicle3D from '../components/Vehicle3D';

const VehicleDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vehicle, setVehicle] = useState(null);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddService, setShowAddService] = useState(false);

    // New Service Form State
    const [serviceForm, setServiceForm] = useState({
        date: new Date().toISOString().split('T')[0],
        mileage: '',
        cost: '',
        notes: ''
    });

    // Issue State
    const [newIssue, setNewIssue] = useState('');
    const [showAddIssue, setShowAddIssue] = useState(false);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const vehicleRes = await api.get(`/vehicles/${id}`);
            const servicesRes = await api.get(`/vehicles/${id}/services`);
            setVehicle(vehicleRes.data);
            setServices(servicesRes.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddService = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/vehicles/${id}/services`, serviceForm);
            setShowAddService(false);
            fetchData(); // Refresh data to update health score and list
            setServiceForm({ ...serviceForm, mileage: '', cost: '', notes: '' });
        } catch (error) {
            console.error(error);
            alert('Failed to add service record');
        }
    };

    const handleAddIssue = async (e) => {
        e.preventDefault();
        if (!newIssue.trim()) return;
        try {
            const updatedIssues = [...(vehicle.issues || []), newIssue];
            await api.put(`/vehicles/${id}`, { issues: updatedIssues });
            setNewIssue('');
            setShowAddIssue(false);
            fetchData(); // Refresh to update health score
        } catch (error) {
            console.error(error);
            alert('Failed to report issue');
        }
    };

    const handleResolveIssue = async (issueIndex) => {
        if (!window.confirm('Mark this issue as resolved?')) return;
        try {
            const updatedIssues = vehicle.issues.filter((_, index) => index !== issueIndex);
            await api.put(`/vehicles/${id}`, { issues: updatedIssues });
            fetchData();
        } catch (error) {
            console.error(error);
            alert('Failed to resolve issue');
        }
    };

    if (loading) return <div className="pt-24 text-center">Loading details...</div>;
    if (!vehicle) return <div className="pt-24 text-center">Vehicle not found</div>;

    return (
        <div className="pt-24 px-4 pb-12 max-w-5xl mx-auto">
            <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Garage
            </button>

            {/* Hero Section */}
            <div className="glass rounded-2xl p-8 mb-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">{vehicle.brand} {vehicle.model}</h1>
                        <p className="text-slate-400 text-lg">{vehicle.year} • {vehicle.registrationNumber}</p>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold text-blue-400">{vehicle.healthScore}%</div>
                        <div className="text-sm text-slate-500 uppercase tracking-wider">Health Score</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="bg-slate-800/50 p-4 rounded-xl">
                        <p className="text-slate-500 text-sm mb-1">Current Mileage</p>
                        <p className="text-xl font-mono text-white">{vehicle.currentMileage.toLocaleString()} km</p>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-xl">
                        <p className="text-slate-500 text-sm mb-1">Last Service</p>
                        <p className="text-xl font-mono text-white">
                            {vehicle.lastServiceDate ? new Date(vehicle.lastServiceDate).toLocaleDateString() : 'N/A'}
                        </p>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-xl">
                        <p className="text-slate-500 text-sm mb-1">Service Status</p>
                        <p className={`text-xl font-bold ${vehicle.status === 'Good' ? 'text-green-400' : vehicle.status === 'Critical' ? 'text-red-400' : 'text-yellow-400'}`}>
                            {vehicle.status}
                        </p>
                    </div>
                </div>
            </div>



            {/* 3D Model Showcase */}
            <div className="mb-8">
                <Vehicle3D type={vehicle.type} />
            </div>

            {/* Issues Section */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <AlertTriangle className="h-6 w-6 text-yellow-400" />
                        Reported Issues
                    </h2>
                    <button
                        onClick={() => setShowAddIssue(!showAddIssue)}
                        className="text-sm px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors"
                    >
                        {showAddIssue ? 'Cancel' : 'Report Issue'}
                    </button>
                </div>

                {showAddIssue && (
                    <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        onSubmit={handleAddIssue}
                        className="glass p-4 rounded-xl mb-4 flex gap-2"
                    >
                        <input
                            type="text"
                            value={newIssue}
                            onChange={(e) => setNewIssue(e.target.value)}
                            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg p-2 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
                            placeholder="e.g. Check Engine Light, Squeaky Brakes..."
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors"
                        >
                            Report
                        </button>
                    </motion.form>
                )}

                {!vehicle.issues || vehicle.issues.length === 0 ? (
                    <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl text-green-400 flex items-center gap-3">
                        <CheckCircle className="h-5 w-5" />
                        <span>No reported issues. Vehicle is in good condition!</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {vehicle.issues.map((issue, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex justify-between items-center group"
                            >
                                <span className="text-red-200 font-medium">{issue}</span>
                                <button
                                    onClick={() => handleResolveIssue(index)}
                                    className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"
                                    title="Mark Resolved"
                                >
                                    <CheckCircle className="h-5 w-5" />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Service Section */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Service History</h2>
                <button
                    onClick={() => setShowAddService(!showAddService)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    {showAddService ? 'Cancel' : 'Add Record'}
                </button>
            </div>

            {/* Add Service Form */}
            {
                showAddService && (
                    <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        onSubmit={handleAddService}
                        className="glass p-6 rounded-xl mb-8 overflow-hidden"
                    >
                        <h3 className="text-lg font-semibold mb-4">New Service Record</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Date</label>
                                <input type="date" required value={serviceForm.date} onChange={e => setServiceForm({ ...serviceForm, date: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2" />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Mileage at Service</label>
                                <input type="number" required value={serviceForm.mileage} onChange={e => setServiceForm({ ...serviceForm, mileage: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2" placeholder="e.g. 55000" />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Cost</label>
                                <input type="number" required value={serviceForm.cost} onChange={e => setServiceForm({ ...serviceForm, cost: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2" placeholder="0.00" />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Notes</label>
                                <input type="text" value={serviceForm.notes} onChange={e => setServiceForm({ ...serviceForm, notes: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2" placeholder="Oil change, Filter replacement..." />
                            </div>
                        </div>
                        <button type="submit" className="w-full py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg">Save Record</button>
                    </motion.form>
                )
            }

            {/* Service List */}
            <div className="space-y-4">
                {services.length === 0 ? (
                    <p className="text-slate-500 text-center py-8">No service history recorded yet.</p>
                ) : (
                    services.map((service) => (
                        <div key={service._id} className="glass p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex items-start gap-4">
                                <div className="bg-slate-700/50 p-3 rounded-lg">
                                    <Wrench className="h-6 w-6 text-slate-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">{service.notes || 'Routine Maintenance'}</h3>
                                    <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
                                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(service.date).toLocaleDateString()}</span>
                                        <span>•</span>
                                        <span>{service.mileage.toLocaleString()} km</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 font-mono text-lg text-green-400 bg-green-400/10 px-3 py-1 rounded-lg">
                                <DollarSign className="h-4 w-4" />
                                {service.cost}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div >
    );
};

export default VehicleDetails;
