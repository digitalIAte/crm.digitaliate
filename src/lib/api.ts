const API_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || "http://localhost:5678/webhook";
const API_KEY = process.env.CRM_DASHBOARD_KEY || "sk_dash_generada_a_mano_12345";

export interface Lead {
    id: string;
    email: string;
    name: string;
    status: string;
    score: number;
    owner_email: string;
    created_at: string;
}

export async function fetchLeads(): Promise<Lead[]> {
    try {
        const res = await fetch(`${API_URL}/api/crm/leads`, {
            headers: { "X-API-KEY": API_KEY },
            cache: "no-store",
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data.data || [];
    } catch (error) {
        console.error("Failed to fetch leads", error);
        return [];
    }
}

export async function fetchLeadById(id: string) {
    try {
        const res = await fetch(`${API_URL}/api/crm/leads/${id}`, {
            headers: { "X-API-KEY": API_KEY },
            cache: "no-store",
        });
        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        console.error(`Failed to fetch lead ${id}`, error);
        return null;
    }
}
