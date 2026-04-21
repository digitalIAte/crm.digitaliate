import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
    try {
        const client = await pool.connect();
        try {
            // 1. Status distribution
            const statusRes = await client.query(`
                SELECT status, COUNT(*) as count 
                FROM leads 
                WHERE status IS NOT NULL AND status != ''
                GROUP BY status
            `);

            // 2. Leads by day (last 7 days)
            const daysRes = await client.query(`
                SELECT DATE(created_at) as date, COUNT(*) as count
                FROM leads
                WHERE created_at >= CURRENT_DATE - INTERVAL '6 days'
                GROUP BY DATE(created_at)
                ORDER BY date ASC
            `);

            // 3. Score distribution
            const scoreRes = await client.query(`
                SELECT 
                    SUM(CASE WHEN score < 30 THEN 1 ELSE 0 END) as low,
                    SUM(CASE WHEN score >= 30 AND score < 70 THEN 1 ELSE 0 END) as medium,
                    SUM(CASE WHEN score >= 70 THEN 1 ELSE 0 END) as high
                FROM leads
            `);

            // Build a full 7-day series filling missing days with 0
            const dbDayMap = new Map<string, number>();
            for (const row of daysRes.rows) {
                const key = new Date(row.date).toISOString().split("T")[0];
                dbDayMap.set(key, parseInt(row.count));
            }

            const leadsByDay = [];
            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const key = d.toISOString().split("T")[0];
                leadsByDay.push({ date: key, count: dbDayMap.get(key) ?? 0 });
            }

            return NextResponse.json({
                statusDistribution: statusRes.rows,
                leadsByDay,
                scoreDistribution: scoreRes.rows[0]
            });
        } finally {
            client.release();
        }
    } catch (error: any) {
        console.error("Fetch analytics DB error:", error.message);
        return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
    }
}
