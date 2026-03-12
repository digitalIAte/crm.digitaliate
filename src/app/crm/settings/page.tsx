"use client";

import { useState } from "react";
import { Settings, Save, Globe, Palette, Shield } from "lucide-react";

export default function SettingsPage() {
    const [agencyName, setAgencyName] = useState("Digitaliate CRM");
    const [webhookUrl, setWebhookUrl] = useState("https://n8n.javiasl.es/webhook");
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate save
        setTimeout(() => {
            setLoading(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }, 1000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center">
                    <Settings className="mr-4 h-10 w-10 text-digitaliate" />
                    Configuración
                </h1>
                <p className="text-gray-500 mt-2 text-lg">Gestiona tu espacio de trabajo e integraciones.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Tabs / Sidebar navigation for settings could go here */}
                <div className="space-y-2">
                    <button className="w-full flex items-center px-4 py-3 text-sm font-bold rounded-xl bg-digitaliate/10 text-digitaliate border border-digitaliate/20">
                        <Globe className="mr-3 h-5 w-5" />
General
                    </button>
                    <button className="w-full flex items-center px-4 py-3 text-sm font-semibold rounded-xl text-gray-500 hover:bg-gray-50 transition-colors">
                        <Palette className="mr-3 h-5 w-5" />
Branding
                    </button>
                    <button className="w-full flex items-center px-4 py-3 text-sm font-semibold rounded-xl text-gray-500 hover:bg-gray-50 transition-colors">
                        <Shield className="mr-3 h-5 w-5" />
Seguridad
                    </button>
                </div>

                <div className="md:col-span-2 space-y-6">
                    <form onSubmit={handleSave} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-8">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <span className="w-8 h-8 rounded-lg bg-digitaliate/10 text-digitaliate flex items-center justify-center mr-3 text-sm">1</span>
                                Espacio de Trabajo
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Nombre de la Agencia</label>
                                    <input 
                                        type="text" 
                                        value={agencyName} 
                                        onChange={(e) => setAgencyName(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-digitaliate focus:border-transparent outline-none transition-all"
                                        placeholder="Ej: Mi Agencia CRM"
                                    />
                                </div>
                            </div>
                        </div>

                        <hr className="border-gray-50" />

                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <span className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center mr-3 text-sm">2</span>
                                Integración n8n
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Webhook URL de Leads</label>
                                    <div className="relative">
                                        <input 
                                            type="url" 
                                            value={webhookUrl} 
                                            onChange={(e) => setWebhookUrl(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-digitaliate focus:border-transparent outline-none transition-all pl-11"
                                            placeholder="https://su-n8n.com/webhook/..."
                                        />
                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    </div>
                                    <p className="mt-2 text-xs text-gray-400 italic">Esta URL se usa para notificar a n8n cuando ocurren eventos en el CRM.</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex items-center justify-between">
                            {saved && (
                                <span className="text-green-600 font-bold text-sm animate-pulse">¡Cambios guardados con éxito!</span>
                            )}
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="ml-auto flex items-center px-8 py-3 bg-digitaliate text-white font-bold rounded-2xl hover:bg-blue-700 hover:-translate-y-0.5 transition-all shadow-lg shadow-digitaliate/20 disabled:opacity-50"
                            >
                                {loading ? "Guardando..." : (
                                    <>
                                        <Save className="mr-2 h-5 w-5" />
                                        Guardar Cambios
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
