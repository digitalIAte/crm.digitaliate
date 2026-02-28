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
    stage: string;
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
        const res = await axios.get(`${API_URL}/c5ef6da7-cc54-4219-be3f-1e4ebcfc6904?id=${id}`, {
            headers: { "X-API-KEY": API_KEY },
            httpsAgent: httpsAgent
        });
        const data = res.data;
        if (!data || !data.lead) return null;
        return data;
    } catch (error) {
        console.error(`Failed to fetch lead ${id}`, error);
        return null;
    }
}

export async function updateLead(id: string, updates: Partial<Lead>) {
    try {
        const res = await axios.patch(`${API_URL}/ac177c2e-c6fe-4f34-a734-56da8a44993d?id=${id}`, updates, {
            headers: {
                "X-API-KEY": API_KEY,
                "Content-Type": "application/json"
            },
            httpsAgent: httpsAgent
        });
        return res.data;
    } catch (error) {
        console.error(`Failed to update lead ${id}`, error);
        throw error;
    }
}

export async function createActivity(payload: { lead_id: string, type: string, note?: string, source?: string }) {
    try {
        const res = await axios.post(`${API_URL}/7a14cb5e-9b8e-4ab5-8634-61e652485739`, payload, {
            headers: {
                "X-API-KEY": API_KEY,
                "Content-Type": "application/json"
            },
            httpsAgent: httpsAgent
        });
        return res.data;
    } catch (error) {
        console.error(`Failed to create activity for lead ${payload.lead_id}`, error);
        throw error;
    }
}
