// ============================================
// DAILY LOGS API ROUTES - Food logging
// ============================================

import { Router, Request, Response } from 'express';
import db, { now } from '../db/database';

const router = Router();

// GET /api/logs/:date - Get logs for a specific date
router.get('/:date', (req: Request, res: Response) => {
    try {
        const { date } = req.params;

        // Get food logs with food/recipe details
        const logs = db.prepare(`
            SELECT 
                dl.*,
                f.label as food_label, f.emoji as food_emoji, f.protein as food_protein, f.carbs as food_carbs, f.fat as food_fat, f.calories as food_calories, f.image_url as food_image,
                r.name as recipe_name, r.total_protein as recipe_protein, r.total_carbs as recipe_carbs, r.total_fat as recipe_fat, r.total_calories as recipe_calories, r.image_url as recipe_image
            FROM daily_logs dl
            LEFT JOIN foods f ON dl.food_id = f.id
            LEFT JOIN recipes r ON dl.recipe_id = r.id
            WHERE dl.date = ?
            ORDER BY dl.created_at
        `).all(date) as any[];

        // Get gym log for the day
        const gymLog = db.prepare('SELECT * FROM gym_logs WHERE date = ?').get(date) as any;

        // Calculate totals
        let totalProtein = 0, totalCarbs = 0, totalFat = 0, totalCalories = 0;

        const formattedLogs = logs.map(log => {
            let protein = 0, carbs = 0, fat = 0, calories = 0;

            if (log.is_custom) {
                protein = log.custom_protein || 0;
                carbs = log.custom_carbs || 0;
                fat = log.custom_fat || 0;
                calories = log.custom_calories || 0;
            } else if (log.food_id) {
                protein = (log.food_protein || 0) * log.qty;
                carbs = (log.food_carbs || 0) * log.qty;
                fat = (log.food_fat || 0) * log.qty;
                calories = (log.food_calories || 0) * log.qty;
            } else if (log.recipe_id) {
                protein = (log.recipe_protein || 0) * log.qty;
                carbs = (log.recipe_carbs || 0) * log.qty;
                fat = (log.recipe_fat || 0) * log.qty;
                calories = (log.recipe_calories || 0) * log.qty;
            }

            totalProtein += protein;
            totalCarbs += carbs;
            totalFat += fat;
            totalCalories += calories;

            return {
                id: log.id,
                date: log.date,
                slot: log.slot,
                qty: log.qty,
                is_custom: Boolean(log.is_custom),
                food: log.food_id ? {
                    id: log.food_id,
                    label: log.food_label,
                    emoji: log.food_emoji,
                    protein: log.food_protein,
                    carbs: log.food_carbs,
                    fat: log.food_fat,
                    calories: log.food_calories,
                    image_url: log.food_image,
                } : null,
                recipe: log.recipe_id ? {
                    id: log.recipe_id,
                    name: log.recipe_name,
                    protein: log.recipe_protein,
                    carbs: log.recipe_carbs,
                    fat: log.recipe_fat,
                    calories: log.recipe_calories,
                    image_url: log.recipe_image,
                } : null,
                custom: log.is_custom ? {
                    name: log.custom_name,
                    protein: log.custom_protein,
                    carbs: log.custom_carbs,
                    fat: log.custom_fat,
                    calories: log.custom_calories,
                } : null,
                macros: { protein, carbs, fat, calories },
            };
        });

        res.json({
            date,
            logs: formattedLogs,
            totals: {
                protein: totalProtein,
                carbs: totalCarbs,
                fat: totalFat,
                calories: totalCalories,
            },
            gym: gymLog ? {
                workout_type: gymLog.workout_type,
                completed: Boolean(gymLog.completed),
                skipped: Boolean(gymLog.skipped),
                notes: gymLog.notes,
            } : null,
        });
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ error: 'Failed to fetch logs' });
    }
});

// POST /api/logs - Log food/recipe
router.post('/', (req: Request, res: Response) => {
    try {
        const {
            date,
            slot,
            food_id,
            recipe_id,
            qty = 1,
            // For custom foods
            is_custom = false,
            custom_name,
            custom_protein,
            custom_carbs,
            custom_fat,
            custom_calories,
        } = req.body;

        if (!date || !slot) {
            return res.status(400).json({ error: 'Date and slot are required' });
        }

        if (!food_id && !recipe_id && !is_custom) {
            return res.status(400).json({ error: 'Either food_id, recipe_id, or custom food data is required' });
        }

        const result = db.prepare(`
            INSERT INTO daily_logs (date, slot, food_id, recipe_id, qty, is_custom, custom_name, custom_protein, custom_carbs, custom_fat, custom_calories, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            date, slot,
            food_id || null, recipe_id || null, qty,
            is_custom ? 1 : 0,
            custom_name || null, custom_protein || null, custom_carbs || null, custom_fat || null, custom_calories || null,
            now()
        );

        res.status(201).json({
            id: result.lastInsertRowid,
            date,
            slot,
            food_id,
            recipe_id,
            qty,
            is_custom,
        });
    } catch (error) {
        console.error('Error logging food:', error);
        res.status(500).json({ error: 'Failed to log food' });
    }
});

// DELETE /api/logs/:id - Remove log entry
router.delete('/:id', (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const result = db.prepare('DELETE FROM daily_logs WHERE id = ?').run(id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Log entry not found' });
        }

        res.json({ success: true, message: 'Log entry removed' });
    } catch (error) {
        console.error('Error deleting log:', error);
        res.status(500).json({ error: 'Failed to delete log' });
    }
});

// POST /api/logs/gym - Log gym activity
router.post('/gym', (req: Request, res: Response) => {
    try {
        const { date, workout_type, completed = false, skipped = false, notes } = req.body;

        if (!date) {
            return res.status(400).json({ error: 'Date is required' });
        }

        // Upsert gym log
        db.prepare(`
            INSERT INTO gym_logs (date, workout_type, completed, skipped, notes, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
            ON CONFLICT(date) DO UPDATE SET
                workout_type = excluded.workout_type,
                completed = excluded.completed,
                skipped = excluded.skipped,
                notes = excluded.notes
        `).run(date, workout_type || null, completed ? 1 : 0, skipped ? 1 : 0, notes || null, now());

        // Update streak in settings
        if (completed) {
            db.prepare('UPDATE user_settings SET gym_streak = gym_streak + 1 WHERE id = 1').run();
        } else if (skipped) {
            db.prepare('UPDATE user_settings SET gym_streak = 0 WHERE id = 1').run();
        }

        res.json({ success: true, date, workout_type, completed, skipped });
    } catch (error) {
        console.error('Error logging gym:', error);
        res.status(500).json({ error: 'Failed to log gym' });
    }
});

export default router;
