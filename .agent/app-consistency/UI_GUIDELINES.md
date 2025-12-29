# UI Consistency Guidelines

## Card Styling
- ALL cards must use the same background/border
- NO conditional gradients based on meal status
- Current meal indicator: subtle left border only (if any)
- Done meals: slight opacity reduction (0.7)

## Icons
- Use consistent slot icons for ALL states:
  - Breakfast: 🌅
  - Lunch: 🍽️
  - Pre-Workout: ☕
  - Post-Workout: 🍎
  - Dinner: 🌙
- NEVER use ✅ checkmarks as slot icons

## Colors
- Primary: `#34d399` (soft emerald)
- Text Primary: white
- Text Secondary: `text-zinc-400`
- Text Muted: `text-zinc-500`

## Typography
- Card headers: `font-semibold text-lg`
- Slot times: `text-xs text-zinc-500`
- Protein display: `text-primary`

## Spacing
- Card padding: `p-4`
- Card gap: `space-y-3` or `gap-3`
- Card border radius: `rounded-2xl`

## When Adding New Components
1. Check existing Card component for base styles
2. Use design tokens from `index.css`
3. Test on both Dashboard and Diet pages
4. Verify visual consistency across all meal states
