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

    if (!data || data.error) return <div className="text-red-500">Error loading analytics.</div>;

    const { statusDistribution, leadsByDay, scoreDistribution } = data;

    // Process leads by day for bar chart - always 7 days now
    const maxLeads = Math.max(...leadsByDay.map((d: any) => Number(d.count)), 1);

    // Process scores for progress bars
    const totalWithScore = Number(scoreDistribution?.low ?? 0) + Number(scoreDistribution?.medium ?? 0) + Number(scoreDistribution?.high ?? 0);

    // Total leads for status bar widths
    const totalLeads = statusDistribution.reduce((acc: number, s: any) => acc + Number(s.count), 0);

    const dayLabels = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

    return (
        <div className="space-y-8">
            {/* Leads by Day - Bar Chart */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-6">Leads captados (Últimos 7 días)</h3>
                <div className="flex items-end justify-between h-48 gap-2">
                    {leadsByDay.map((day: any, i: number) => {
                        const count = Number(day.count);
                        const heightPct = Math.max((count / maxLeads) * 100, count > 0 ? 4 : 0);
                        const dateObj = new Date(day.date + "T12:00:00");
                        const label = dayLabels[dateObj.getDay()];
                        const dayNum = dateObj.getDate();
                        return (
                            <div key={i} className="flex flex-col items-center flex-1 group">
                                <div className="relative w-full flex justify-center h-full items-end pb-2">
                                    {count === 0 ? (
                                        <div className="w-full max-w-[40px] h-1 bg-gray-100 rounded-t-sm" />
                                    ) : (
                                        <div
                                            className="w-full max-w-[40px] bg-indigo-400 hover:bg-indigo-600 rounded-t-sm transition-all relative group-hover:shadow-md"
                                            style={{ height: `${heightPct}%` }}
                                        >
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs py-1 px-2 rounded pointer-events-none transition-opacity whitespace-nowrap">
                                                {count} lead{count !== 1 ? "s" : ""}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="text-xs text-gray-400 mt-2 text-center leading-tight">
                                    <div className="font-medium">{label}</div>
                                    <div>{dayNum}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {maxLeads === 1 && leadsByDay.every((d: any) => Number(d.count) === 0) && (
                    <p className="text-center text-sm text-gray-400 mt-4 italic">Sin leads en los últimos 7 días.</p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Status Distribution */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-6">Distribución por Estado</h3>
                    {statusDistribution.length === 0 ? (
                        <p className="text-sm text-gray-400 italic">Sin datos de estado aún.</p>
                    ) : (
                        <div className="space-y-4">
                            {statusDistribution.map((s: any, i: number) => {
                                const pct = totalLeads > 0 ? Math.round((Number(s.count) / totalLeads) * 100) : 0;
                                const colors: Record<string, string> = {
                                    new: "bg-blue-500",
                                    qualified: "bg-emerald-500",
                                    lost: "bg-red-400",
                                    contacted: "bg-yellow-400",
                                };
                                const barColor = colors[s.status] ?? "bg-indigo-400";
                                return (
                                    <div key={i}>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium text-gray-600 capitalize">{s.status}</span>
                                            <span className="text-sm font-bold text-gray-900">{s.count} <span className="text-gray-400 font-normal text-xs">({pct}%)</span></span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                            <div className={`${barColor} h-2 rounded-full transition-all`} style={{ width: `${pct}%` }}></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Score Distribution */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-6">Calidad (Score)</h3>
                    {totalWithScore === 0 ? (
                        <p className="text-sm text-gray-400 italic">No hay leads evaluados aún.</p>
                    ) : (
                        <div className="space-y-5">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-emerald-600">Alta (70-100)</span>
                                    <span className="font-bold text-gray-700">{scoreDistribution.high}</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2.5">
                                    <div className="bg-emerald-500 h-2.5 rounded-full transition-all" style={{ width: `${(Number(scoreDistribution.high) / totalWithScore) * 100}%` }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-yellow-600">Media (30-69)</span>
                                    <span className="font-bold text-gray-700">{scoreDistribution.medium}</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2.5">
                                    <div className="bg-yellow-500 h-2.5 rounded-full transition-all" style={{ width: `${(Number(scoreDistribution.medium) / totalWithScore) * 100}%` }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-red-600">Baja (0-29)</span>
                                    <span className="font-bold text-gray-700">{scoreDistribution.low}</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2.5">
                                    <div className="bg-red-500 h-2.5 rounded-full transition-all" style={{ width: `${(Number(scoreDistribution.low) / totalWithScore) * 100}%` }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
