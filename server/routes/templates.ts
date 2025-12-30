// ============================================
// MEAL TEMPLATES API ROUTES - Diet plan templates
// ============================================

import { Router, Request, Response } from 'express';
import db, { generateId, now, parseJsonField, stringifyJsonField } from '../db/database';

const router = Router();

// GET /api/templates - List templates (with optional filters)
router.get('/', (req: Request, res: Response) => {
    try {
        const { mode, day_type, slot, active_only } = req.query;

        let query = 'SELECT * FROM meal_templates WHERE 1=1';
        const params: any[] = [];

        if (mode) {
            query += ' AND mode = ?';
            params.push(mode);
        }

        if (day_type) {
            query += ' AND day_type = ?';
            params.push(day_type);
        }

        if (slot) {
            query += ' AND slot = ?';
            params.push(slot);
        }

        if (active_only === 'true') {
            query += ' AND is_active = 1';
        }

        query += ' ORDER BY mode, slot';

        const templates = db.prepare(query).all(...params) as any[];

        res.json(templates.map(t => ({
            ...t,
            is_active: Boolean(t.is_active),
        })));
    } catch (error) {
        console.error('Error fetching templates:', error);
        res.status(500).json({ error: 'Failed to fetch templates' });
    }
});

// GET /api/templates/:id - Get template with items
router.get('/:id', (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const template = db.prepare('SELECT * FROM meal_templates WHERE id = ?').get(id) as any;
        if (!template) {
            return res.status(404).json({ error: 'Template not found' });
        }

        // Get items with food/recipe details
        const items = db.prepare(`
            SELECT 
                mti.*,
                f.label as food_label, f.emoji as food_emoji, f.protein as food_protein, f.carbs as food_carbs, f.fat as food_fat, f.calories as food_calories, f.image_url as food_image,
                r.name as recipe_name, r.total_protein as recipe_protein, r.total_carbs as recipe_carbs, r.total_fat as recipe_fat, r.total_calories as recipe_calories, r.image_url as recipe_image
            FROM meal_template_items mti
            LEFT JOIN foods f ON mti.food_id = f.id
            LEFT JOIN recipes r ON mti.recipe_id = r.id
            WHERE mti.template_id = ?
            ORDER BY mti.sort_order
        `).all(id) as any[];

        res.json({
            ...template,
            is_active: Boolean(template.is_active),
            items: items.map(item => ({
                id: item.id,
                food_id: item.food_id,
                recipe_id: item.recipe_id,
                qty: item.qty,
                is_swappable: Boolean(item.is_swappable),
                sort_order: item.sort_order,
                food: item.food_id ? {
                    label: item.food_label,
                    emoji: item.food_emoji,
                    protein: item.food_protein,
                    carbs: item.food_carbs,
                    fat: item.food_fat,
                    calories: item.food_calories,
                    image_url: item.food_image,
                } : null,
                recipe: item.recipe_id ? {
                    name: item.recipe_name,
                    protein: item.recipe_protein,
                    carbs: item.recipe_carbs,
                    fat: item.recipe_fat,
                    calories: item.recipe_calories,
                    image_url: item.recipe_image,
                } : null,
            })),
        });
    } catch (error) {
        console.error('Error fetching template:', error);
        res.status(500).json({ error: 'Failed to fetch template' });
    }
});

// POST /api/templates - Create template
router.post('/', (req: Request, res: Response) => {
    try {
        const {
            name,
            mode,
            day_type = 'training',
            slot,
            intention = 'BALANCED',
            note,
            items = [], // [{ food_id?, recipe_id?, qty, is_swappable }]
        } = req.body;

        if (!name || !mode || !slot) {
            return res.status(400).json({ error: 'Name, mode, and slot are required' });
        }

        const id = generateId();
        const timestamp = now();

        // Insert template
        db.prepare(`
            INSERT INTO meal_templates (id, name, mode, day_type, slot, intention, note, is_active, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
        `).run(id, name, mode, day_type, slot, intention, note || null, timestamp, timestamp);

        // Insert items
        const insertItem = db.prepare(`
            INSERT INTO meal_template_items (template_id, food_id, recipe_id, qty, is_swappable, sort_order)
            VALUES (?, ?, ?, ?, ?, ?)
        `);

        items.forEach((item: any, index: number) => {
            insertItem.run(
                id,
                item.food_id || null,
                item.recipe_id || null,
                item.qty || 1,
                item.is_swappable ? 1 : 0,
                index
            );
        });

        res.status(201).json({
            id,
            name,
            mode,
            day_type,
            slot,
            intention,
            note,
            is_active: true,
            items,
        });
    } catch (error) {
        console.error('Error creating template:', error);
        res.status(500).json({ error: 'Failed to create template' });
    }
});

