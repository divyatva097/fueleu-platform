import React, { useState, useEffect } from 'react';
import { Users, Plus, Check, CheckCircle } from 'lucide-react';
import axios from 'axios';

export const PoolingTab = () => {
    const [ships, setShips] = useState<any[]>([]);
    const [selectedShips, setSelectedShips] = useState<string[]>([]);
    const [selectedYear, setSelectedYear] = useState('2025');
    const [poolResult, setPoolResult] = useState<any>(null);

    useEffect(() => {
        axios.get('http://127.0.0.1:8001/api/routes')
            .then(res => setShips(res.data))
            .catch(err => console.error(err));
    }, []);

    const toggleShip = (id: string) => {
        setSelectedShips(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const createPool = () => {
        if (selectedShips.length < 2) return alert("Select at least 2 ships to pool!");

        axios.post('http://127.0.0.1:8001/api/pools', {
            year: parseInt(selectedYear),
            members: selectedShips
        })
            .then(res => setPoolResult(res.data))
            .catch(err => alert("Error creating pool: " + err.response?.data?.error));
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Compliance Pooling</h2>
                <p className="text-slate-500 text-sm">Pool compliance balances across fleet vessels (Article 21)</p>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Left Side: Selection */}
                <div className="col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2"><Users size={18} /> Select Fleet Members</h3>
                        <select
                            className="border border-slate-200 rounded-lg px-3 py-1 text-sm outline-none focus:border-blue-500"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                        >
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                        </select>
                    </div>

                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                        {ships.map(ship => (
                            <div
                                key={ship.routeId}
                                onClick={() => toggleShip(ship.routeId)}
                                className={`p-3 rounded-lg border cursor-pointer flex justify-between items-center transition-all ${selectedShips.includes(ship.routeId) ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-slate-300'
                                    }`}
                            >
                                <div>
                                    <p className="font-bold text-slate-800">{ship.routeId}</p>
                                    <p className="text-xs text-slate-500">{ship.vesselType} • {ship.fuelType}</p>
                                </div>
                                {selectedShips.includes(ship.routeId) && <Check className="text-blue-500" size={18} />}
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={createPool}
                        disabled={selectedShips.length < 2}
                        className={`mt-6 w-full py-3 rounded-lg font-bold flex justify-center items-center gap-2 transition-all ${selectedShips.length >= 2 ? 'bg-[#0f172a] hover:bg-slate-800 text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            }`}
                    >
                        <Plus size={18} /> Create Pool with {selectedShips.length} Ships
                    </button>
                </div>

                {/* Right Side: Results */}
                <div className="col-span-5">
                    {!poolResult ? (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-10 h-full flex flex-col items-center justify-center text-slate-400 text-center">
                            <Users size={48} className="mb-4 text-slate-200" />
                            <p>Select multiple ships and click create to see the calculated pool allocation</p>
                        </div>
                    ) : (
                        <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-6 h-full">
                            <h3 className="font-bold text-emerald-800 mb-2 flex items-center gap-2"><CheckCircle size={18} /> Pool Created!</h3>
                            <p className="text-sm text-emerald-600 mb-6">Pool ID: <span className="font-mono bg-emerald-100 px-2 py-1 rounded">{poolResult.poolId}</span></p>

                            <div className="space-y-3">
                                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Allocations:</p>
                                {poolResult.members.map((m: any, idx: number) => (
                                    <div key={idx} className="bg-white p-3 rounded shadow-sm flex justify-between items-center text-sm border border-emerald-100">
                                        <span className="font-bold">{m.shipId}</span>
                                        <span className="font-mono text-slate-600">{m.allocatedCB > 0 ? '+' : ''}{m.allocatedCB.toFixed(2)} CB</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};