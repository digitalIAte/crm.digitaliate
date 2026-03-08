import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { lead_id, type, note, source } = body;

        if (!lead_id || !type) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const client = await pool.connect();
        try {
            const result = await client.query(
                `INSERT INTO activities (lead_id, type, note, source) 
                 VALUES ($1, $2, $3, $4) 
                 RETURNING *`,
                [lead_id, type, note || "", source || "CRM"]
            );
            return NextResponse.json({ activity: result.rows[0] });
        } finally {
            client.release();
        }
    } catch (error: any) {
        console.error("Create activity DB error:", error.message);
        return NextResponse.json({ error: "Failed to create activity" }, { status: 500 });
    }
}
