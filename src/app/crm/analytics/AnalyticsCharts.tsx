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

    if (loading) return (
        <div className="space-y-8 animate-pulse">
            <div className="h-64 bg-gray-50 rounded-3xl"></div>
            <div className="grid grid-cols-2 gap-8"><div className="h-64 bg-gray-50 rounded-3xl"></div><div className="h-64 bg-gray-50 rounded-3xl"></div></div>
        </div>
    );

    if (!data || data.error) return (
        <div className="p-12 text-center bg-red-50 rounded-3xl border-2 border-red-100">
            <p className="text-red-600 font-bold">Error de conexión con el motor de datos.</p>
            <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-red-600 text-white rounded-full text-sm font-bold">Reintentar</button>
        </div>
    );

    const { statusDistribution = [], leadsByDay = [], scoreDistribution = {} } = data;
    const totalLeads = statusDistribution.reduce((acc: number, s: any) => acc + Number(s.count), 0);
    const maxLeads = Math.max(...leadsByDay.map((d: any) => Number(d.count)), 1);
    const totalWithScore = Number(scoreDistribution?.low ?? 0) + Number(scoreDistribution?.medium ?? 0) + Number(scoreDistribution?.high ?? 0);

    const dayLabelsMap: Record<number, string> = {
        0: "Dom", 1: "Lun", 2: "Mar", 3: "Mié", 4: "Jue", 5: "Vie", 6: "Sáb"
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Leads Timeline */}
            <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-blue-900/5 transition-all">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">Actividad Reciente</h3>
                        <p className="text-sm text-gray-400 font-medium">Volumen de captación por día</p>
                    </div>
                    <div className="bg-blue-50 px-4 py-2 rounded-2xl flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
                        <span className="text-xs font-bold text-blue-700 uppercase tracking-widest">En Vivo</span>
                    </div>
                </div>

                <div className="flex items-end justify-between h-56 gap-2 sm:gap-4 px-2">
                    {leadsByDay.map((day: any, i: number) => {
                        const count = Number(day.count);
                        const isToday = i === 6;
                        const dateObj = new Date(day.date + "T12:00:00");
                        const label = dayLabelsMap[dateObj.getDay()];
                        
                        // Robust height calculation
                        const height = count > 0 ? (count / maxLeads) * 100 : 0;

                        return (
                            <div key={i} className="flex flex-col items-center flex-1 group">
                                <div className="relative w-full flex justify-center h-full items-end pb-4">
                                    <div 
                                        className={`w-full max-w-[50px] transition-all duration-700 rounded-2xl relative ${count > 0 ? (isToday ? 'bg-gradient-to-t from-blue-700 to-blue-500 shadow-xl shadow-blue-200' : 'bg-gray-200 hover:bg-blue-300') : 'bg-gray-50 h-2'}`}
                                        style={{ height: count > 0 ? `${height}%` : '8px', minHeight: count > 0 ? '30px' : '8px' }}
                                    >
                                        {count > 0 && (
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-black px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100 shadow-xl z-20">
                                                {count}
                                            </div>
                                        )}
                                        {count > 0 && (
                                            <div className="h-full w-full flex items-center justify-center">
                                                <span className={`text-[10px] font-black ${isToday ? 'text-white' : 'text-gray-500'} hidden sm:block`}>{count}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className={`mt-2 flex flex-col items-center transition-colors ${isToday ? 'text-blue-600' : 'text-gray-400'}`}>
                                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">{label}</span>
                                    <span className="text-[14px] font-bold mt-1">{day.date.split('-')[2]}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Status Funnel */}
                <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-indigo-900/5">
                    <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                        </div>
                        Flujo de Conversión
                    </h3>
                    <div className="space-y-6">
                        {statusDistribution.map((s: any, idx: number) => {
                            const count = Number(s.count);
                            const width = totalLeads > 0 ? (count / totalLeads) * 100 : 0;
                            const colors: any = {
                                new: { bg: "bg-blue-600", text: "text-blue-700", light: "bg-blue-50", hex: "#2563eb" },
                                qualified: { bg: "bg-emerald-600", text: "text-emerald-700", light: "bg-emerald-50", hex: "#059669" },
                                contacted: { bg: "bg-amber-500", text: "text-amber-700", light: "bg-amber-50", hex: "#f59e0b" },
                                lost: { bg: "bg-rose-500", text: "text-rose-700", light: "bg-rose-50", hex: "#e11d48" }
                            };
                            const theme = colors[s.status.toLowerCase()] || { bg: "bg-gray-600", text: "text-gray-700", light: "bg-gray-50", hex: "#4b5563" };

                            return (
                                <div key={idx} className="group">
                                    <div className="flex justify-between items-end mb-2">
                                        <div className={`px-3 py-1 rounded-full ${theme.light} ${theme.text} text-[10px] font-black uppercase tracking-widest`}>
                                            {s.status === 'new' ? 'Nuevos' : s.status}
                                        </div>
                                        <div className="text-sm font-black text-gray-900">{count} <span className="text-gray-300 font-medium ml-1">({Math.round(width)}%)</span></div>
                                    </div>
                                    <div className="w-full bg-gray-50 h-4 rounded-2xl overflow-hidden p-[3px] border border-gray-100 bg-clip-content">
                                        <div 
                                            className={`${theme.bg} h-full rounded-2xl transition-all duration-1000 ease-out shadow-sm`}
                                            style={{ width: `${width}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Accuracy / Score */}
                <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-emerald-900/5">
                    <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        Calificacción IA
                    </h3>
                    
                    {totalWithScore === 0 ? (
                        <div className="h-64 flex flex-col items-center justify-center text-gray-300">
                            <svg className="w-12 h-12 mb-2 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <p className="italic text-sm font-medium">Analizando calidad de leads...</p>
                        </div>
                    ) : (
                        <div className="space-y-8 py-2">
                            <ScoreCard label="Alta Prioridad" count={scoreDistribution.high} total={totalWithScore} color="bg-emerald-500" text="text-emerald-600" />
                            <ScoreCard label="Interés Medio" count={scoreDistribution.medium} total={totalWithScore} color="bg-amber-500" text="text-amber-600" />
                            <ScoreCard label="Perfil Bajo" count={scoreDistribution.low} total={totalWithScore} color="bg-rose-500" text="text-rose-600" />
                        </div>
                    )}
                </div>
            </div>
            
            <div className="text-center">
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest px-6 py-2 border border-gray-100 rounded-full">
                    Actualizado: {new Date().toLocaleTimeString('es-ES')}
                </span>
            </div>
        </div>
    );
}

function ScoreCard({ label, count, total, color, text }: any) {
    const pct = total > 0 ? (Number(count) / total) * 100 : 0;
    return (
        <div className="relative">
            <div className="flex justify-between items-end mb-3">
                <span className="text-xs font-black text-gray-400 uppercase tracking-wider">{label}</span>
                <span className={`text-2xl font-black ${text}`}>{count}</span>
            </div>
            <div className="w-full bg-gray-50 h-2 rounded-full overflow-hidden">
                <div 
                    className={`${color} h-full rounded-full transition-all duration-1000`}
                    style={{ width: `${pct}%` }}
                ></div>
            </div>
        </div>
    );
}
