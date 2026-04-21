"use client";

import { useState, useEffect } from "react";

export default function AnalyticsCharts() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("AnalyticsCharts: Fetching data...");
        fetch("/api/analytics")
            .then(res => res.json())
            .then(d => {
                console.log("AnalyticsCharts: Data received", d);
                setData(d);
                setLoading(false);
            })
            .catch((e) => {
                console.error("AnalyticsCharts: Fetch error", e);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="p-12 text-center animate-pulse text-gray-400">Cargando analíticas en tiempo real...</div>;
    }

    if (!data || data.error) return <div className="text-red-500 p-8 text-center bg-red-50 rounded-xl border border-red-200">Error: No se pudieron cargar los datos.</div>;

    const { statusDistribution = [], leadsByDay = [], scoreDistribution = {} } = data;

    // Process leads by day
    const counts = leadsByDay.map((d: any) => Number(d.count));
    const maxLeads = Math.max(...counts, 1);
    
    // Status distribution
    const totalLeads = statusDistribution.reduce((acc: number, s: any) => acc + Number(s.count), 0);
    const totalWithScore = Number(scoreDistribution?.low ?? 0) + Number(scoreDistribution?.medium ?? 0) + Number(scoreDistribution?.high ?? 0);

    const dayLabels = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

    return (
        <div className="space-y-8 pb-12">
            {/* Leads by Day - Bar Chart */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-xl font-extrabold text-gray-900 mb-8 border-l-4 border-digitaliate pl-4">
                    Leads en los últimos 7 días
                </h3>
                <div className="flex items-end justify-between h-64 gap-3">
                    {leadsByDay.map((day: any, i: number) => {
                        const count = Number(day.count);
                        // Force a visible height for any count >= 1
                        const barHeight = count > 0 ? (count / maxLeads) * 100 : 0;
                        const dateObj = new Date(day.date + "T12:00:00");
                        const label = dayLabels[dateObj.getDay()];
                        const isToday = i === 6;

                        return (
                            <div key={i} className="flex flex-col items-center flex-1 group h-full">
                                <div className="relative w-full flex justify-center h-full items-end pb-2 border-b border-gray-50">
                                    <div 
                                        className={`w-full max-w-[48px] rounded-t-md transition-all duration-500 relative flex justify-center items-start pt-1 ${count > 0 ? (isToday ? 'bg-blue-600 shadow-blue-200 shadow-lg' : 'bg-blue-400 opacity-80') : 'bg-gray-50 h-[4px] rounded-full'}`}
                                        style={{ height: count > 0 ? `${barHeight}%` : '4px', minHeight: count > 0 ? '20px' : '4px' }}
                                    >
                                        {count > 0 && (
                                            <span className="text-[10px] font-bold text-white absolute -top-6 bg-gray-900 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                {count}
                                            </span>
                                        )}
                                        {count > 0 && <span className="text-[10px] font-bold text-white hidden sm:block">{count}</span>}
                                    </div>
                                </div>
                                <div className={`text-xs mt-3 flex flex-col items-center ${isToday ? 'text-blue-600 font-bold' : 'text-gray-400'}`}>
                                    <span className="uppercase tracking-tighter">{label}</span>
                                    <span className="text-[10px] opacity-60 font-medium">{day.date.split('-')[2]}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Status Distribution */}
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm shadow-indigo-50/50">
                    <h3 className="text-xl font-extrabold text-gray-900 mb-8 border-l-4 border-indigo-500 pl-4">Embudo de Estados</h3>
                    <div className="space-y-6">
                        {statusDistribution.map((s: any, i: number) => {
                            const count = Number(s.count);
                            const pct = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0;
                            
                            const colorMap: Record<string, string> = {
                                new: "#2563eb",
                                qualified: "#10b981",
                                lost: "#ef4444",
                                contacted: "#f59e0b",
                            };
                            const hexColor = colorMap[s.status.toLowerCase()] ?? "#6366f1";

                            return (
                                <div key={i} className="group">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: hexColor }}></div>
                                            <span className="text-sm font-bold text-gray-700 capitalize">{s.status === 'new' ? 'Nuevos' : s.status}</span>
                                        </div>
                                        <span className="text-sm font-black text-gray-900">{count} <span className="text-gray-300 font-medium text-[10px] ml-1">({pct}%)</span></span>
                                    </div>
                                    <div className="w-full bg-gray-50 rounded-full h-3 overflow-hidden border border-gray-100 group-hover:border-gray-200 transition-colors">
                                        <div 
                                            className="h-full rounded-full transition-all duration-1000 shadow-sm" 
                                            style={{ width: `${pct}%`, backgroundColor: hexColor }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Score Distribution */}
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm shadow-amber-50/50">
                    <h3 className="text-xl font-extrabold text-gray-900 mb-8 border-l-4 border-amber-500 pl-4">Calidad de Leads</h3>
                    {totalWithScore === 0 ? (
                        <div className="py-12 text-center text-gray-300 italic">Esperando evaluación de leads...</div>
                    ) : (
                        <div className="space-y-8">
                            <ScoreRow label="Alta Potencial (70-100)" count={scoreDistribution.high} total={totalWithScore} color="#059669" />
                            <ScoreRow label="Interés Medio (30-69)" count={scoreDistribution.medium} total={totalWithScore} color="#d97706" />
                            <ScoreRow label="Bajo Perfil (0-29)" count={scoreDistribution.low} total={totalWithScore} color="#dc2626" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function ScoreRow({ label, count, total, color }: any) {
    const pct = total > 0 ? (Number(count) / total) * 100 : 0;
    return (
        <div>
            <div className="flex justify-between items-end text-sm mb-2">
                <span className="font-bold text-gray-600">{label}</span>
                <span className="font-black text-xl text-gray-900">{count}</span>
            </div>
            <div className="w-full bg-gray-50 rounded-full h-4 overflow-hidden p-0.5 border border-gray-100">
                <div 
                    className="h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${pct}%`, backgroundColor: color }}
                ></div>
            </div>
        </div>
    );
}
