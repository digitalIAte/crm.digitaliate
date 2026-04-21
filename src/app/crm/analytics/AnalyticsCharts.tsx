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

    if (loading) {
        return <div className="animate-pulse space-y-8">
            <div className="h-64 bg-gray-100 rounded-xl"></div>
            <div className="grid grid-cols-2 gap-8"><div className="h-48 bg-gray-100 rounded-xl"></div><div className="h-48 bg-gray-100 rounded-xl"></div></div>
        </div>;
    }

    if (!data || data.error) return <div className="text-red-500 p-8 text-center bg-red-50 rounded-xl">Error cargando analíticas.</div>;

    const { statusDistribution, leadsByDay, scoreDistribution } = data;

    // Process leads by day for bar chart
    const maxLeads = Math.max(...leadsByDay.map((d: any) => Number(d.count)), 1);
    const totalLeads = statusDistribution.reduce((acc: number, s: any) => acc + Number(s.count), 0);
    const totalWithScore = Number(scoreDistribution?.low ?? 0) + Number(scoreDistribution?.medium ?? 0) + Number(scoreDistribution?.high ?? 0);

    const dayLabels = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

    return (
        <div className="space-y-8">
            {/* Leads by Day - Bar Chart */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <svg className="w-5 h-5 text-digitaliate" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                    Leads captados (Últimos 7 días)
                </h3>
                <div className="flex items-end justify-between h-56 gap-2 px-2">
                    {leadsByDay.map((day: any, i: number) => {
                        const count = Number(day.count);
                        const heightPct = Math.max((count / maxLeads) * 100, count > 0 ? 5 : 0);
                        const dateObj = new Date(day.date + "T12:00:00");
                        const label = dayLabels[dateObj.getDay()];
                        const dayNum = dateObj.getDate();
                        const isToday = i === 6;

                        return (
                            <div key={i} className="flex flex-col items-center flex-1 group">
                                <div className="relative w-full flex justify-center h-full items-end pb-2">
                                    {count === 0 ? (
                                        <div className="w-full max-w-[44px] h-1.5 bg-gray-100 rounded-full" />
                                    ) : (
                                        <div
                                            className={`w-full max-w-[44px] ${isToday ? 'bg-digitaliate' : 'bg-indigo-400'} hover:bg-digitaliate-dark rounded-t-lg transition-all relative group-hover:shadow-lg`}
                                            style={{ height: `${heightPct}%`, minHeight: count > 0 ? '8px' : '0' }}
                                        >
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-900 text-white text-xs font-bold py-1.5 px-3 rounded-lg pointer-events-none transition-all shadow-xl whitespace-nowrap z-10">
                                                {count} lead{count !== 1 ? "s" : ""}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className={`text-xs mt-3 text-center leading-tight ${isToday ? 'text-digitaliate font-bold' : 'text-gray-400'}`}>
                                    <div>{label}</div>
                                    <div className="text-[10px] opacity-80">{dayNum}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Status Distribution */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                        Distribución por Estado
                    </h3>
                    {statusDistribution.length === 0 ? (
                        <p className="text-sm text-gray-400 italic py-4">Sin datos de estado aún.</p>
                    ) : (
                        <div className="space-y-5">
                            {statusDistribution.map((s: any, i: number) => {
                                const count = Number(s.count);
                                const pct = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0;
                                
                                // Direct color mapping using standard Tailwind names for safety
                                const colorMap: Record<string, string> = {
                                    new: "#3b82f6",      // blue-500
                                    qualified: "#10b981", // emerald-500
                                    lost: "#f87171",      // red-400
                                    contacted: "#fbbf24", // amber-400
                                };
                                const hexColor = colorMap[s.status.toLowerCase()] ?? "#818cf8"; // indigo-400

                                return (
                                    <div key={i}>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-sm font-semibold text-gray-700 capitalize">{s.status}</span>
                                            <span className="text-sm font-bold text-gray-900">{count} <span className="text-gray-400 font-normal text-xs ml-1">({pct}%)</span></span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                            <div 
                                                className="h-full rounded-full transition-all duration-500" 
                                                style={{ width: `${pct}%`, backgroundColor: hexColor }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Score Distribution */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
                        Calidad (Score)
                    </h3>
                    {totalWithScore === 0 ? (
                        <p className="text-sm text-gray-400 italic py-4">No hay leads evaluados aún.</p>
                    ) : (
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-sm mb-1.5">
                                    <span className="font-semibold text-emerald-600">Alta (70-100)</span>
                                    <span className="font-bold text-gray-700">{scoreDistribution.high}</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-700" style={{ width: `${(Number(scoreDistribution.high) / totalWithScore) * 100}%` }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-1.5">
                                    <span className="font-semibold text-amber-500">Media (30-69)</span>
                                    <span className="font-bold text-gray-700">{scoreDistribution.medium}</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                    <div className="bg-amber-400 h-full rounded-full transition-all duration-700 border-amber-200" style={{ width: `${(Number(scoreDistribution.medium) / totalWithScore) * 100}%` }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-1.5">
                                    <span className="font-semibold text-rose-500">Baja (0-29)</span>
                                    <span className="font-bold text-gray-700">{scoreDistribution.low}</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                    <div className="bg-rose-400 h-full rounded-full transition-all duration-700" style={{ width: `${(Number(scoreDistribution.low) / totalWithScore) * 100}%` }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="text-center text-[10px] text-gray-300 italic uppercase tracking-widest pb-4">
                Powered by DigitalIAte CRM Engine v2.4
            </div>
        </div>
    );
}
