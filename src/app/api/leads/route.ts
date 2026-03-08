import { NextResponse } from "next/server";
import pool from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const client = await pool.connect();
        try {
            const result = await client.query(`
                SELECT * FROM leads 
                ORDER BY created_at DESC 
                LIMIT 1000
            `);
            return NextResponse.json(result.rows);
        } finally {
            client.release();
        }
    } catch (error: any) {
        console.error("Fetch leads DB error:", error.message);
        return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
    }
}
