// ============================================
// DATABASE CONNECTION - SQLite with better-sqlite3
// ============================================

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Database file path
const dbPath = path.join(dataDir, 'diet.db');

// Create database connection
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize schema
export function initializeDatabase(): void {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');

    // Execute schema (multiple statements)
    db.exec(schema);

    console.log('✅ Database initialized successfully');
}

// Export database instance
export default db;

// Helper to generate UUIDs
export function generateId(): string {
    return crypto.randomUUID();
}

// Helper for timestamps
export function now(): string {
    return new Date().toISOString();
}

// Helper to parse JSON fields safely
export function parseJsonField<T>(value: string | null, defaultValue: T): T {
    if (!value) return defaultValue;
    try {
        return JSON.parse(value);
    } catch {
        return defaultValue;
    }
}

// Helper to stringify for JSON fields
export function stringifyJsonField<T>(value: T): string {
    return JSON.stringify(value);
}
