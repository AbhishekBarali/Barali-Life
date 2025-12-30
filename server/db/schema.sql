-- Diet App Database Schema
-- SQLite with better-sqlite3

-- Foods table (core entity)
CREATE TABLE IF NOT EXISTS foods (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  emoji TEXT DEFAULT '🍽️',
  qty REAL NOT NULL DEFAULT 1,
  unit TEXT NOT NULL DEFAULT 'serving',
  grams REAL,
  tags TEXT DEFAULT '[]', -- JSON array
  protein REAL NOT NULL DEFAULT 0,
  carbs REAL NOT NULL DEFAULT 0,
  fat REAL NOT NULL DEFAULT 0,
  calories REAL NOT NULL DEFAULT 0,
  image_url TEXT, -- Cloudinary URL
  is_custom INTEGER DEFAULT 1, -- 0 = built-in, 1 = user-created
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT, -- Cloudinary URL
  prep_time INTEGER, -- minutes
  cook_time INTEGER, -- minutes
  servings INTEGER DEFAULT 1,
  instructions TEXT DEFAULT '[]', -- JSON array of steps
  tags TEXT DEFAULT '[]', -- JSON array
  total_protein REAL DEFAULT 0,
  total_carbs REAL DEFAULT 0,
  total_fat REAL DEFAULT 0,
  total_calories REAL DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Recipe ingredients (junction table)
CREATE TABLE IF NOT EXISTS recipe_ingredients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  recipe_id TEXT NOT NULL,
  food_id TEXT NOT NULL,
  qty REAL NOT NULL DEFAULT 1,
  unit TEXT,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
  FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE
);

-- Meal templates (diet plans)
CREATE TABLE IF NOT EXISTS meal_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  mode TEXT NOT NULL, -- STANDARD_DAY, COLLEGE_RUSH, BURNT_OUT, BURNT_OUT_COLLEGE, SUNDAY_SPECIAL
  day_type TEXT NOT NULL DEFAULT 'training', -- training, rest
  slot TEXT NOT NULL, -- BREAKFAST, MORNING_SNACK, LUNCH, EVENING_SNACK, DINNER
  intention TEXT DEFAULT 'BALANCED', -- PROTEIN_FOCUS, BALANCED, LIGHT, DAMAGE_CONTROL
  note TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Meal template items
CREATE TABLE IF NOT EXISTS meal_template_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  template_id TEXT NOT NULL,
  food_id TEXT,
  recipe_id TEXT,
  qty REAL DEFAULT 1,
  is_swappable INTEGER DEFAULT 0, -- Can this item be swapped?
  sort_order INTEGER DEFAULT 0,
  FOREIGN KEY (template_id) REFERENCES meal_templates(id) ON DELETE CASCADE,
  FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE SET NULL,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE SET NULL
);

-- Food alternatives (for swapping)
CREATE TABLE IF NOT EXISTS food_alternatives (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  food_id TEXT NOT NULL,
  alternative_food_id TEXT NOT NULL,
  priority INTEGER DEFAULT 0, -- higher = better match
  FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE,
  FOREIGN KEY (alternative_food_id) REFERENCES foods(id) ON DELETE CASCADE,
  UNIQUE(food_id, alternative_food_id)
);

-- Daily food logs
CREATE TABLE IF NOT EXISTS daily_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL, -- YYYY-MM-DD
  slot TEXT NOT NULL, -- BREAKFAST, LUNCH, etc.
  food_id TEXT,
  recipe_id TEXT,
  qty REAL DEFAULT 1,
  -- For custom/quick-add foods
  is_custom INTEGER DEFAULT 0,
  custom_name TEXT,
  custom_protein REAL,
  custom_carbs REAL,
  custom_fat REAL,
  custom_calories REAL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE SET NULL,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE SET NULL
);

-- Gym logs
CREATE TABLE IF NOT EXISTS gym_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL UNIQUE, -- YYYY-MM-DD
  workout_type TEXT, -- DAY_A_PULL, DAY_B_PUSH, FULL_BODY_A, FULL_BODY_B, REST
  completed INTEGER DEFAULT 0,
  skipped INTEGER DEFAULT 0,
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- User settings (single row)
CREATE TABLE IF NOT EXISTS user_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1), -- Ensure single row
  mode TEXT DEFAULT 'STANDARD_DAY',
  weight_mode TEXT DEFAULT 'MAINTAIN', -- CUT, MAINTAIN, LEAN_BULK
  workout_schedule TEXT DEFAULT 'FOUR_DAY_PUSH_PULL', -- FOUR_DAY_PUSH_PULL, THREE_DAY_LESS_TIME
  weight_kg REAL DEFAULT 74,
  height_cm REAL DEFAULT 175,
  age INTEGER DEFAULT 20,
  gender TEXT DEFAULT 'male',
  goal TEXT DEFAULT 'build_muscle',
  protein_target REAL DEFAULT 140,
  carbs_target REAL DEFAULT 350,
  fat_target REAL DEFAULT 70,
  calories_target REAL DEFAULT 2700,
  water_liters REAL DEFAULT 2.5,
  gym_streak INTEGER DEFAULT 0,
  protein_streak INTEGER DEFAULT 0,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Blacklist (foods to avoid)
CREATE TABLE IF NOT EXISTS blacklist (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  food_id TEXT NOT NULL UNIQUE,
  reason TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_foods_tags ON foods(tags);
CREATE INDEX IF NOT EXISTS idx_daily_logs_date ON daily_logs(date);
CREATE INDEX IF NOT EXISTS idx_daily_logs_slot ON daily_logs(slot);
CREATE INDEX IF NOT EXISTS idx_meal_templates_mode ON meal_templates(mode);
CREATE INDEX IF NOT EXISTS idx_meal_templates_slot ON meal_templates(slot);
CREATE INDEX IF NOT EXISTS idx_gym_logs_date ON gym_logs(date);

-- Insert default user settings
INSERT OR IGNORE INTO user_settings (id) VALUES (1);
