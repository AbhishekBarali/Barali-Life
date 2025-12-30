// ============================================
// FOOD ALTERNATIVES API ROUTES - Swap suggestions
// ============================================

import { Router, Request, Response } from 'express';
import db, { now } from '../db/database';

const router = Router();

// GET /api/alternatives/:foodId - Get alternatives for a food
router.get('/:foodId', (req: Request, res: Response) => {
    try {
        const { foodId } = req.params;

        const alternatives = db.prepare(`
            SELECT fa.*, f.label, f.emoji, f.protein, f.carbs, f.fat, f.calories, f.image_url
            FROM food_alternatives fa
            JOIN foods f ON fa.alternative_food_id = f.id
            WHERE fa.food_id = ?
            ORDER BY fa.priority DESC
        `).all(foodId) as any[];

        res.json(alternatives.map(alt => ({
            id: alt.id,
            food_id: alt.food_id,
            alternative: {
                id: alt.alternative_food_id,
                label: alt.label,
                emoji: alt.emoji,
                protein: alt.protein,
                carbs: alt.carbs,
                fat: alt.fat,
                calories: alt.calories,
                image_url: alt.image_url,
            },
            priority: alt.priority,
        })));
    } catch (error) {
        console.error('Error fetching alternatives:', error);
        res.status(500).json({ error: 'Failed to fetch alternatives' });
    }
});

// POST /api/alternatives - Add alternative relationship
router.post('/', (req: Request, res: Response) => {
    try {
        const { food_id, alternative_food_id, priority = 0 } = req.body;

        if (!food_id || !alternative_food_id) {
            return res.status(400).json({ error: 'food_id and alternative_food_id are required' });
        }

        if (food_id === alternative_food_id) {
            return res.status(400).json({ error: 'Cannot add food as its own alternative' });
        }

        const result = db.prepare(`
            INSERT INTO food_alternatives (food_id, alternative_food_id, priority)
            VALUES (?, ?, ?)
        `).run(food_id, alternative_food_id, priority);

        res.status(201).json({
            id: result.lastInsertRowid,
            food_id,
            alternative_food_id,
            priority,
        });
    } catch (error: any) {
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return res.status(400).json({ error: 'This alternative relationship already exists' });
        }
        console.error('Error adding alternative:', error);
        res.status(500).json({ error: 'Failed to add alternative' });
    }
});

// PUT /api/alternatives/:id - Update priority
router.put('/:id', (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { priority } = req.body;

        if (priority === undefined) {
            return res.status(400).json({ error: 'priority is required' });
        }

        const result = db.prepare('UPDATE food_alternatives SET priority = ? WHERE id = ?').run(priority, id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Alternative not found' });
        }

        res.json({ success: true, id, priority });
    } catch (error) {
        console.error('Error updating alternative:', error);
        res.status(500).json({ error: 'Failed to update alternative' });
    }
});

// DELETE /api/alternatives/:id - Remove alternative
router.delete('/:id', (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const result = db.prepare('DELETE FROM food_alternatives WHERE id = ?').run(id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Alternative not found' });
        }

        res.json({ success: true, message: 'Alternative removed' });
    } catch (error) {
        console.error('Error deleting alternative:', error);
        res.status(500).json({ error: 'Failed to delete alternative' });
    }
});

// GET /api/alternatives/suggest/:foodId - Auto-suggest similar foods
router.get('/suggest/:foodId', (req: Request, res: Response) => {
    try {
        const { foodId } = req.params;

        // Get the food's details
        const food = db.prepare('SELECT * FROM foods WHERE id = ?').get(foodId) as any;
        if (!food) {
            return res.status(404).json({ error: 'Food not found' });
        }

        // Find similar foods based on:
        // 1. Similar protein content (±30%)
        // 2. Same tags
        // 3. Not already an alternative
        const minProtein = food.protein * 0.7;
        const maxProtein = food.protein * 1.3;

        const suggestions = db.prepare(`
            SELECT f.* FROM foods f
            WHERE f.id != ?
            AND f.protein BETWEEN ? AND ?
            AND f.id NOT IN (
                SELECT alternative_food_id FROM food_alternatives WHERE food_id = ?
            )
            ORDER BY ABS(f.protein - ?) ASC
            LIMIT 10
        `).all(foodId, minProtein, maxProtein, foodId, food.protein) as any[];

        res.json(suggestions);
    } catch (error) {
        console.error('Error suggesting alternatives:', error);
        res.status(500).json({ error: 'Failed to suggest alternatives' });
    }
});

export default router;
