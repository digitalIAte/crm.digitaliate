import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes("localhost")
        ? false
        : { rejectUnauthorized: false },
});

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = params;

    if (!id) {
        return NextResponse.json({ error: "Lead ID is required" }, { status: 400 });
    }

    try {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            await client.query("DELETE FROM conversations WHERE lead_id = $1", [id]);
            const result = await client.query("DELETE FROM leads WHERE id = $1 RETURNING id", [id]);
            await client.query("COMMIT");

            if (result.rowCount === 0) {
                return NextResponse.json({ error: "Lead not found" }, { status: 404 });
            }

            return NextResponse.json({ success: true, deletedId: id });
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            client.release();
        }
    } catch (error: any) {
        console.error("Delete lead DB error:", error.message);
        return NextResponse.json({ error: "Failed to delete lead" }, { status: 500 });
    }
}
