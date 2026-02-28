"use server";

import { updateLead, createActivity } from "@/lib/api";
import axios from "axios";
import https from "https";

export async function submitLeadUpdate(id: string, updates: any) {
    return await updateLead(id, updates);
}

export async function submitNewActivity(payload: any) {
    return await createActivity(payload);
}

export async function triggerWhatsApp(phone: string | undefined, message: string) {
    if (!phone) return false;
    try {
        const httpsAgent = new https.Agent({ rejectUnauthorized: false });
        const res = await axios.post("https://n8n.javiasl.es/webhook/b949a121-d460-4c43-8bbb-12dad5eafab4", {
            phone_number: phone,
            message: message
        }, {
            headers: {
                "Content-Type": "application/json"
            },
            httpsAgent
        });
        return res.status >= 200 && res.status < 300;
    } catch (error) {
        console.error("WhatsApp trigger error", error);
        return false;
    }
}

export async function triggerEmail(email: string, subject: string, copy: string) {
    if (!email) return false;
    try {
        const httpsAgent = new https.Agent({ rejectUnauthorized: false });
        const res = await axios.post("https://n8n.javiasl.es/webhook/5e98b182-ec37-41c3-839e-7fb4a473a624", {
            email: email,
            subject: subject,
            message: copy
        }, {
            headers: {
                "Content-Type": "application/json"
            },
            httpsAgent
        });
        return res.status >= 200 && res.status < 300;
    } catch (error) {
        console.error("Email trigger error", error);
        return false;
    }
}
