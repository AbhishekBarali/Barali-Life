# Food Swap Rules

## Golden Rule
**Swaps must be REALISTIC substitutes** - foods you would actually replace with each other in a meal.

## Swap Categories

### Curries (can swap with other curries)
- Paneer Curry ↔ Soya Curry ↔ Egg Curry ↔ Chicken Curry
- Never swap curry with dry snacks

### Main Courses (can swap with similar)
- Dal Bhat ↔ Roti Dal ↔ Khichdi
- Rice-based ↔ Roti-based

### Eggs (can swap with other egg preparations)
- Boiled Eggs ↔ Omelette ↔ Bhurji ↔ Egg Curry

### Dry Protein Snacks (can swap with similar)
- Peanuts ↔ Almonds ↔ Mixed Nuts ↔ Chana Boiled
- Never swap with curries

### Dairy
- Milk ↔ Dahi ↔ Paneer (as standalone)

## Implementation

Foods have a `swapGroup` tag in their definition:
- `'curry'` - All curry preparations
- `'eggs'` - All egg preparations  
- `'dry-protein'` - Nuts, boiled legumes
- `'main-course'` - Dal bhat, roti dal, khichdi
- `'dairy'` - Milk, dahi, paneer

## What NOT to do

❌ Paneer Curry → Soya Chunks (dry) - Unrealistic
❌ Dal Bhat → Eggs Boiled - Different meal type
❌ Chicken Curry → Peanuts - Makes no sense

## What TO do

✅ Paneer Curry → Egg Curry (both curries)
✅ Dal Bhat → Roti Dal (both main courses)
✅ Peanuts → Almonds (both dry snacks)