// PUT /api/templates/:id - Update template
router.put('/:id', (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, mode, day_type, slot, intention, note, is_active, items } = req.body;

        const existing = db.prepare('SELECT * FROM meal_templates WHERE id = ?').get(id);
        if (!existing) {
            return res.status(404).json({ error: 'Template not found' });
        }

        db.prepare(`
            UPDATE meal_templates SET
                name = COALESCE(?, name),
                mode = COALESCE(?, mode),
                day_type = COALESCE(?, day_type),
                slot = COALESCE(?, slot),
                intention = COALESCE(?, intention),
                note = COALESCE(?, note),
                is_active = COALESCE(?, is_active),
                updated_at = ?
            WHERE id = ?
        `).run(name, mode, day_type, slot, intention, note, is_active, now(), id);

        // If items provided, replace all
        if (items) {
            db.prepare('DELETE FROM meal_template_items WHERE template_id = ?').run(id);

            const insertItem = db.prepare(`
                INSERT INTO meal_template_items (template_id, food_id, recipe_id, qty, is_swappable, sort_order)
                VALUES (?, ?, ?, ?, ?, ?)
            `);

            items.forEach((item: any, index: number) => {
                insertItem.run(
                    id,
                    item.food_id || null,
                    item.recipe_id || null,
                    item.qty || 1,
                    item.is_swappable ? 1 : 0,
                    index
                );
            });
        }

        const updated = db.prepare('SELECT * FROM meal_templates WHERE id = ?').get(id) as any;
        res.json({
            ...updated,
            is_active: Boolean(updated.is_active),
        });
    } catch (error) {
        console.error('Error updating template:', error);
        res.status(500).json({ error: 'Failed to update template' });
    }
});

// DELETE /api/templates/:id - Delete template
router.delete('/:id', (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const result = db.prepare('DELETE FROM meal_templates WHERE id = ?').run(id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Template not found' });
        }

        res.json({ success: true, message: 'Template deleted' });
    } catch (error) {
        console.error('Error deleting template:', error);
        res.status(500).json({ error: 'Failed to delete template' });
    }
});

// POST /api/templates/:id/items - Add item to template
router.post('/:id/items', (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { food_id, recipe_id, qty = 1, is_swappable = false } = req.body;

        if (!food_id && !recipe_id) {
            return res.status(400).json({ error: 'Either food_id or recipe_id is required' });
        }

        // Get max sort order
        const maxOrder = db.prepare('SELECT MAX(sort_order) as max FROM meal_template_items WHERE template_id = ?').get(id) as any;
        const sortOrder = (maxOrder?.max || 0) + 1;

        const result = db.prepare(`
            INSERT INTO meal_template_items (template_id, food_id, recipe_id, qty, is_swappable, sort_order)
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(id, food_id || null, recipe_id || null, qty, is_swappable ? 1 : 0, sortOrder);

        res.status(201).json({
            id: result.lastInsertRowid,
            template_id: id,
            food_id,
            recipe_id,
            qty,
            is_swappable,
            sort_order: sortOrder,
        });
    } catch (error) {
        console.error('Error adding template item:', error);
        res.status(500).json({ error: 'Failed to add item' });
    }
});

// DELETE /api/templates/:id/items/:itemId - Remove item from template
router.delete('/:id/items/:itemId', (req: Request, res: Response) => {
    try {
        const { id, itemId } = req.params;

        const result = db.prepare('DELETE FROM meal_template_items WHERE id = ? AND template_id = ?').run(itemId, id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.json({ success: true, message: 'Item removed' });
    } catch (error) {
        console.error('Error removing template item:', error);
        res.status(500).json({ error: 'Failed to remove item' });
    }
});

export default router;
