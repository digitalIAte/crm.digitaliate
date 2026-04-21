"use client";

import { useState, useEffect } from "react";

export default function AnalyticsCharts() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/analytics")
            .then(res => res.json())
            .then(d => {
                setData(d);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-20 text-center animate-pulse">Cargando datos...</div>;
    if (!data) return <div className="p-20 text-center">Sin datos.</div>;

    const { statusDistribution = [], leadsByDay = [], scoreDistribution = {} } = data;
    const totalLeads = statusDistribution.reduce((acc: number, s: any) => acc + Number(s.count), 0);
    const maxLeads = Math.max(...leadsByDay.map((d: any) => Number(d.count)), 1);

    return (
        <div className="space-y-10">
            {/* simple Bars */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-8 underline">Leads en los últimos 7 días (DEBUG MODE)</h3>
                <div className="flex items-end justify-around h-60 border-l-2 border-b-2 border-gray-100 pb-1 pl-4">
                    {leadsByDay.map((day: any, i: number) => {
                        const count = Number(day.count);
                        // Using fixed pixel scaling to avoid % container issues
                        const pixelHeight = count > 0 ? (count / maxLeads) * 200 : 4;
                        return (
                            <div key={i} className="flex flex-col items-center">
                                <div className="text-[10px] font-bold mb-1">{count > 0 ? count : ''}</div>
                                <div 
                                    className={`${count > 0 ? 'bg-blue-600' : 'bg-gray-100'}`} 
                                    style={{ height: `${pixelHeight}px`, width: '40px', borderRadius: '4px 4px 0 0' }}
                                ></div>
                                <div className="text-[10px] mt-2 text-gray-400 font-bold uppercase">{day.date.split('-')[1]}/{day.date.split('-')[2]}</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* status list */}
                <div className="bg-white p-8 rounded-2xl border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-6">Estados (Total: {totalLeads} leads en {statusDistribution.length} categorías)</h3>
                    <div className="space-y-4">
                        {statusDistribution.map((s: any, idx: number) => {
                            const count = Number(s.count);
                            const widthPct = totalLeads > 0 ? (count / totalLeads) * 100 : 0;
                            return (
                                <div key={idx}>
                                    <div className="flex justify-between text-sm mb-1 font-bold">
                                        <span className="capitalize">{s.status}</span>
                                        <span>{count}</span>
                                    </div>
                                    <div className="w-full bg-gray-50 h-3 rounded-full overflow-hidden">
                                        <div className="bg-blue-500 h-full" style={{ width: `${widthPct}%` }}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* scores */}
                <div className="bg-white p-8 rounded-2xl border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-6">Calidad</h3>
                    <div className="space-y-6">
                        <div className="flex justify-between font-bold"><span>Alta</span> <span>{scoreDistribution.high || 0}</span></div>
                        <div className="flex justify-between font-bold"><span>Media</span> <span>{scoreDistribution.medium || 0}</span></div>
                        <div className="flex justify-between font-bold text-red-500"><span>Baja</span> <span>{scoreDistribution.low || 0}</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
