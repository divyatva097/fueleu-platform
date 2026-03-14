import React, { useState } from 'react';
import { Ship, Anchor, BarChart2, Landmark, Users } from 'lucide-react';
import { RoutesTab } from './components/RoutesTab';
import { CompareTab } from './components/CompareTab';
import { BankingTab } from './components/BankingTab';
import { PoolingTab } from './components/PoolingTab';

function App() {
    const [activeTab, setActiveTab] = useState('routes');

    const navItems = [
        { id: 'routes', label: 'Routes', icon: <Anchor size={20} /> },
        { id: 'compare', label: 'Compare', icon: <BarChart2 size={20} /> },
        { id: 'banking', label: 'Banking', icon: <Landmark size={20} /> },
        { id: 'pooling', label: 'Pooling', icon: <Users size={20} /> },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] flex font-sans">
            {/* Sidebar */}
            <div className="w-64 bg-[#0f172a] text-slate-300 flex flex-col border-r border-slate-800">
                <div className="p-6 flex items-center gap-3 mb-4">
                    <div className="bg-[#1e293b] p-2 rounded-lg">
                        <Ship className="text-blue-400" size={24} />
                    </div>
                    <div>
                        <h1 className="text-white font-bold text-lg leading-tight">FuelEU</h1>
                        <p className="text-[10px] text-slate-400 tracking-wider">MARITIME COMPLIANCE</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === item.id
                                    ? 'bg-[#1e293b] text-white border-l-2 border-blue-500 rounded-l-none'
                                    : 'hover:bg-[#1e293b] hover:text-white'
                                }`}
                        >
                            {item.icon} {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-6 mt-auto">
                    <p className="text-[10px] text-slate-500 tracking-wider uppercase">Regulation (EU) 2023/1805</p>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-10 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    {activeTab === 'routes' && <RoutesTab />}
                    {activeTab === 'compare' && <CompareTab />}
                    {activeTab === 'banking' && <BankingTab />}
                    {activeTab === 'pooling' && <PoolingTab />}
                </div>
            </div>
        </div>
    );
}

export default App;