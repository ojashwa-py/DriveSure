import { motion } from 'framer-motion';
import { Gauge, Settings, Trash2, Edit, AlertTriangle, CheckCircle } from 'lucide-react';
import clsx from 'clsx';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VehicleCard = ({ vehicle, onDelete, onUpdate }) => {
    const navigate = useNavigate();
    const { brand, model, year, currentMileage, healthScore, status } = vehicle;

    // Color code based on status
    const statusColors = {
        Good: 'text-green-400',
        Warning: 'text-yellow-400',
        Critical: 'text-red-400'
    };

    const ringColors = {
        Good: 'stroke-green-500',
        Warning: 'stroke-yellow-500',
        Critical: 'stroke-red-500'
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => navigate(`/vehicle/${vehicle._id || vehicle.id}`)}
            className="glass rounded-xl p-6 relative group cursor-pointer hover:bg-slate-800/60 transition-colors"
        >
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2" onClick={(e) => e.stopPropagation()}>
                {/* Edit/Delete Actions could go here */}
                <button onClick={() => onDelete(vehicle._id || vehicle.id)} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>

            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-2xl font-bold text-white">{brand} {model}</h3>
                    <p className="text-slate-400">{year} • {vehicle.type}</p>
                </div>

                {/* Health Radial */}
                <div className="relative w-16 h-16 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90">
                        <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-700" />
                        <circle
                            cx="32" cy="32" r="28"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="transparent"
                            strokeDasharray={2 * Math.PI * 28}
                            strokeDashoffset={2 * Math.PI * 28 * (1 - healthScore / 100)}
                            className={clsx(ringColors[status], 'transition-all duration-1000 ease-out')}
                            strokeLinecap="round"
                        />
                    </svg>
                    <span className={clsx("absolute text-sm font-bold", statusColors[status])}>{healthScore}%</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-800/50 p-3 rounded-lg">
                    <p className="text-xs text-slate-500 uppercase">Mileage</p>
                    <p className="text-lg font-mono text-white">{currentMileage.toLocaleString()} km</p>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-lg">
                    <p className="text-xs text-slate-500 uppercase">Next Service</p>
                    {/* Simple estimation: service every 5000km */}
                    <p className="text-lg font-mono text-white">{(vehicle.lastServiceMileage + 5000 - currentMileage).toLocaleString()} km</p>
                </div>
            </div>

            <div className="flex items-center gap-2 mt-auto">
                {status === 'Good' ? <CheckCircle className="h-4 w-4 text-green-400" /> : <AlertTriangle className="h-4 w-4 text-yellow-400" />}
                <span className={clsx("text-sm", statusColors[status])}>
                    {status === 'Good' ? 'Vehicle Healthy' : status === 'Critical' ? 'Immediate Service Needed' : 'Service Due Soon'}
                </span>
            </div>
        </motion.div>
    );
};

export default VehicleCard;
