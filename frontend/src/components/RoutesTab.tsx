import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Target, Filter } from 'lucide-react';

export const RoutesTab = () => {
    const [routes, setRoutes] = useState<any[]>([]);

    // 1. Filter States
    const [vesselFilter, setVesselFilter] = useState('All');
    const [fuelFilter, setFuelFilter] = useState('All');
    const [yearFilter, setYearFilter] = useState('All');

    const fetchRoutes = () => {
        axios.get('http://127.0.0.1:8001/api/routes')
            .then(res => setRoutes(res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchRoutes();
    }, []);

    const setBaseline = (id: string) => {
        axios.post(`http://127.0.0.1:8001/api/routes/${id}/baseline`)
            .then(() => fetchRoutes())
            .catch(err => console.error(err));
    };

    // 2. Generate dynamic dropdown options from the actual data
    const uniqueVessels = ['All', ...Array.from(new Set(routes.map(r => r.vesselType)))];
    const uniqueFuels = ['All', ...Array.from(new Set(routes.map(r => r.fuelType)))];
    const uniqueYears = ['All', ...Array.from(new Set(routes.map(r => r.year)))];

    // 3. Filter the data based on selected dropdowns
    const filteredRoutes = useMemo(() => {
        return routes.filter(route => {
            const matchVessel = vesselFilter === 'All' || route.vesselType === vesselFilter;
            const matchFuel = fuelFilter === 'All' || route.fuelType === fuelFilter;
            const matchYear = yearFilter === 'All' || route.year.toString() === yearFilter.toString();
            return matchVessel && matchFuel && matchYear;
        });
    }, [routes, vesselFilter, fuelFilter, yearFilter]);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Maritime Routes</h2>
                <p className="text-slate-500 text-sm">Manage vessel routes and set compliance baselines</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4 text-slate-600 font-medium">
                    <Filter size={18} /> Filters
                </div>

                {/* Dynamic Filter Dropdowns */}
                <div className="flex gap-4 mb-6">
                    <select
                        value={vesselFilter}
                        onChange={(e) => setVesselFilter(e.target.value)}
                        className="border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-600 w-48 bg-white outline-none focus:border-blue-500 cursor-pointer"
                    >
                        {uniqueVessels.map(v => (
                            <option key={v} value={v}>{v === 'All' ? 'All Vessel Types' : v}</option>
                        ))}
                    </select>

                    <select
                        value={fuelFilter}
                        onChange={(e) => setFuelFilter(e.target.value)}
                        className="border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-600 w-48 bg-white outline-none focus:border-blue-500 cursor-pointer"
                    >
                        {uniqueFuels.map(f => (
                            <option key={f} value={f}>{f === 'All' ? 'All Fuel Types' : f}</option>
                        ))}
                    </select>

                    <select
                        value={yearFilter}
                        onChange={(e) => setYearFilter(e.target.value)}
                        className="border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-600 w-48 bg-white outline-none focus:border-blue-500 cursor-pointer"
                    >
                        {uniqueYears.map(y => (
                            <option key={y} value={y}>{y === 'All' ? 'All Years' : y}</option>
                        ))}
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="text-slate-500 border-b border-slate-200">
                            <tr>
                                <th className="pb-3 font-semibold">ROUTE ID</th>
                                <th className="pb-3 font-semibold">VESSEL TYPE</th>
                                <th className="pb-3 font-semibold">FUEL TYPE</th>
                                <th className="pb-3 font-semibold">YEAR</th>
                                <th className="pb-3 font-semibold">GHG INTENSITY</th>
                                <th className="pb-3 font-semibold">FUEL (T)</th>
                                <th className="pb-3 font-semibold">DISTANCE (KM)</th>
                                <th className="pb-3 font-semibold">EMISSIONS (T)</th>
                                <th className="pb-3 font-semibold">BASELINE</th>
                                <th className="pb-3 font-semibold text-right">ACTION</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-700">
                            {/* Map over filteredRoutes instead of routes */}
                            {filteredRoutes.length > 0 ? (
                                filteredRoutes.map((r) => (
                                    <tr key={r.routeId} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        <td className="py-4 font-bold text-slate-900">{r.routeId}</td>
                                        <td className="py-4">{r.vesselType}</td>
                                        <td className="py-4"><span className="bg-slate-100 text-slate-700 px-2 py-1 rounded font-mono text-xs font-bold">{r.fuelType}</span></td>
                                        <td className="py-4">{r.year}</td>
                                        <td className={`py-4 font-semibold ${r.ghgIntensity > 89.3368 ? 'text-red-500' : 'text-green-500'}`}>
                                            {Number(r.ghgIntensity).toFixed(1)} <span className="text-slate-400 font-normal text-xs">gCO2e/MJ</span>
                                        </td>
                                        <td className="py-4 font-mono">{r.fuelConsumption.toLocaleString()}</td>
                                        <td className="py-4 font-mono">{r.distance.toLocaleString()}</td>
                                        <td className="py-4 font-mono">{r.totalEmissions.toLocaleString()}</td>
                                        <td className="py-4">
                                            {r.isBaseline ? (
                                                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">Baseline</span>
                                            ) : (
                                                <span className="text-slate-400">-</span>
                                            )}
                                        </td>
                                        <td className="py-4 text-right">
                                            {!r.isBaseline && (
                                                <button onClick={() => setBaseline(r.routeId)} className="flex items-center gap-2 justify-end text-slate-600 hover:text-slate-900 font-medium text-xs ml-auto border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-all">
                                                    <Target size={14} /> Set Baseline
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={10} className="py-8 text-center text-slate-400 font-medium">
                                        No routes found matching the selected filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};