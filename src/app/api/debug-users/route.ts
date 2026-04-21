import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const client = await pool.connect();
        const res = await client.query('SELECT id, name, email, role FROM users');
        client.release();
        return NextResponse.json({
            users: res.rows,
            version: "hotfix_v2"
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
