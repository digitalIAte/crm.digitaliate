export interface Lead {
    id: string;
    email: string;
    phone?: string;
    name: string;
    status: string;
    stage: string;
    score: number;
    owner_email: string;
    created_at: string;
    tags?: string[];
}

export async function fetchLeads(): Promise<Lead[]> {
    try {
        const res = await fetch("/api/leads", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch leads");
        return await res.json();
    } catch (error) {
        console.error("Failed to fetch leads", error);
        return [];
    }
}

export async function fetchLeadById(id: string) {
    try {
        // In Server Components, we might not have a relative URL base, so we could need 
        // the full ORIGIN, but for client-side this works. 
        // If this is called from 'page.tsx' (Server Component), it needs an absolute URL.
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";
        const res = await fetch(`${baseUrl}/api/leads/${id}`, { cache: "no-store" });
        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        console.error(`Failed to fetch lead ${id}`, error);
        return null;
    }
}

export async function updateLead(id: string, updates: Partial<Lead>) {
    try {
        const res = await fetch(`/api/leads/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
        });
        return res.ok;
    } catch (error) {
        console.error(`Failed to update lead ${id}`, error);
        throw error;
    }
}

export async function createActivity(payload: { lead_id: string, type: string, note?: string, source?: string }) {
    try {
        const res = await fetch(`/api/activities`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        return res.ok;
    } catch (error) {
        console.error(`Failed to create activity for lead ${payload.lead_id}`, error);
        throw error;
    }
}

