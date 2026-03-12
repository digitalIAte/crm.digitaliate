"use client";

import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Loader2, Plus, ExternalLink, Video, Clock, X, Check } from "lucide-react";
import { submitNewAppointment } from "./actions";

export default function AppointmentsPanel({ leadId, leadName, calendlyUrl }: { leadId: string, leadName: string, calendlyUrl: string }) {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        title: "Reunión de Seguimiento",
        start_time: "",
        end_time: "",
        meeting_url: ""
    });

    const fetchAppointments = async () => {
        try {
            const res = await fetch("/api/appointments");
            const data = await res.json();
            if (Array.isArray(data)) {
                setAppointments(data.filter(a => String(a.lead_id) === String(leadId)));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [leadId]);

    const handleScheduleClick = () => {
        const url = new URL(calendlyUrl);
        url.searchParams.set("name", leadName);
        window.open(url.toString(), "_blank");
    };

    const handleManualSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.start_time || !form.end_time) {
            alert("Por favor selecciona fecha y hora de inicio y fin.");
            return;
        }
        setSubmitting(true);
        try {
            const ok = await submitNewAppointment({
                lead_id: leadId,
                ...form
            });
            if (ok) {
                setShowForm(false);
                setForm({ title: "Reunión de Seguimiento", start_time: "", end_time: "", meeting_url: "" });
                await fetchAppointments();
            } else {
                alert("Error al crear la cita.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    <CalendarIcon className="mr-2 h-5 w-5 text-digitaliate" />
                    Citas y Reuniones
                </h3>
                <div className="flex space-x-2">
                    <button 
                        onClick={() => setShowForm(!showForm)}
                        className={`flex items-center text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${showForm ? 'bg-gray-100 text-gray-600' : 'bg-digitaliate/10 text-digitaliate hover:bg-digitaliate/20'}`}
                    >
                        {showForm ? <X className="h-3 w-3 mr-1" /> : <Plus className="h-3 w-3 mr-1" />}
                        {showForm ? 'Cerrar' : 'Añadir'}
                    </button>
                    {!showForm && (
                        <button 
                            onClick={handleScheduleClick}
                            className="flex items-center text-xs font-bold bg-gray-800 text-white px-3 py-1.5 rounded-lg hover:bg-gray-900 transition-colors"
                        >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Calendly
                        </button>
                    )}
                </div>
            </div>

            {showForm ? (
                <form onSubmit={handleManualSubmit} className="bg-gray-50 p-4 rounded-xl border border-gray-200 animate-in fade-in slide-in-from-top-2 duration-300">
                    <h4 className="text-sm font-bold text-gray-700 mb-3">Programar Cita Manualmente</h4>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Título</label>
                            <input 
                                type="text"
                                className="w-full text-sm border-gray-200 rounded-lg focus:ring-digitaliate focus:border-digitaliate"
                                value={form.title}
                                onChange={e => setForm({...form, title: e.target.value})}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Inicio</label>
                                <input 
                                    type="datetime-local"
                                    className="w-full text-sm border-gray-200 rounded-lg focus:ring-digitaliate focus:border-digitaliate"
                                    value={form.start_time}
                                    onChange={e => setForm({...form, start_time: e.target.value})}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Fin</label>
                                <input 
                                    type="datetime-local"
                                    className="w-full text-sm border-gray-200 rounded-lg focus:ring-digitaliate focus:border-digitaliate"
                                    value={form.end_time}
                                    onChange={e => setForm({...form, end_time: e.target.value})}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">URL Reunión (Opcional)</label>
                            <input 
                                type="url"
                                className="w-full text-sm border-gray-200 rounded-lg focus:ring-digitaliate focus:border-digitaliate"
                                placeholder="https://meet.google.com/..."
                                value={form.meeting_url}
                                onChange={e => setForm({...form, meeting_url: e.target.value})}
                            />
                        </div>
                        <button 
                            type="submit"
                            disabled={submitting}
                            className="w-full flex items-center justify-center bg-digitaliate text-white font-bold py-2 rounded-lg hover:bg-digitaliate-dark transition-colors disabled:opacity-50"
                        >
                            {submitting ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Check className="h-4 w-4 mr-2" />}
                            Guardar Cita
                        </button>
                    </div>
                </form>
            ) : (
                <>
                    {loading ? (
                        <div className="flex justify-center py-4">
                            <Loader2 className="animate-spin text-gray-300 h-6 w-6" />
                        </div>
                    ) : appointments.length === 0 ? (
                        <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <CalendarIcon className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Sin Citas</p>
                            <p className="text-[10px] text-gray-400">Este lead no tiene reuniones programadas.</p>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                            {appointments.map(apt => {
                                const isPast = new Date(apt.start_time) < new Date();
                                return (
                                    <div key={apt.id} className={`p-3 rounded-xl border flex flex-col ${isPast ? 'bg-gray-50 border-gray-100 opacity-70' : 'bg-blue-50 border-blue-100'}`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <strong className="text-sm text-gray-900 truncate pr-2">{apt.title || "Reunión"}</strong>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isPast ? 'bg-gray-200 text-gray-600' : 'bg-blue-200 text-blue-800'}`}>
                                                {isPast ? 'Pasada' : 'Próxima'}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-600 flex items-center mb-2">
                                            <Clock className="h-3 w-3 mr-1 text-gray-400" />
                                            {new Date(apt.start_time).toLocaleString()}
                                        </div>
                                        {apt.meeting_url && !isPast && (
                                            <a href={apt.meeting_url} target="_blank" rel="noopener noreferrer" 
                                               className="mt-1 flex items-center justify-center text-xs font-bold bg-white text-digitaliate border border-digitaliate/20 py-1.5 rounded-lg hover:bg-digitaliate/5 transition-colors">
                                                <Video className="h-3 w-3 mr-1" />
                                                Unirse a la Llamada
                                            </a>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
