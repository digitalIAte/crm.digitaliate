const API_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || "http://localhost:5678/webhook";
const API_KEY = process.env.CRM_DASHBOARD_KEY || "sk_dash_generada_a_mano_12345";

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
    try {
        const res = await fetch(`${API_URL}/api/crm/leads`, {
            headers: { "X-API-KEY": API_KEY },
            cache: "no-store",
            // @ts-ignore - Next.js/Node.js custom agent injection
            agent: httpsAgent
        });
        if (!res.ok) return [];
        const data = await res.json();
        // Handle both { data: [...] } structure and raw [...] array structure
        return Array.isArray(data) ? data : (data.data || []);
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
            // @ts-ignore
            agent: httpsAgent
        });
        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        console.error(`Failed to fetch lead ${id}`, error);
        return null;
    }
}
