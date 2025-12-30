// ============================================
// FOODS API ROUTES - Full CRUD for foods
// ============================================

import { Router, Request, Response } from 'express';
import db, { generateId, now, parseJsonField, stringifyJsonField } from '../db/database';

const router = Router();

interface Food {
    id: string;
    label: string;
    emoji: string;
    qty: number;
    unit: string;
    grams: number | null;
    tags: string[];
    protein: number;
    carbs: number;
    fat: number;
    calories: number;
    image_url: string | null;
    is_custom: boolean;
    created_at: string;
    updated_at: string;
}

// GET /api/foods - List all foods (with optional search/filter)
router.get('/', (req: Request, res: Response) => {
    try {
        const { search, tag, custom_only } = req.query;

        let query = 'SELECT * FROM foods WHERE 1=1';
        const params: any[] = [];

        if (search) {
            query += ' AND (label LIKE ? OR tags LIKE ?)';
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm);
        }

        if (tag) {
            query += ' AND tags LIKE ?';
            params.push(`%"${tag}"%`);
        }

        if (custom_only === 'true') {
            query += ' AND is_custom = 1';
        }

        query += ' ORDER BY label ASC';

        const foods = db.prepare(query).all(...params) as any[];

        // Parse JSON fields
        const result = foods.map(f => ({
            ...f,
            tags: parseJsonField(f.tags, []),
            is_custom: Boolean(f.is_custom),
        }));

        res.json(result);
    } catch (error) {
        console.error('Error fetching foods:', error);
        res.status(500).json({ error: 'Failed to fetch foods' });
    }
});

// GET /api/foods/:id - Get single food
router.get('/:id', (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const food = db.prepare('SELECT * FROM foods WHERE id = ?').get(id) as any;

        if (!food) {
            return res.status(404).json({ error: 'Food not found' });
        }

        res.json({
            ...food,
            tags: parseJsonField(food.tags, []),
            is_custom: Boolean(food.is_custom),
        });
    } catch (error) {
        console.error('Error fetching food:', error);
        res.status(500).json({ error: 'Failed to fetch food' });
    }
});

// POST /api/foods - Create new food
router.post('/', (req: Request, res: Response) => {
    try {
        const {
            label,
            emoji = '🍽️',
            qty = 1,
            unit = 'serving',
            grams,
            tags = [],
            protein = 0,
            carbs = 0,
            fat = 0,
            calories,
            image_url,
        } = req.body;

        if (!label) {
            return res.status(400).json({ error: 'Label is required' });
        }

        const id = generateId();
        const calculatedCalories = calories || (protein * 4 + carbs * 4 + fat * 9);

        const stmt = db.prepare(`
            INSERT INTO foods (id, label, emoji, qty, unit, grams, tags, protein, carbs, fat, calories, image_url, is_custom, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
        `);

        const timestamp = now();
        stmt.run(
            id, label, emoji, qty, unit, grams || null,
            stringifyJsonField(tags), protein, carbs, fat, calculatedCalories,
            image_url || null, timestamp, timestamp
        );

        res.status(201).json({
            id,
            label,
            emoji,
            qty,
            unit,
            grams,
            tags,
            protein,
            carbs,
            fat,
            calories: calculatedCalories,
            image_url,
            is_custom: true,
            created_at: timestamp,
            updated_at: timestamp,
        });
    } catch (error) {
        console.error('Error creating food:', error);
        res.status(500).json({ error: 'Failed to create food' });
    }
});

// PUT /api/foods/:id - Update food
router.put('/:id', (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const {
            label,
            emoji,
            qty,
            unit,
            grams,
            tags,
            protein,
            carbs,
            fat,
            calories,
            image_url,
        } = req.body;

        // Check if food exists
        const existing = db.prepare('SELECT * FROM foods WHERE id = ?').get(id);
        if (!existing) {
            return res.status(404).json({ error: 'Food not found' });
        }

        const stmt = db.prepare(`
            UPDATE foods SET
                label = COALESCE(?, label),
                emoji = COALESCE(?, emoji),
                qty = COALESCE(?, qty),
                unit = COALESCE(?, unit),
                grams = COALESCE(?, grams),
                tags = COALESCE(?, tags),
                protein = COALESCE(?, protein),
                carbs = COALESCE(?, carbs),
                fat = COALESCE(?, fat),
                calories = COALESCE(?, calories),
                image_url = COALESCE(?, image_url),
                updated_at = ?
            WHERE id = ?
        `);

        const timestamp = now();
        stmt.run(
            label, emoji, qty, unit, grams,
            tags ? stringifyJsonField(tags) : null,
            protein, carbs, fat, calories, image_url,
            timestamp, id
        );

        // Return updated food
        const updated = db.prepare('SELECT * FROM foods WHERE id = ?').get(id) as any;
        res.json({
            ...updated,
            tags: parseJsonField(updated.tags, []),
            is_custom: Boolean(updated.is_custom),
        });
    } catch (error) {
        console.error('Error updating food:', error);
        res.status(500).json({ error: 'Failed to update food' });
    }
});

// DELETE /api/foods/:id - Delete food
router.delete('/:id', (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const result = db.prepare('DELETE FROM foods WHERE id = ?').run(id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Food not found' });
        }

        res.json({ success: true, message: 'Food deleted' });
    } catch (error) {
        console.error('Error deleting food:', error);
        res.status(500).json({ error: 'Failed to delete food' });
    }
});

export default router;
