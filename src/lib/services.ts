import pool from "./db";

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

export async function getLeads(): Promise<Lead[]> {
    const client = await pool.connect();
    try {
        const result = await client.query(`
            SELECT * FROM leads 
            ORDER BY created_at DESC 
            LIMIT 1000
        `);
        return result.rows;
    } finally {
        client.release();
    }
}

export async function getLeadById(id: string) {
    const client = await pool.connect();
    try {
        const leadRes = await client.query("SELECT * FROM leads WHERE id = $1", [id]);
        if (leadRes.rows.length === 0) return null;

        const convsRes = await client.query(
            "SELECT * FROM conversations WHERE lead_id = $1 ORDER BY created_at DESC LIMIT 50",
            [id]
        );
        const actsRes = await client.query(
            "SELECT * FROM activities WHERE lead_id = $1 ORDER BY created_at DESC LIMIT 50",
            [id]
        );

        return {
            lead: leadRes.rows[0],
            conversations: convsRes.rows,
            activities: actsRes.rows
        };
    } finally {
        client.release();
    }
}

export interface KanbanColumn {
    id: string;
    title: string;
    color: string;
    position: number;
}

export async function getKanbanColumns(): Promise<KanbanColumn[]> {
    const client = await pool.connect();
    try {
        const result = await client.query(`
            SELECT * FROM kanban_columns ORDER BY position ASC
        `);
        return result.rows;
    } finally {
        client.release();
    }
}

export async function addKanbanColumn(title: string, color: string): Promise<boolean> {
    const client = await pool.connect();
    try {
        const id = title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
        // Get max position
        const posRes = await client.query("SELECT COALESCE(MAX(position), -1) + 1 as next_pos FROM kanban_columns");
        const nextPos = posRes.rows[0].next_pos;

        await client.query(
            "INSERT INTO kanban_columns (id, title, color, position) VALUES ($1, $2, $3, $4)",
            [id, title, color, nextPos]
        );
        return true;
    } catch (e: any) {
        console.error("Add column error:", e.message);
        return false;
    } finally {
        client.release();
    }
}

export async function updateKanbanColumn(id: string, title: string): Promise<boolean> {
    const client = await pool.connect();
    try {
        await client.query("UPDATE kanban_columns SET title = $1 WHERE id = $2", [title, id]);
        return true;
    } catch (e: any) {
        console.error("Update column error:", e.message);
        return false;
    } finally {
        client.release();
    }
}
