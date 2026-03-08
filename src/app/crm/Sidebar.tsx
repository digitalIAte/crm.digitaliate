"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, LayoutDashboard, Settings, BarChart3, MessageSquareText } from "lucide-react";
import { useEffect, useState } from "react";

export default function Sidebar() {
    const pathname = usePathname();
    const [newLeadsCount, setNewLeadsCount] = useState(0);

    // Poll for new leads every 30 seconds compared to last visit
    useEffect(() => {
        const checkNewLeads = async () => {
            try {
                // If we are ON the leads page, update the "last visited" timestamp
                if (pathname === "/crm/leads") {
                    localStorage.setItem("last_leads_visit", new Date().toISOString());
                    setNewLeadsCount(0);
                    return;
                }

                // If not, see how many leads were created since our last visit
                const lastVisit = localStorage.getItem("last_leads_visit");
                if (!lastVisit) {
                    localStorage.setItem("last_leads_visit", new Date(Date.now() - 86400000).toISOString());
                    return;
                }

                // Call a quick analytics endpoint or custom endpoint to check counts
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
        { name: "Analytics", href: "/crm/analytics", icon: BarChart3 },
        { name: "Leads Pipeline", href: "/crm/leads", icon: Users, badge: newLeadsCount },
        { name: "Plantillas", href: "/crm/templates", icon: MessageSquareText },
        { name: "Settings", href: "/crm/settings", icon: Settings },
    ];

    return (
        <aside className="w-64 bg-white border-r border-gray-100 flex flex-col shadow-sm z-10">
            <div className="h-16 flex items-center px-6 border-b border-gray-50">
                <Link href="/crm" className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-digitaliate to-digitaliate-dark">
                    DIGITALIATE CRM
                </Link>
                <span className="ml-2 text-[10px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded">DIRECT-DB-V2</span>
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
                                    {item.badge} Novedades
                                </span>
                            ) : null}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-gray-50">
                <div className="bg-gradient-to-br from-digitaliate/5 to-digitaliate-dark/5 rounded-xl p-4 text-center border border-digitaliate/10">
                    <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Desarrollado por</p>
                    <div className="font-bold text-gray-800 tracking-tight">Abdel Otsmani</div>
                    <div className="text-[10px] font-semibold text-digitaliate mt-1 uppercase">AI-Powered System</div>
                </div>
            </div>
        </aside>
    );
}
