"use client";

import { useState, useTransition } from "react";
import { Plus, User, Shield, Trash2, Mail, Users as UsersIcon, X, CheckCircle2, AlertCircle } from "lucide-react";
import { createUserAction, updateUserRoleAction, deleteUserAction } from "./actions";

export default function UsersClient({ users }: { users: any[] }) {
    const [isPending, startTransition] = useTransition();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Form State
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("agent");

    const flashMessage = (msg: string, type: 'error' | 'success') => {
        if (type === 'error') setError(msg);
        else setSuccess(msg);
        setTimeout(() => { setError(null); setSuccess(null); }, 3000);
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("role", role);

        startTransition(async () => {
            const res = await createUserAction(formData);
            if (res.success) {
                flashMessage("Usuario creado correctamente", "success");
                setIsCreateModalOpen(false);
                setName(""); setEmail(""); setPassword(""); setRole("agent");
            } else {
                flashMessage(res.error || "Error al crear", "error");
            }
        });
    };

    const handleUpdateRole = (id: string, newRole: string) => {
        startTransition(async () => {
            const res = await updateUserRoleAction(id, newRole);
            if (res.success) {
                flashMessage("Rol actualizado", "success");
            } else {
                flashMessage(res.error || "Error al actualizar", "error");
            }
        });
    };

    const handleDeleteUser = (id: string, name: string) => {
        if (!confirm(`¿Estás seguro de que deseas eliminar permanentemente al usuario ${name}? Esta acción no se puede deshacer.`)) return;
        
        startTransition(async () => {
            const res = await deleteUserAction(id);
            if (res.success) {
                flashMessage("Usuario eliminado", "success");
            } else {
                flashMessage(res.error || "Error al eliminar", "error");
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center">
                        <UsersIcon className="h-8 w-8 mr-3 text-digitaliate" />
                        Gestión de Equipo
                    </h1>
                    <p className="text-gray-500 mt-2">Crea cuentas para tu equipo y gestiona sus permisos de acceso al CRM.</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center px-5 py-2.5 bg-digitaliate text-white font-bold rounded-lg hover:bg-digitaliate-dark transition-colors shadow-sm"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Añadir Usuario
                </button>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center border border-red-100 shadow-sm animate-in fade-in slide-in-from-top-4">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    {error}
                </div>
            )}
            {success && (
                <div className="p-4 bg-green-50 text-green-700 rounded-lg flex items-center border border-green-100 shadow-sm animate-in fade-in slide-in-from-top-4">
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    {success}
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
                                <th className="p-4 pl-6">Usuario</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Rol</th>
                                <th className="p-4 text-right pr-6">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-sm">
                            {users.map(u => (
                                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4 pl-6 font-semibold text-gray-900 flex items-center">
                                        <div className="w-8 h-8 rounded-full bg-digitaliate/10 text-digitaliate flex items-center justify-center mr-3">
                                            {u.role === 'superadmin' ? <Shield className="h-4 w-4" /> : <User className="h-4 w-4" />}
                                        </div>
                                        {u.name}
                                    </td>
                                    <td className="p-4 text-gray-500">
                                        <div className="flex items-center">
                                            <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                            {u.email}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <select
                                            disabled={isPending || u.email === 'admin@digitaliate.com'}
                                            value={u.role}
                                            onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                                            className={`
                                                px-3 py-1.5 rounded-lg border text-sm font-semibold focus:ring-2 appearance-none cursor-pointer outline-none transition-all
                                                ${u.role === 'superadmin' ? 'bg-indigo-50 border-indigo-200 text-indigo-700 focus:ring-indigo-500/20' : ''}
                                                ${u.role === 'manager' ? 'bg-blue-50 border-blue-200 text-blue-700 focus:ring-blue-500/20' : ''}
                                                ${u.role === 'agent' ? 'bg-slate-50 border-slate-200 text-slate-700 focus:ring-slate-500/20' : ''}
                                                ${(isPending || u.email === 'admin@digitaliate.com') ? 'opacity-50 cursor-not-allowed' : ''}
                                            `}
                                        >
                                            <option value="manager">Manager</option>
                                            <option value="agent">Agent</option>
                                            {u.role === 'superadmin' && <option value="superadmin">Superadmin</option>}
                                        </select>
                                        {u.email === 'admin@digitaliate.com' && <span className="text-[10px] text-gray-400 block mt-1">Admin principal</span>}
                                    </td>
                                    <td className="p-4 text-right pr-6">
                                        {u.email !== 'admin@digitaliate.com' && (
                                            <button
                                                onClick={() => handleDeleteUser(u.id, u.name)}
                                                disabled={isPending}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                title="Eliminar usuario"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-500">No hay usuarios registrados.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create User Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center p-6 border-b border-gray-50">
                            <h2 className="text-xl font-bold text-gray-900">Añadir Nuevo Usuario</h2>
                            <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateUser} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre Completo</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-digitaliate/20 focus:border-digitaliate transition-all outline-none"
                                    placeholder="Ej. Juan Pérez"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Correo Electrónico</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-digitaliate/20 focus:border-digitaliate transition-all outline-none"
                                    placeholder="usuario@tuempresa.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Contraseña Inicial</label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-digitaliate/20 focus:border-digitaliate transition-all outline-none"
                                    placeholder="••••••••"
                                    minLength={6}
                                />
                                <p className="text-xs text-gray-400 mt-1">El usuario utilizará esta contraseña para acceder.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Nivel de Acceso (Rol)</label>
                                <select
                                    value={role}
                                    onChange={e => setRole(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-digitaliate/20 focus:border-digitaliate transition-all outline-none bg-white"
                                >
                                    <option value="agent">Agente (Solo ve sus Leads asignados)</option>
                                    <option value="manager">Manager (Ve y reasigna todos los Leads)</option>
                                </select>
                            </div>

                            <div className="pt-4 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 font-semibold hover:bg-gray-50 rounded-lg transition-colors border border-transparent"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="px-6 py-2 bg-gradient-to-r from-digitaliate-light to-digitaliate text-white font-bold rounded-lg shadow-sm hover:shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isPending ? "Creando..." : "Crear Usuario"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
