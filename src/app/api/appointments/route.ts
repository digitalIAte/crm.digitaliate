import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import pool from "@/lib/db";

export async function GET() {
    const session = await getServerSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await pool.connect();
    try {
        const res = await client.query(`
            SELECT a.id, a.title, a.start_time, a.end_time, a.status, a.meeting_url, 
                   l.name as lead_name, l.email as lead_email, l.id as lead_id
            FROM appointments a
            LEFT JOIN leads l ON a.lead_id = l.id
            ORDER BY a.start_time ASC
        `);
        return NextResponse.json(res.rows);
    } catch (error) {
        console.error("GET /api/appointments Error:", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    } finally {
        client.release();
    }
}

export async function POST(req: Request) {
    const session = await getServerSession();
    if (!session) {
        // Allow potentially unauthenticated webhook if we want, 
        // but for now let's keep it safe or check a secret header.
        // For simplicity, let's just check session for manual CRM use.
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { lead_id, title, start_time, end_time, meeting_url } = body;

        if (!lead_id || !start_time || !end_time) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const client = await pool.connect();
        try {
            const res = await client.query(
                `INSERT INTO appointments (lead_id, title, start_time, end_time, meeting_url) 
                 VALUES ($1, $2, $3, $4, $5) RETURNING id`,
                [lead_id, title, new Date(start_time), new Date(end_time), meeting_url || null]
            );

            // Activity log
            await client.query(
                `INSERT INTO activities (lead_id, type, note, source) VALUES ($1, $2, $3, $4)`,
                [lead_id, "meeting", `Cita agendada: ${title}`, "CRM User (API)"]
            );

            return NextResponse.json({ success: true, id: res.rows[0].id });
        } finally {
            client.release();
        }
    } catch (error: any) {
        console.error("POST /api/appointments Error:", error.message);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
