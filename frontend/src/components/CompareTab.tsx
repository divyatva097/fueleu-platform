import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { RefreshCw } from 'lucide-react';

const TARGET_GHG = 89.3368;

export const CompareTab = () => {
    const [data, setData] = useState<any>(null);

    const fetchData = () => {
        // Fetches data from your backend
        axios.get('http://127.0.0.1:8001/api/routes/comparison')
            .then(res => setData(res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => { fetchData(); }, []);

    if (!data) return <div className="p-8 text-slate-500">Loading comparison data...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Compliance Comparison</h2>
                <p className="text-slate-500 text-sm">Compare GHG intensity against baseline and regulatory targets</p>
            </div>

            {/* Top Info Cards */}
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-5 bg-white rounded-xl border-l-4 border-blue-400 shadow-sm p-6 border-y border-r border-slate-200">
                    <p className="text-xs font-bold text-slate-500 tracking-wider mb-2">REGULATORY TARGET (2025)</p>
                    <div className="text-3xl font-bold text-slate-800">
                        {TARGET_GHG} <span className="text-sm font-normal text-slate-400">gCO2e/MJ</span>
                    </div>
                </div>
                <div className="col-span-6 bg-white rounded-xl border-l-4 border-emerald-400 shadow-sm p-6 border-y border-r border-slate-200">
                    <p className="text-xs font-bold text-slate-500 tracking-wider mb-2">BASELINE ROUTE</p>
                    <div className="text-3xl font-bold text-slate-800">
                        {data.baseline?.routeId || 'None'} <span className="text-sm font-normal text-slate-400">{data.baseline?.ghgIntensity || 0} gCO2e/MJ</span>
                    </div>
                </div>
                <div className="col-span-1 flex items-center justify-center">
                    <button onClick={fetchData} className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 text-slate-600 transition-all">
                        <RefreshCw size={24} />
                    </button>
                </div>
            </div>

            {/* Bar Chart Section */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
                <h3 className="font-bold text-slate-800 mb-1">GHG Intensity Comparison</h3>
                <p className="text-sm text-slate-500 mb-8">Bar chart comparing GHG intensity values across routes</p>

                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.comparison} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="routeId" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                            <YAxis domain={[80, 100]} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} label={{ value: 'gCO2e/MJ', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 12 }} />
                            <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <ReferenceLine y={TARGET_GHG} stroke="#0ea5e9" strokeDasharray="5 5" strokeWidth={2} />
                            <Bar dataKey="ghgIntensity" radius={[4, 4, 0, 0]} maxBarSize={60}>
                                {data.comparison.map((entry: any, index: number) => {
                                    const isBaseline = entry.routeId === data.baseline?.routeId;
                                    const isCompliant = entry.ghgIntensity <= TARGET_GHG;
                                    const fill = isBaseline ? '#1e293b' : (isCompliant ? '#22c55e' : '#ef4444');
                                    return <Cell key={`cell-${index}`} fill={fill} />;
                                })}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-6 mt-8 text-sm text-slate-600">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#1e293b]"></div> Baseline</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#22c55e]"></div> Compliant</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#ef4444]"></div> Non-Compliant</div>
                    <div className="flex items-center gap-2"><div className="w-6 h-[2px] border-t-2 border-dashed border-[#0ea5e9]"></div> Target</div>
                </div>
            </div>
        </div>
    );
};