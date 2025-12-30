// ============================================
// SETTINGS API ROUTES - User preferences
// ============================================

import { Router, Request, Response } from 'express';
import db, { now } from '../db/database';

const router = Router();

// GET /api/settings - Get user settings
router.get('/', (req: Request, res: Response) => {
    try {
        const settings = db.prepare('SELECT * FROM user_settings WHERE id = 1').get() as any;

        if (!settings) {
            // Create default settings if not exists
            db.prepare('INSERT OR IGNORE INTO user_settings (id) VALUES (1)').run();
            return res.json({
                mode: 'STANDARD_DAY',
                weight_mode: 'MAINTAIN',
                workout_schedule: 'FOUR_DAY_PUSH_PULL',
                weight_kg: 74,
                height_cm: 175,
                age: 20,
                gender: 'male',
                goal: 'build_muscle',
                protein_target: 140,
                carbs_target: 350,
                fat_target: 70,
                calories_target: 2700,
                water_liters: 2.5,
                gym_streak: 0,
                protein_streak: 0,
            });
        }

        res.json(settings);
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
});

// PUT /api/settings - Update settings
router.put('/', (req: Request, res: Response) => {
    try {
        const {
            mode,
            weight_mode,
            workout_schedule,
            weight_kg,
            height_cm,
            age,
            gender,
            goal,
            protein_target,
            carbs_target,
            fat_target,
            calories_target,
            water_liters,
        } = req.body;

        db.prepare(`
            UPDATE user_settings SET
                mode = COALESCE(?, mode),
                weight_mode = COALESCE(?, weight_mode),
                workout_schedule = COALESCE(?, workout_schedule),
                weight_kg = COALESCE(?, weight_kg),
                height_cm = COALESCE(?, height_cm),
                age = COALESCE(?, age),
                gender = COALESCE(?, gender),
                goal = COALESCE(?, goal),
                protein_target = COALESCE(?, protein_target),
                carbs_target = COALESCE(?, carbs_target),
                fat_target = COALESCE(?, fat_target),
                calories_target = COALESCE(?, calories_target),
                water_liters = COALESCE(?, water_liters),
                updated_at = ?
            WHERE id = 1
        `).run(
            mode, weight_mode, workout_schedule,
            weight_kg, height_cm, age, gender, goal,
            protein_target, carbs_target, fat_target, calories_target, water_liters,
            now()
        );

        const updated = db.prepare('SELECT * FROM user_settings WHERE id = 1').get();
        res.json(updated);
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ error: 'Failed to update settings' });
    }
});

// GET /api/settings/blacklist - Get blacklisted foods
router.get('/blacklist', (req: Request, res: Response) => {
    try {
        const blacklist = db.prepare(`
            SELECT b.*, f.label, f.emoji
            FROM blacklist b
            JOIN foods f ON b.food_id = f.id
            ORDER BY b.created_at DESC
        `).all() as any[];

        res.json(blacklist);
    } catch (error) {
        console.error('Error fetching blacklist:', error);
        res.status(500).json({ error: 'Failed to fetch blacklist' });
    }
});

// POST /api/settings/blacklist - Add food to blacklist
router.post('/blacklist', (req: Request, res: Response) => {
    try {
        const { food_id, reason } = req.body;

        if (!food_id) {
            return res.status(400).json({ error: 'food_id is required' });
        }

        db.prepare(`
            INSERT OR IGNORE INTO blacklist (food_id, reason, created_at)
            VALUES (?, ?, ?)
        `).run(food_id, reason || null, now());

        res.status(201).json({ success: true, food_id, reason });
    } catch (error) {
        console.error('Error adding to blacklist:', error);
        res.status(500).json({ error: 'Failed to add to blacklist' });
    }
});

// DELETE /api/settings/blacklist/:foodId - Remove from blacklist
router.delete('/blacklist/:foodId', (req: Request, res: Response) => {
    try {
        const { foodId } = req.params;

        const result = db.prepare('DELETE FROM blacklist WHERE food_id = ?').run(foodId);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Food not in blacklist' });
        }

        res.json({ success: true, message: 'Removed from blacklist' });
    } catch (error) {
        console.error('Error removing from blacklist:', error);
        res.status(500).json({ error: 'Failed to remove from blacklist' });
    }
});

export default router;
