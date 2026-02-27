import Link from "next/link";
import { Users, LayoutDashboard, Settings } from "lucide-react"; // Assuming we install lucide-react

export default function CRMLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen bg-gray-100">
            <aside className="w-64 bg-slate-900 text-white flex flex-col">
                <div className="p-4 text-2xl font-bold border-b border-slate-800">
                    CRM Logo
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/crm/leads" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition">
                        <Users size={20} />
                        <span>Leads</span>
                    </Link>
                    <Link href="/crm" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition">
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </Link>
                    <Link href="/crm" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition">
                        <Settings size={20} />
                        <span>Settings</span>
                    </Link>
                </nav>
            </aside>
            <main className="flex-1 overflow-y-auto">
                <header className="bg-white shadow px-8 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-semibold text-gray-800">Hello, Admin</h1>
                    <Link href="/crm/login" className="text-sm text-gray-500 hover:text-gray-900">Logout</Link>
                </header>
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
