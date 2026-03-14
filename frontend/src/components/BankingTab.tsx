import React, { useState, useEffect } from 'react';
import { Landmark, ArrowRight, CheckCircle } from 'lucide-react';
import axios from 'axios';

export const BankingTab = () => {
    const [ships, setShips] = useState<any[]>([]);
    const [selectedShip, setSelectedShip] = useState('');
    const [selectedYear, setSelectedYear] = useState('2025');
    const [cbData, setCbData] = useState<any>(null);
    const [bankAmount, setBankAmount] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // 1. Fetch ships for the dropdown
    useEffect(() => {
        axios.get('http://127.0.0.1:8001/api/routes')
            .then(res => setShips(res.data))
            .catch(err => console.error(err));
    }, []);

    // 2. Fetch Compliance Balance when a ship is selected
    useEffect(() => {
        if (selectedShip) {
            axios.get(`http://127.0.0.1:8001/api/compliance/cb?routeId=${selectedShip}`)
                .then(res => setCbData(res.data))
                .catch(err => console.error(err));
        } else {
            setCbData(null);
        }
    }, [selectedShip]);

    // 3. Bank the surplus to the database
    const handleBank = () => {
        axios.post('http://127.0.0.1:8001/api/banking/bank', {
            shipId: selectedShip,
            year: parseInt(selectedYear),
            amount: parseFloat(bankAmount)
        })
            .then(res => {
                setSuccessMsg(res.data.message);
                setBankAmount('');
                setTimeout(() => setSuccessMsg(''), 3000); // Hide message after 3s
            })
            .catch(err => alert("Error: " + (err.response?.data?.error || "Invalid amount")));
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">CB Banking</h2>
                <p className="text-slate-500 text-sm">Bank surplus compliance balance for future periods (Article 20)</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4 text-slate-600 font-medium">
                    <Landmark size={18} /> Select Ship & Year
                </div>
                <div className="flex gap-4">
                    <select
                        className="border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-600 w-48 outline-none focus:border-blue-500"
                        value={selectedShip}
                        onChange={(e) => setSelectedShip(e.target.value)}
                    >
                        <option value="">Select Ship...</option>
                        {ships.map(ship => (
                            <option key={ship.routeId} value={ship.routeId}>{ship.routeId} - {ship.vesselType}</option>
                        ))}
                    </select>
                    <select
                        className="border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-600 w-48 outline-none focus:border-blue-500"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                    >
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                    </select>
                </div>
            </div>

            {!cbData ? (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-16 flex flex-col items-center justify-center text-slate-400 min-h-[400px]">
                    <Landmark size={48} className="mb-4 text-slate-300" />
                    <p>Select a ship from the dropdown above to view its compliance balance</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
                    <h3 className="font-bold text-slate-800 mb-6 border-b pb-2">Compliance Status: {selectedShip}</h3>

                    <div className="flex items-center gap-8 mb-8">
                        <div className={`p-6 rounded-lg ${cbData.status === 'Surplus' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            <p className="text-sm font-bold uppercase tracking-wider mb-1">{cbData.status}</p>
                            <p className="text-3xl font-bold">{cbData.cb.toFixed(2)} <span className="text-sm font-normal">CB</span></p>
                        </div>

                        {cbData.status === 'Surplus' && (
                            <div className="flex-1 max-w-md">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Amount to Bank</label>
                                <div className="flex gap-3">
                                    <input
                                        type="number"
                                        placeholder="Enter amount..."
                                        value={bankAmount}
                                        onChange={(e) => setBankAmount(e.target.value)}
                                        className="border border-slate-200 rounded-lg px-4 py-2 flex-1 outline-none focus:border-blue-500"
                                    />
                                    <button
                                        onClick={handleBank}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                                    >
                                        Bank <ArrowRight size={16} />
                                    </button>
                                </div>
                                {successMsg && <p className="text-green-600 text-sm mt-2 flex items-center gap-1"><CheckCircle size={14} /> {successMsg}</p>}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};