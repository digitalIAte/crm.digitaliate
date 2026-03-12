require("dotenv").config({ path: "./dashboard/.env" });
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        console.log("Creating users table...");
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100),
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Check if admin exists
        const res = await pool.query("SELECT * FROM users WHERE email = $1", ["admin@digitaliate.com"]);
        if (res.rows.length === 0) {
            console.log("Creating default admin user...");
            const hashed = await bcrypt.hash("admin123", 10);
            await pool.query(
                "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
                ["Admin", "admin@digitaliate.com", hashed]
            );
            console.log("Admin user created: admin@digitaliate.com / admin123");
        } else {
            console.log("Admin user already exists.");
        }

        console.log("Database setup complete.");
    } catch (err) {
        console.error("Migration error:", err);
    } finally {
        await pool.end();
    }
}

run();
