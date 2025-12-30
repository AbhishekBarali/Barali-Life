// ============================================
// RECIPES API ROUTES - Full CRUD for recipes
// ============================================

import { Router, Request, Response } from 'express';
import db, { generateId, now, parseJsonField, stringifyJsonField } from '../db/database';

const router = Router();

// GET /api/recipes - List all recipes
router.get('/', (req: Request, res: Response) => {
    try {
        const { search, tag } = req.query;

        let query = 'SELECT * FROM recipes WHERE 1=1';
        const params: any[] = [];

        if (search) {
            query += ' AND (name LIKE ? OR description LIKE ?)';
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm);
        }

        if (tag) {
            query += ' AND tags LIKE ?';
            params.push(`%"${tag}"%`);
        }

        query += ' ORDER BY name ASC';

        const recipes = db.prepare(query).all(...params) as any[];

        const result = recipes.map(r => ({
            ...r,
            tags: parseJsonField(r.tags, []),
            instructions: parseJsonField(r.instructions, []),
        }));

        res.json(result);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ error: 'Failed to fetch recipes' });
    }
});

// GET /api/recipes/:id - Get recipe with ingredients
router.get('/:id', (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const recipe = db.prepare('SELECT * FROM recipes WHERE id = ?').get(id) as any;
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        // Get ingredients with food details
        const ingredients = db.prepare(`
            SELECT ri.*, f.label, f.emoji, f.protein, f.carbs, f.fat, f.calories, f.unit as food_unit
            FROM recipe_ingredients ri
            JOIN foods f ON ri.food_id = f.id
            WHERE ri.recipe_id = ?
        `).all(id) as any[];

        res.json({
            ...recipe,
            tags: parseJsonField(recipe.tags, []),
            instructions: parseJsonField(recipe.instructions, []),
            ingredients: ingredients.map(ing => ({
                id: ing.id,
                food_id: ing.food_id,
                qty: ing.qty,
                unit: ing.unit || ing.food_unit,
                food: {
                    label: ing.label,
                    emoji: ing.emoji,
                    protein: ing.protein,
                    carbs: ing.carbs,
                    fat: ing.fat,
                    calories: ing.calories,
                },
            })),
        });
    } catch (error) {
        console.error('Error fetching recipe:', error);
        res.status(500).json({ error: 'Failed to fetch recipe' });
    }
});

// POST /api/recipes - Create recipe
router.post('/', (req: Request, res: Response) => {
    try {
        const {
            name,
            description,
            image_url,
            prep_time,
            cook_time,
            servings = 1,
            instructions = [],
            tags = [],
            ingredients = [], // [{ food_id, qty, unit }]
        } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }

        const id = generateId();
        const timestamp = now();

        // Calculate total macros from ingredients
        let totalProtein = 0, totalCarbs = 0, totalFat = 0, totalCalories = 0;

        for (const ing of ingredients) {
            const food = db.prepare('SELECT protein, carbs, fat, calories FROM foods WHERE id = ?').get(ing.food_id) as any;
            if (food) {
                const multiplier = ing.qty || 1;
                totalProtein += food.protein * multiplier;
                totalCarbs += food.carbs * multiplier;
                totalFat += food.fat * multiplier;
                totalCalories += food.calories * multiplier;
            }
        }

        // Insert recipe
        db.prepare(`
            INSERT INTO recipes (id, name, description, image_url, prep_time, cook_time, servings, instructions, tags, total_protein, total_carbs, total_fat, total_calories, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            id, name, description || null, image_url || null, prep_time || null, cook_time || null,
            servings, stringifyJsonField(instructions), stringifyJsonField(tags),
            totalProtein, totalCarbs, totalFat, totalCalories, timestamp, timestamp
        );

        // Insert ingredients
        const insertIngredient = db.prepare(`
            INSERT INTO recipe_ingredients (recipe_id, food_id, qty, unit)
            VALUES (?, ?, ?, ?)
        `);

        for (const ing of ingredients) {
            insertIngredient.run(id, ing.food_id, ing.qty || 1, ing.unit || null);
        }

        res.status(201).json({
            id,
            name,
            description,
            image_url,
            prep_time,
            cook_time,
            servings,
            instructions,
            tags,
            total_protein: totalProtein,
            total_carbs: totalCarbs,
            total_fat: totalFat,
            total_calories: totalCalories,
            ingredients,
        });
    } catch (error) {
        console.error('Error creating recipe:', error);
        res.status(500).json({ error: 'Failed to create recipe' });
    }
});

// PUT /api/recipes/:id - Update recipe
router.put('/:id', (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const {
            name,
            description,
            image_url,
            prep_time,
            cook_time,
            servings,
            instructions,
            tags,
            ingredients, // If provided, replace all ingredients
        } = req.body;

        const existing = db.prepare('SELECT * FROM recipes WHERE id = ?').get(id);
        if (!existing) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        // Update recipe
        db.prepare(`
            UPDATE recipes SET
                name = COALESCE(?, name),
                description = COALESCE(?, description),
                image_url = COALESCE(?, image_url),
                prep_time = COALESCE(?, prep_time),
                cook_time = COALESCE(?, cook_time),
                servings = COALESCE(?, servings),
                instructions = COALESCE(?, instructions),
                tags = COALESCE(?, tags),
                updated_at = ?
            WHERE id = ?
        `).run(
            name, description, image_url, prep_time, cook_time, servings,
            instructions ? stringifyJsonField(instructions) : null,
            tags ? stringifyJsonField(tags) : null,
            now(), id
        );

        // If ingredients provided, replace all
        if (ingredients) {
            db.prepare('DELETE FROM recipe_ingredients WHERE recipe_id = ?').run(id);

            let totalProtein = 0, totalCarbs = 0, totalFat = 0, totalCalories = 0;
            const insertIngredient = db.prepare(`
                INSERT INTO recipe_ingredients (recipe_id, food_id, qty, unit)
                VALUES (?, ?, ?, ?)
            `);

            for (const ing of ingredients) {
                insertIngredient.run(id, ing.food_id, ing.qty || 1, ing.unit || null);

                const food = db.prepare('SELECT protein, carbs, fat, calories FROM foods WHERE id = ?').get(ing.food_id) as any;
                if (food) {
                    const multiplier = ing.qty || 1;
                    totalProtein += food.protein * multiplier;
                    totalCarbs += food.carbs * multiplier;
                    totalFat += food.fat * multiplier;
                    totalCalories += food.calories * multiplier;
                }
            }

            // Update totals
            db.prepare(`
                UPDATE recipes SET total_protein = ?, total_carbs = ?, total_fat = ?, total_calories = ?
                WHERE id = ?
            `).run(totalProtein, totalCarbs, totalFat, totalCalories, id);
        }

        // Return updated recipe
        const updated = db.prepare('SELECT * FROM recipes WHERE id = ?').get(id) as any;
        res.json({
            ...updated,
            tags: parseJsonField(updated.tags, []),
            instructions: parseJsonField(updated.instructions, []),
        });
    } catch (error) {
        console.error('Error updating recipe:', error);
        res.status(500).json({ error: 'Failed to update recipe' });
    }
});

// DELETE /api/recipes/:id - Delete recipe
router.delete('/:id', (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const result = db.prepare('DELETE FROM recipes WHERE id = ?').run(id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        res.json({ success: true, message: 'Recipe deleted' });
    } catch (error) {
        console.error('Error deleting recipe:', error);
        res.status(500).json({ error: 'Failed to delete recipe' });
    }
});

export default router;
