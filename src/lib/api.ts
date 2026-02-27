// Force static values to bypass bad environment variables injecting invalid internal IPs causing SNI TLS drops
const API_URL = "https://n8n.javiasl.es/webhook";
const API_KEY = "sk_dash_67890";

import axios from 'axios';
import https from 'https';

// Because n8n is served behind a specific proxy/SNI that Node.js native fetch rejects,
// we create a custom HTTPS agent that ignores unauthorized SSL certs strictly for these internal Next.js Server API calls.
const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
});

axios.defaults.adapter = 'http';

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
        const res = await axios.get(`${API_URL}/api/crm/leads`, {
            headers: { "X-API-KEY": API_KEY },
            httpsAgent: httpsAgent
        });
        const data = res.data;
        return Array.isArray(data) ? data : (data.data || []);
    } catch (error) {
        console.error("Failed to fetch leads", error);
        return [];
    }
}
// Handle both { data: [...] } structure and raw [...] array structure
export async function fetchLeadById(id: string) {
    try {
        const res = await axios.get(`${API_URL}/api/crm/leads/${id}`, {
            headers: { "X-API-KEY": API_KEY },
            httpsAgent: httpsAgent
        });
        return res.data;
    } catch (error) {
        console.error(`Failed to fetch lead ${id}`, error);
        return null;
    }
}
