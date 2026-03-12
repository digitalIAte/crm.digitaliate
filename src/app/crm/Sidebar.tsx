"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, LayoutDashboard, Settings, BarChart3, MessageSquareText, LogOut, User, Calendar as CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";

export default function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [newLeadsCount, setNewLeadsCount] = useState(0);
    const [agencyName, setAgencyName] = useState("DIGITALIATE CRM");

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch("/api/settings");
                const data = await res.json();
                if (data.agency_name) setAgencyName(data.agency_name.toUpperCase());
            } catch (e) {}
        };
        fetchSettings();
    }, []);

    // ... (keep checkNewLeads logic)
    useEffect(() => {
        const checkNewLeads = async () => {
            try {
                if (pathname === "/crm/leads") {
                    localStorage.setItem("last_leads_visit", new Date().toISOString());
                    setNewLeadsCount(0);
                    return;
                }

                const lastVisit = localStorage.getItem("last_leads_visit");
                if (!lastVisit) {
                    localStorage.setItem("last_leads_visit", new Date(Date.now() - 86400000).toISOString());
                    return;
                }

                const res = await fetch("/api/analytics");
                const data = await res.json();

                if (data && data.leadsByDay && data.leadsByDay.length > 0) {
                    const todayDate = new Date().toISOString().split('T')[0];
                    const todayData = data.leadsByDay.find((d: any) => new Date(d.date).toISOString().split('T')[0] === todayDate);

                    if (todayData && new Date(lastVisit) < new Date(new Date().setHours(0, 0, 0, 0))) {
                        setNewLeadsCount(parseInt(todayData.count));
                    }
                }
            } catch (e) { }
        };

        checkNewLeads();
        const interval = setInterval(checkNewLeads, 30000);
        return () => clearInterval(interval);
    }, [pathname]);

    const navigation = [
        { name: "Dashboard", href: "/crm", icon: LayoutDashboard },
        { name: "Calendario", href: "/crm/calendar", icon: CalendarIcon },
        { name: "Leads Pipeline", href: "/crm/leads", icon: Users, badge: newLeadsCount },
        { name: "Analytics", href: "/crm/analytics", icon: BarChart3 },
        { name: "Plantillas", href: "/crm/templates", icon: MessageSquareText },
        { name: "Settings", href: "/crm/settings", icon: Settings },
    ];

    return (
        <aside className="w-64 bg-white border-r border-gray-100 flex flex-col shadow-sm z-10">
            <div className="h-16 flex items-center px-6 border-b border-gray-50">
                <Link href="/crm" className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-digitaliate to-digitaliate-dark truncate">
                    {agencyName}
                </Link>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1">
                {navigation.map((item) => {
                    const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/crm");
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`
                                group flex items-center px-3 py-2.5 text-sm font-semibold rounded-lg transition-all duration-150
                                ${isActive
                                    ? "bg-digitaliate/10 text-digitaliate"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                }
                            `}
                        >
                            <item.icon
                                className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-150
                                    ${isActive ? "text-digitaliate" : "text-gray-400 group-hover:text-gray-500"}
                                `}
                                aria-hidden="true"
                            />
                            {item.name}

                            {item.badge ? (
                                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                                    {item.badge}
                                </span>
                            ) : null}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-gray-50 space-y-4">
                {session?.user && (
                    <div className="flex items-center px-3 py-2 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="w-8 h-8 rounded-full bg-digitaliate/20 text-digitaliate flex items-center justify-center mr-3 shadow-inner">
                            <User className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-900 truncate">{session.user.name || "Usuario"}</p>
                            <p className="text-[10px] text-gray-500 truncate">{session.user.email}</p>
                        </div>
                    </div>
                )}
                
                <button 
                    onClick={() => signOut()}
                    className="w-full flex items-center px-3 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <LogOut className="mr-3 h-5 w-5" />
                    Cerrar Sesión
                </button>

                <div className="bg-gradient-to-br from-digitaliate/5 to-digitaliate-dark/5 rounded-xl p-4 text-center border border-digitaliate/10">
                    <p className="text-[9px] font-bold text-gray-400 mb-1 uppercase tracking-tight">Direct Access Mode</p>
                    <div className="font-bold text-gray-700 text-xs truncate">Abdel Otsmani</div>
                </div>
            </div>
        </aside>
    );
}
