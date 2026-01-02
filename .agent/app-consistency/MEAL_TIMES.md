# Meal Times by Mode

## Standard Day / Burnt Out (7 AM wake)
| Order | Slot | Label | Time |
|-------|------|-------|------|
| 1 | BREAKFAST | Breakfast | 7:00 - 8:00 AM |
| 2 | LUNCH | Lunch | 11:00 - 12:00 PM |
| 3 | MORNING_SNACK | Pre-Workout | 1:00 - 1:30 PM |
| 4 | EVENING_SNACK | Post-Workout | 4:00 - 5:00 PM |
| 5 | DINNER | Dinner | 8:00 - 9:00 PM |

## College Rush / Burnt Out College (5:30 AM wake)
| Order | Slot | Label | Time | Notes |
|-------|------|-------|------|-------|
| 1 | BREAKFAST | Quick Breakfast | 5:30 - 6:00 AM | Quick at home |
| 2 | MORNING_SNACK | **Tiffin** | 9:05 - 9:30 AM | 🍱 Packed from home |
| 3 | LUNCH | Lunch (Home) | 12:00 - 12:30 PM | Return home, eat |
| 4 | EVENING_SNACK | Post-Workout | 4:00 - 5:00 PM | After 2PM Gym |
| 5 | DINNER | Dinner | 7:30 - 8:30 PM | |

## Logic Updates
- **Dynamic Ordering**: `MODE_MEAL_ORDER[mode]` ensures College mode displays `MORNING_SNACK` (Tiffin) *before* `LUNCH`.
- **Labels**: "Dal Bhat" explicitly added to food labels (e.g. "Dal Bhat + Chicken") to clarify full meal.

- **Tiffin**: 9:05 AM slot is explicitly Tiffin.
- **Lunch**: 12:00 PM slot is explicitly "Lunch (Home)" for college modes.
