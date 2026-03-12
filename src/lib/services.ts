import pool from "./db";
import bcrypt from "bcryptjs";

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

/**
 * Ensures all necessary tables and default data exist in the database.
 * This is called before critical operations to prevent "relation does not exist" errors in production.
 */
export async function ensureDatabaseReady() {
    const client = await pool.connect();
    try {
        console.log("Checking database schema integrity...");
        
        // 1. Kanban Columns Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS kanban_columns (
                id VARCHAR(50) PRIMARY KEY,
                title VARCHAR(100) NOT NULL,
                color VARCHAR(100) DEFAULT 'border-gray-200 bg-gray-50/50',
                position INT DEFAULT 0
            );
            
            INSERT INTO kanban_columns (id, title, color, position) VALUES
            ('new', 'Nuevos', 'border-blue-200 bg-blue-50/50', 0),
            ('contacted', 'Contactados', 'border-yellow-200 bg-yellow-50/50', 1),
            ('qualified', 'Cualificados', 'border-emerald-200 bg-emerald-50/50', 2),
            ('lost', 'Perdidos', 'border-red-200 bg-red-50/50', 3)
            ON CONFLICT (id) DO NOTHING;
        `);

        // 2. Users Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100),
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // 3. Admin User Check
        const adminCheck = await client.query("SELECT * FROM users WHERE email = $1", ["admin@digitaliate.com"]);
        if (adminCheck.rows.length === 0) {
            console.log("Provisioning default admin user...");
            const hashed = await bcrypt.hash("admin123", 10);
            await client.query(
                "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
                ["Admin", "admin@digitaliate.com", hashed]
            );
        }

        // 4. Workspace Settings Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS workspace_settings (
                id SERIAL PRIMARY KEY,
                agency_name VARCHAR(255) DEFAULT 'Digitaliate CRM',
                primary_color VARCHAR(50) DEFAULT '#2563EB',
                n8n_webhook_url TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            INSERT INTO workspace_settings (id, agency_name) 
            VALUES (1, 'Digitaliate CRM')
            ON CONFLICT (id) DO NOTHING;
        `);

        console.log("Database schema is ready.");
    } catch (e: any) {
        console.error("Database initialization failed:", e.message);
        throw e;
    } finally {
        client.release();
    }
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
        // Try the query first, if it fails, try to init and retry once
        try {
            const result = await client.query(`
                SELECT * FROM kanban_columns ORDER BY position ASC
            `);
            return result.rows;
        } catch (e: any) {
            if (e.code === '42P01' || e.message.includes('kanban_columns')) {
                await ensureDatabaseReady();
                const result = await client.query(`
                    SELECT * FROM kanban_columns ORDER BY position ASC
                `);
                return result.rows;
            }
            throw e;
        }
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

export async function getWorkspaceSettings() {
    const client = await pool.connect();
    try {
        const res = await client.query("SELECT * FROM workspace_settings WHERE id = 1");
        return res.rows[0];
    } finally {
        client.release();
    }
}

export async function updateWorkspaceSettings(agency_name: string, n8n_webhook_url: string, primary_color: string) {
    const client = await pool.connect();
    try {
        await client.query(
            "UPDATE workspace_settings SET agency_name = $1, n8n_webhook_url = $2, primary_color = $3 WHERE id = 1",
            [agency_name, n8n_webhook_url, primary_color]
        );
        return true;
    } catch (e) {
        console.error("Update settings error:", e);
        return false;
    } finally {
        client.release();
    }
}

export async function updatePassword(userId: string, currentPass: string, newPass: string) {
    const client = await pool.connect();
    try {
        const res = await client.query("SELECT password FROM users WHERE id = $1", [userId]);
        if (res.rows.length === 0) return { success: false, error: "Usuario no encontrado" };

        const isValid = await bcrypt.compare(currentPass, res.rows[0].password);
        if (!isValid) return { success: false, error: "Contraseña actual incorrecta" };

        const hashed = await bcrypt.hash(newPass, 10);
        await client.query("UPDATE users SET password = $1 WHERE id = $2", [hashed, userId]);
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    } finally {
        client.release();
    }
}
