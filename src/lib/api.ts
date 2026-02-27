const API_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || "https://n8n.javiasl.es/webhook";
const API_KEY = process.env.CRM_DASHBOARD_KEY || "sk_dash_67890";

import { HttpsProxyAgent } from 'https-proxy-agent';
import https from 'https';

// Because n8n is served behind a specific proxy/SNI that Node.js native fetch rejects,
// we create a custom HTTPS agent that ignores unauthorized SSL certs strictly for these internal Next.js Server API calls.
const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
});

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
    // Force Node to ignore unauthorized certs during this exact Next.js fetch
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    try {
        const res = await fetch(`${API_URL}/api/crm/leads`, {
            headers: { "X-API-KEY": API_KEY },
            cache: "no-store"
        });
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data : (data.data || []);
    } catch (error) {
        console.error("Failed to fetch leads", error);
        return [];
    }
}
// Handle both { data: [...] } structure and raw [...] array structure
export async function fetchLeadById(id: string) {
    // Force Node to ignore unauthorized certs during this exact Next.js fetch
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    try {
        const res = await fetch(`${API_URL}/api/crm/leads/${id}`, {
            headers: { "X-API-KEY": API_KEY },
            cache: "no-store"
        });
        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        console.error(`Failed to fetch lead ${id}`, error);
        return null;
    }
}
