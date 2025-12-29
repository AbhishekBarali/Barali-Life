# App Modes

## Overview
Barali Life has 4 modes to match different daily schedules.

## Modes

### STANDARD_DAY (Default)
- **Wake time**: 7:00 AM
- **Target user**: Non-college days, weekends, holidays
- **Schedule**: Breakfast 7AM → Lunch 11AM → Pre-workout 1PM → Post-workout 4PM → Dinner 8PM

### COLLEGE_RUSH
- **Wake time**: 5:30 AM
- **Target user**: College days with early classes
- **Schedule**: Breakfast 5:30AM → Lunch 10AM → Pre-workout 1PM → Post-workout 4PM → Dinner 7:30PM

### BURNT_OUT
- **Wake time**: 7:00 AM
- **Target user**: Low energy days, minimal cooking
- **Key feature**: Easy-to-prepare foods only (muesli, eggs, dahi)

### BURNT_OUT_COLLEGE
- **Wake time**: 5:30 AM  
- **Target user**: Low energy college days
- **Key feature**: Same as BURNT_OUT but with 5:30 AM schedule

## Important Rules for Developers

1. **Never add modes without updating**:
   - `src/types/index.ts` (Mode type, labels, descriptions)
   - `src/diet/templates.ts` (meal templates)
   - `src/ui/components/ModeSwitcher.tsx` (icon, mode list)

2. **Timing consistency**:
   - College modes: 5:30 AM start
   - Normal modes: 7:00 AM start

3. **When to add a new mode**:
   - Only if it has a FUNDAMENTALLY different schedule
   - NOT for food variations (use swaps instead)
