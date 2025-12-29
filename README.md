# Barali Life 🏔️

A **Life Operating System dashboard** for a 20-year-old CS student in Nepal. Dark, vibey "control panel" for diet, gym, study, and anti-failure guardrails.

![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-teal)

## Features

### 🍽️ Dynamic Diet Engine
- **Mode-based meal plans** - Standard Day, Roti Night, College Rush, Simplicity, Social Mode, Burnt Out
- **Cheat compensation** - Log junk food → automatic damage control for dinner
- **Ingredient swapper** - Swap foods with smart protein equivalences
- **Nepal-specific foods** - Dal Bhat, Soya Chunks, Chiura, Kala Chana, etc.

### 💪 Gym Tracker
- **4-Day A/B Split** - Mon/Thu: Pull+Deadlift, Tue/Fri: Push+Squats
- **XP system** - Earn 100 XP per workout
- **Streak tracking** - Keep your gym streak alive

### 🧠 Skill Acquisition
- **Deep work timer** - Pomodoro-style focus sessions
- **Session labels** - DSA, Web Dev, Math, Projects, Exam Prep
- **XP per minute** - 2 XP earned per minute of focused work

### 🛡️ Anti-Failure System
- **Blacklist warnings** - "This requires 100 Burpees. Are you sure?"
- **Damage control** - Auto-generates clean meals after junk food
- **Emergency hunger** - Quick options when stuck in traffic

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Navigate to project directory
cd Diet

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## How Data is Stored

All data is stored in **LocalStorage** under the key `baraliLife:v1`. This includes:
- Profile (height, weight, goal)
- Daily targets (protein, calories, water)
- Inventory (available foods at home)
- Blacklist (foods that trigger warnings)
- Daily logs (meals, gym, skill sessions)
- Streaks and XP

### Export/Import

1. Go to **Settings** → **Data Management**
2. Click **Export Data** to copy your data to clipboard
3. Save the JSON somewhere safe
4. To restore, paste the JSON in the import field

### Reset Data

1. Go to **Settings** → Click **Reset Today's Log** to clear today
2. To completely reset, open DevTools → Application → Local Storage → Delete `baraliLife:v1`

## Customization

### Change Inventory
Settings → Inventory → Toggle foods you have at home

### Edit Blacklist
Settings → Blacklist → Toggle foods that should trigger warnings

### Adjust Targets
Settings → Daily Targets → Edit protein/calories/water goals

### Change Mode
Dashboard or Diet page → Mode Switcher dropdown

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Zustand** - State management with persistence
- **React Router** - Navigation

## File Structure

```
src/
├── app/           # App entry and routes
├── diet/          # Diet engine logic
│   ├── foods.ts   # Food database
│   ├── templates.ts # Meal templates by mode
│   ├── swapper.ts  # Ingredient swap logic
│   ├── blacklist.ts # Junk food warnings
│   └── recipes.ts  # Quick recipes
├── pages/         # Page components
├── state/         # Zustand store + reducer
├── types/         # TypeScript definitions
├── ui/            # Reusable components
└── utils/         # Utility functions
```

## License

Built for personal use. Feel free to fork and customize for your own life operating system! 🚀

---

<p align="center">
  <b>Barali Life</b> - Built with 💪 in Nepal
</p>
