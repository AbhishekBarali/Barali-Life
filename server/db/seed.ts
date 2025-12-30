// ============================================
// SEED DATABASE - Migrate existing food data
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

const dbPath = path.join(dataDir, 'diet.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Read and execute schema
const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf-8');
db.exec(schema);

console.log('📦 Database schema created');

// ============================================
// SEED FOODS DATA
// ============================================

// Food data from existing foods.ts (condensed version - key items)
const FOODS = [
    // BREAKFAST
    { id: 'EGGS_BOILED', emoji: '🥚', label: 'Boiled Eggs', qty: 2, unit: 'eggs', tags: ['protein', 'breakfast', 'quick'], protein: 12, carbs: 1, fat: 10, calories: 140 },
    { id: 'EGGS_OMELETTE', emoji: '🍳', label: 'Egg Omelette', qty: 2, unit: 'eggs', tags: ['protein', 'breakfast'], protein: 12, carbs: 2, fat: 14, calories: 180 },
    { id: 'EGGS_BHURJI', emoji: '🍳', label: 'Egg Bhurji', qty: 2, unit: 'eggs', tags: ['protein', 'breakfast'], protein: 12, carbs: 3, fat: 14, calories: 185 },
    { id: 'CHIURA', emoji: '🍚', label: 'Chiura', qty: 1, unit: 'cup', tags: ['carb', 'breakfast', 'quick'], protein: 4, carbs: 45, fat: 1, calories: 200 },
    { id: 'CHIURA_DAHI', emoji: '🥣', label: 'Chiura + Dahi', qty: 1, unit: 'bowl', tags: ['protein', 'breakfast', 'quick'], protein: 12, carbs: 50, fat: 6, calories: 300 },
    { id: 'PARATHA', emoji: '🫓', label: 'Plain Paratha', qty: 2, unit: 'pieces', tags: ['carb', 'breakfast'], protein: 6, carbs: 40, fat: 12, calories: 290 },
    { id: 'PARATHA_ALOO', emoji: '🥔', label: 'Aloo Paratha', qty: 2, unit: 'pieces', tags: ['carb', 'breakfast'], protein: 8, carbs: 50, fat: 14, calories: 350 },
    { id: 'BREAD_PEANUT_BUTTER', emoji: '🥜', label: 'Bread + Peanut Butter', qty: 2, unit: 'slices', tags: ['protein', 'breakfast', 'quick'], protein: 12, carbs: 35, fat: 16, calories: 330 },
    { id: 'MILK', emoji: '🥛', label: 'Milk', qty: 1, unit: 'glass', tags: ['protein', 'breakfast', 'drink'], protein: 8, carbs: 12, fat: 8, calories: 150 },
    { id: 'TEA_PLAIN', emoji: '🍵', label: 'Tea (No Sugar)', qty: 1, unit: 'cup', tags: ['drink', 'breakfast'], protein: 1, carbs: 2, fat: 1, calories: 20 },
    { id: 'OATS', emoji: '🥣', label: 'Oats', qty: 1, unit: 'bowl', tags: ['carb', 'breakfast', 'healthy'], protein: 6, carbs: 30, fat: 3, calories: 170 },
    { id: 'OATS_BANANA', emoji: '🍌', label: 'Oats + Banana', qty: 1, unit: 'bowl', tags: ['carb', 'breakfast', 'healthy'], protein: 8, carbs: 55, fat: 4, calories: 280 },
    { id: 'MUESLI', emoji: '🥣', label: 'Muesli + Dahi', qty: 1, unit: 'bowl', tags: ['protein', 'breakfast', 'healthy', 'quick'], protein: 12, carbs: 45, fat: 8, calories: 300 },

    // DAL BHAT VARIANTS
    { id: 'DAL_BHAT_TARKARI', emoji: '🍛', label: 'Dal Bhat + Tarkari (Veg)', qty: 1, unit: 'plate', tags: ['lunch', 'dinner', 'staple'], protein: 14, carbs: 75, fat: 8, calories: 430 },
    { id: 'DAL_BHAT_CHICKEN', emoji: '🍗', label: 'Dal Bhat + Chicken', qty: 1, unit: 'plate', tags: ['protein', 'lunch', 'dinner'], protein: 38, carbs: 75, fat: 15, calories: 590 },
    { id: 'DAL_BHAT_MUTTON', emoji: '🍖', label: 'Dal Bhat + Mutton', qty: 1, unit: 'plate', tags: ['protein', 'lunch', 'dinner'], protein: 35, carbs: 75, fat: 20, calories: 620 },
    { id: 'DAL_BHAT_FISH', emoji: '🐟', label: 'Dal Bhat + Fish', qty: 1, unit: 'plate', tags: ['protein', 'lunch', 'dinner'], protein: 32, carbs: 75, fat: 12, calories: 540 },
    { id: 'DAL_BHAT_EGG', emoji: '🥚', label: 'Dal Bhat + Egg Curry', qty: 1, unit: 'plate', tags: ['protein', 'lunch', 'dinner'], protein: 24, carbs: 75, fat: 14, calories: 520 },
    { id: 'DAL_BHAT_PANEER', emoji: '🧀', label: 'Dal Bhat + Paneer', qty: 1, unit: 'plate', tags: ['protein', 'lunch', 'dinner', 'veg'], protein: 28, carbs: 75, fat: 18, calories: 570 },
    { id: 'DAL_BHAT_SOYA', emoji: '🫘', label: 'Dal Bhat + Soya Curry', qty: 1, unit: 'plate', tags: ['protein', 'lunch', 'dinner', 'veg'], protein: 32, carbs: 80, fat: 10, calories: 540 },

    // Individual components
    { id: 'DAL', emoji: '🥘', label: 'Dal (Lentils)', qty: 1, unit: 'bowl', tags: ['protein', 'lunch', 'dinner'], protein: 9, carbs: 20, fat: 1, calories: 120 },
    { id: 'RICE', emoji: '🍚', label: 'Rice', qty: 1, unit: 'plate', tags: ['carb', 'staple'], protein: 4, carbs: 45, fat: 0, calories: 200 },
    { id: 'TARKARI', emoji: '🥬', label: 'Mixed Tarkari', qty: 1, unit: 'bowl', tags: ['veg', 'lunch', 'dinner'], protein: 3, carbs: 12, fat: 4, calories: 90 },
    { id: 'ROTI', emoji: '🫓', label: 'Roti', qty: 3, unit: 'pieces', tags: ['carb', 'dinner'], protein: 9, carbs: 45, fat: 3, calories: 240 },
    { id: 'ROTI_DAL', emoji: '🫓', label: 'Roti + Dal', qty: 1, unit: 'meal', tags: ['protein', 'dinner'], protein: 18, carbs: 65, fat: 5, calories: 380 },

    // PROTEINS - CHICKEN
    { id: 'CHICKEN_CURRY', emoji: '🍗', label: 'Chicken Curry', qty: 150, unit: 'g', tags: ['protein', 'lunch', 'dinner'], protein: 30, carbs: 5, fat: 12, calories: 250 },
    { id: 'CHICKEN_GRILLED', emoji: '🍖', label: 'Grilled Chicken', qty: 150, unit: 'g', tags: ['protein', 'healthy'], protein: 35, carbs: 0, fat: 8, calories: 210 },
    { id: 'CHICKEN_SEKUWA', emoji: '🍢', label: 'Chicken Sekuwa', qty: 150, unit: 'g', tags: ['protein'], protein: 32, carbs: 3, fat: 10, calories: 230 },

    // PROTEINS - OTHER MEATS
    { id: 'MUTTON_CURRY', emoji: '🍖', label: 'Mutton Curry', qty: 150, unit: 'g', tags: ['protein', 'lunch', 'dinner'], protein: 28, carbs: 5, fat: 20, calories: 310 },
    { id: 'BUFF_CURRY', emoji: '🥩', label: 'Buff Curry', qty: 150, unit: 'g', tags: ['protein', 'lunch', 'dinner'], protein: 30, carbs: 5, fat: 8, calories: 210 },
    { id: 'FISH_CURRY', emoji: '🐟', label: 'Fish Curry', qty: 150, unit: 'g', tags: ['protein', 'lunch', 'dinner'], protein: 25, carbs: 5, fat: 10, calories: 210 },
    { id: 'EGG_CURRY', emoji: '🥚', label: 'Egg Curry', qty: 2, unit: 'eggs', tags: ['protein', 'lunch', 'dinner'], protein: 14, carbs: 6, fat: 12, calories: 190 },

    // PROTEINS - VEGETARIAN
    { id: 'PANEER', emoji: '🧀', label: 'Paneer', qty: 100, unit: 'g', tags: ['protein', 'veg'], protein: 18, carbs: 4, fat: 20, calories: 260 },
    { id: 'PANEER_CURRY', emoji: '🧀', label: 'Paneer Curry', qty: 100, unit: 'g', tags: ['protein', 'veg', 'lunch', 'dinner'], protein: 18, carbs: 8, fat: 22, calories: 300 },
    { id: 'SOYA_CHUNKS', emoji: '🫘', label: 'Soya Chunks (dry)', qty: 50, unit: 'g', tags: ['protein', 'veg'], protein: 26, carbs: 15, fat: 1, calories: 170 },
    { id: 'SOYA_CURRY', emoji: '🫘', label: 'Soya Curry', qty: 1, unit: 'bowl', tags: ['protein', 'veg', 'lunch', 'dinner'], protein: 26, carbs: 20, fat: 8, calories: 250 },
    { id: 'DAHI', emoji: '🥛', label: 'Dahi (Curd)', qty: 1, unit: 'bowl', tags: ['protein', 'breakfast', 'healthy'], protein: 8, carbs: 8, fat: 5, calories: 100 },
    { id: 'CHANA_BOILED', emoji: '🫘', label: 'Boiled Chana', qty: 1, unit: 'bowl', tags: ['protein', 'snack', 'healthy'], protein: 12, carbs: 25, fat: 3, calories: 180 },
    { id: 'RAJMA', emoji: '🫘', label: 'Rajma (Kidney Beans)', qty: 1, unit: 'bowl', tags: ['protein', 'lunch', 'dinner', 'veg'], protein: 12, carbs: 35, fat: 3, calories: 215 },

    // SUPPLEMENTS
    { id: 'WHEY', emoji: '🥤', label: 'Whey Protein', qty: 1, unit: 'scoop', tags: ['protein', 'supplement'], protein: 24, carbs: 3, fat: 1, calories: 120 },

    // VEGETABLES
    { id: 'VEG_TARKARI', emoji: '🥬', label: 'Mixed Sabji', qty: 1, unit: 'bowl', tags: ['veg', 'lunch', 'dinner', 'healthy'], protein: 3, carbs: 10, fat: 5, calories: 80 },
    { id: 'ALOO_TARKARI', emoji: '🥔', label: 'Aloo Tarkari', qty: 1, unit: 'bowl', tags: ['veg', 'lunch', 'dinner'], protein: 3, carbs: 25, fat: 6, calories: 160 },
    { id: 'SAAG', emoji: '🥬', label: 'Saag (Greens)', qty: 1, unit: 'bowl', tags: ['veg', 'healthy'], protein: 4, carbs: 6, fat: 3, calories: 60 },
    { id: 'SALAD', emoji: '🥗', label: 'Fresh Salad', qty: 1, unit: 'bowl', tags: ['veg', 'healthy', 'quick'], protein: 2, carbs: 10, fat: 1, calories: 50 },

    // FRUITS
    { id: 'BANANA', emoji: '🍌', label: 'Banana', qty: 1, unit: 'medium', tags: ['fruit', 'snack', 'quick'], protein: 1, carbs: 27, fat: 0, calories: 105 },
    { id: 'APPLE', emoji: '🍎', label: 'Apple', qty: 1, unit: 'medium', tags: ['fruit', 'snack', 'healthy'], protein: 0, carbs: 25, fat: 0, calories: 95 },
    { id: 'ORANGE', emoji: '🍊', label: 'Orange', qty: 1, unit: 'medium', tags: ['fruit', 'snack', 'healthy'], protein: 1, carbs: 15, fat: 0, calories: 60 },
    { id: 'MANGO', emoji: '🥭', label: 'Mango', qty: 1, unit: 'medium', tags: ['fruit', 'snack'], protein: 1, carbs: 35, fat: 0, calories: 135 },

    // NUTS & SEEDS
    { id: 'PEANUTS', emoji: '🥜', label: 'Peanuts', qty: 30, unit: 'g', tags: ['protein', 'snack'], protein: 8, carbs: 5, fat: 14, calories: 170 },
    { id: 'ALMONDS', emoji: '🌰', label: 'Almonds', qty: 30, unit: 'g', tags: ['protein', 'snack', 'healthy'], protein: 6, carbs: 6, fat: 14, calories: 170 },
    { id: 'CASHEWS', emoji: '🥜', label: 'Cashews', qty: 30, unit: 'g', tags: ['snack'], protein: 5, carbs: 9, fat: 12, calories: 160 },
    { id: 'PEANUT_BUTTER', emoji: '🥜', label: 'Peanut Butter', qty: 2, unit: 'tbsp', tags: ['protein', 'snack'], protein: 8, carbs: 6, fat: 16, calories: 190 },

    // SNACKS
    { id: 'SAMOSA', emoji: '🥟', label: 'Samosa', qty: 2, unit: 'pieces', tags: ['snack'], protein: 4, carbs: 30, fat: 15, calories: 270 },
    { id: 'MOMO_VEG', emoji: '🥟', label: 'Veg Momo', qty: 8, unit: 'pieces', tags: ['snack', 'veg'], protein: 8, carbs: 35, fat: 10, calories: 260 },
    { id: 'MOMO_CHICKEN', emoji: '🥟', label: 'Chicken Momo', qty: 8, unit: 'pieces', tags: ['protein', 'snack'], protein: 18, carbs: 30, fat: 12, calories: 300 },
    { id: 'MOMO_BUFF', emoji: '🥟', label: 'Buff Momo', qty: 8, unit: 'pieces', tags: ['protein', 'snack'], protein: 16, carbs: 30, fat: 10, calories: 270 },
    { id: 'CHOWMEIN', emoji: '🍜', label: 'Chowmein', qty: 1, unit: 'plate', tags: ['snack'], protein: 10, carbs: 50, fat: 12, calories: 350 },

    // NEPALI SPECIALTIES
    { id: 'THAKALI_SET', emoji: '🍱', label: 'Thakali Set', qty: 1, unit: 'set', tags: ['protein', 'lunch', 'dinner'], protein: 25, carbs: 85, fat: 15, calories: 580 },
    { id: 'NEWARI_SET', emoji: '🍱', label: 'Newari Set', qty: 1, unit: 'set', tags: ['protein', 'lunch'], protein: 20, carbs: 60, fat: 18, calories: 480 },
    { id: 'KWATI', emoji: '🥘', label: 'Kwati (Mixed Beans)', qty: 1, unit: 'bowl', tags: ['protein', 'veg'], protein: 15, carbs: 35, fat: 5, calories: 240 },
    { id: 'CHATAMARI', emoji: '🫓', label: 'Chatamari', qty: 1, unit: 'piece', tags: ['snack'], protein: 12, carbs: 30, fat: 10, calories: 260 },
];

// Insert foods
const insertFood = db.prepare(`
    INSERT OR IGNORE INTO foods (id, label, emoji, qty, unit, grams, tags, protein, carbs, fat, calories, is_custom, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, datetime('now'), datetime('now'))
`);

let foodCount = 0;
for (const food of FOODS) {
    insertFood.run(
        food.id,
        food.label,
        food.emoji,
        food.qty,
        food.unit,
        food.unit === 'g' ? food.qty : null,
        JSON.stringify(food.tags),
        food.protein,
        food.carbs,
        food.fat,
        food.calories
    );
    foodCount++;
}

console.log(`✅ Seeded ${foodCount} foods`);

// ============================================
// SEED FOOD ALTERNATIVES
// ============================================

const ALTERNATIVES = [
    // Protein swaps
    { food_id: 'CHICKEN_CURRY', alternative_food_id: 'CHICKEN_GRILLED', priority: 2 },
    { food_id: 'CHICKEN_CURRY', alternative_food_id: 'CHICKEN_SEKUWA', priority: 1 },
    { food_id: 'CHICKEN_CURRY', alternative_food_id: 'MUTTON_CURRY', priority: 1 },
    { food_id: 'CHICKEN_CURRY', alternative_food_id: 'FISH_CURRY', priority: 1 },
    { food_id: 'CHICKEN_CURRY', alternative_food_id: 'PANEER_CURRY', priority: 0 },
    { food_id: 'CHICKEN_CURRY', alternative_food_id: 'SOYA_CURRY', priority: 0 },

    { food_id: 'PANEER_CURRY', alternative_food_id: 'SOYA_CURRY', priority: 2 },
    { food_id: 'PANEER_CURRY', alternative_food_id: 'RAJMA', priority: 1 },
    { food_id: 'PANEER_CURRY', alternative_food_id: 'EGG_CURRY', priority: 1 },

    { food_id: 'EGGS_BOILED', alternative_food_id: 'EGGS_OMELETTE', priority: 2 },
    { food_id: 'EGGS_BOILED', alternative_food_id: 'EGGS_BHURJI', priority: 1 },

    // Dal Bhat swaps
    { food_id: 'DAL_BHAT_CHICKEN', alternative_food_id: 'DAL_BHAT_MUTTON', priority: 2 },
    { food_id: 'DAL_BHAT_CHICKEN', alternative_food_id: 'DAL_BHAT_FISH', priority: 1 },
    { food_id: 'DAL_BHAT_CHICKEN', alternative_food_id: 'DAL_BHAT_PANEER', priority: 0 },

    // Breakfast swaps
    { food_id: 'OATS', alternative_food_id: 'OATS_BANANA', priority: 2 },
    { food_id: 'OATS', alternative_food_id: 'MUESLI', priority: 1 },
    { food_id: 'CHIURA_DAHI', alternative_food_id: 'MUESLI', priority: 1 },

    // Snack swaps
    { food_id: 'PEANUTS', alternative_food_id: 'ALMONDS', priority: 2 },
    { food_id: 'PEANUTS', alternative_food_id: 'CASHEWS', priority: 1 },
];

const insertAlternative = db.prepare(`
    INSERT OR IGNORE INTO food_alternatives (food_id, alternative_food_id, priority)
    VALUES (?, ?, ?)
`);

let altCount = 0;
for (const alt of ALTERNATIVES) {
    try {
        insertAlternative.run(alt.food_id, alt.alternative_food_id, alt.priority);
        altCount++;
    } catch (e) {
        // Ignore duplicates
    }
}

console.log(`✅ Seeded ${altCount} food alternatives`);

// ============================================
// INITIALIZE DEFAULT SETTINGS
// ============================================

db.prepare('INSERT OR IGNORE INTO user_settings (id) VALUES (1)').run();
console.log('✅ Default settings initialized');

console.log('\n🎉 Database seeded successfully!');
console.log(`   📁 Database: ${dbPath}`);

db.close();
