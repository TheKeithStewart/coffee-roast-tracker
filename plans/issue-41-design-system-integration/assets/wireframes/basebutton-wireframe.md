# BaseButton Component Wireframes

## Component States Matrix

### Primary Button States (All Themes)

#### Classic Coffee Theme
```
Default State:
┌─────────────────────────┐
│     Primary Action      │ ← Background: #c8794a, Text: #fafaf9
└─────────────────────────┘

Hover State:
┌─────────────────────────┐
│ ↗   Primary Action   ↗  │ ← Background: #b86c3e, Transform: translateY(-2px)
└─────────────────────────┘
     Shadow: shadow-md

Focus State:
┌═════════════════════════┐
║     Primary Action      ║ ← Ring: rgba(200, 121, 74, 0.5), Width: 4px
└═════════════════════════┘

Active State:
┌─────────────────────────┐
│     Primary Action      │ ← Background: #995536, Transform: translateY(0)
└─────────────────────────┘

Disabled State:
┌─────────────────────────┐
│ ░░░ Primary Action ░░░  │ ← Opacity: 0.5, Cursor: not-allowed
└─────────────────────────┘
```

#### High Contrast Theme  
```
Default State:
┌─────────────────────────┐
│     Primary Action      │ ← Background: #000000, Text: #ffffff, Border: #000000
└─────────────────────────┘

Focus State:
┌═════════════════════════┐
║     Primary Action      ║ ← Ring: rgba(0, 0, 0, 0.8), Width: 6px (enhanced)
└═════════════════════════┘
```

#### Cool Focus Theme
```
Default State:
┌─────────────────────────┐
│     Primary Action      │ ← Background: #0ea5e9, Text: #f8fafc
└─────────────────────────┘

Focus State:
┌═════════════════════════┐
║     Primary Action      ║ ← Ring: rgba(14, 165, 233, 0.5), Width: 4px
└═════════════════════════┘
```

#### Energizing Theme
```
Default State:
┌─────────────────────────┐
│     Primary Action      │ ← Background: #f97316, Text: #ffffff
└─────────────────────────┘

Focus State:
┌═════════════════════════┐
║     Primary Action      ║ ← Ring: rgba(249, 115, 22, 0.5), Width: 4px
└═════════════════════════┘
```

## Button Size Variations

### Small Button (Touch Target: 44px)
```
┌─────────────┐
│   Action    │ ← Height: 44px, Padding: 8px 16px, Font: 14px
└─────────────┘
```

### Standard Button (Touch Target: 60px - Preferred)
```
┌─────────────────────────┐
│       Action           │ ← Height: 60px, Padding: 12px 24px, Font: 16px
└─────────────────────────┘
```

### Large Button (Touch Target: 80px)
```
┌─────────────────────────────────┐
│           Action               │ ← Height: 80px, Padding: 16px 32px, Font: 18px
└─────────────────────────────────┘
```

### Emergency Button (Touch Target: 100px)
```
┌─────────────────────────────────────────┐
│              STOP ROAST                │ ← Height: 100px, Font: 18px, Weight: bold
└─────────────────────────────────────────┘
                     ↑
                Enhanced shadow, uppercase text
```

## Button Variants

### Secondary Button
```
All Themes - Default State:
┌─────────────────────────┐
│     Secondary Action    │ ← Background: surface, Border: border-secondary
└─────────────────────────┘

Hover State:
┌─────────────────────────┐
│ ↗  Secondary Action  ↗  │ ← Background: surface-secondary, Border: primary-500
└─────────────────────────┘
```

### Ghost Button
```
All Themes - Default State:
┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
  Ghost Action             ← Background: transparent, Text: text-secondary
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘

Hover State:
┌─────────────────────────┐
│      Ghost Action       │ ← Background: surface-secondary, Text: text-primary
└─────────────────────────┘
```

### Icon-Only Button
```
Standard (60px × 60px):
┌────────┐
│   🎨   │ ← Square format, centered icon
└────────┘

Small (44px × 44px):
┌─────┐
│ 🎨  │
└─────┘
```

## Interactive States Flow

### Button Press Animation Sequence
```
Frame 1 (Default):
┌─────────────────────────┐
│        Button           │ ← Y-position: 0
└─────────────────────────┘

Frame 2 (Hover - 150ms):
┌─────────────────────────┐
│ ↗     Button      ↗    │ ← Y-position: -2px, shadow appears
└─────────────────────────┘

Frame 3 (Active - 100ms):
┌─────────────────────────┐
│        Button           │ ← Y-position: 0, background darker
└─────────────────────────┘

Frame 4 (Release):
┌─────────────────────────┐
│ ↗     Button      ↗    │ ← Returns to hover state
└─────────────────────────┘
```

## Accessibility Features

### Focus Indicators
```
Keyboard Focus (All Themes):
┌═════════════════════════┐  ← 4px focus ring with 2px offset
║ ┌─────────────────────┐ ║
║ │      Button         │ ║
║ └─────────────────────┘ ║
└═════════════════════════┘

High Contrast Focus:
┌███████████████████████████┐ ← 6px enhanced focus ring
███ ┌─────────────────────┐ ███
███ │      Button         │ ███
███ └─────────────────────┘ ███
└███████████████████████████┘
```

### Screen Reader Labels
```
Button Structure:
<button 
  type="button"
  aria-label="Start roasting process"
  aria-describedby="roast-help-text">
  Start Roast
</button>

Emergency Button:
<button 
  type="button"
  aria-label="Emergency stop - stops roasting immediately"
  class="btn btn--emergency">
  STOP ROAST
</button>
```

## Mobile Touch Optimizations

### Touch Target Guidelines
```
Minimum Touch Target (44px):
┌─────────────────────────┐
│          ∘44px          │ ← iOS minimum requirement
└─────────────────────────┘

Preferred Touch Target (60px):
┌─────────────────────────────┐
│           ∘60px             │ ← User-friendly optimized
└─────────────────────────────┘

Spacing Between Buttons:
┌─────────────┐    ┌─────────────┐
│  Button 1   │ 8px│  Button 2   │ ← Minimum 8px gap
└─────────────┘    └─────────────┘
```

### Mobile-Specific States
```
Mobile Touch Feedback:
┌─────────────────────────┐
│    Pressed State        │ ← Brief highlight (100ms)
└─────────────────────────┘
          ↓
    Haptic Feedback (iOS)
```

## Error and Loading States

### Loading State
```
┌─────────────────────────┐
│  [◐]  Processing...     │ ← Spinner + text, disabled interaction
└─────────────────────────┘
```

### Error State
```
┌─────────────────────────┐
│  [!]  Action Failed     │ ← Error icon + message, retry available
└─────────────────────────┘
```

### Success State
```
┌─────────────────────────┐
│  [✓]  Action Complete   │ ← Success icon, brief display (2s)
└─────────────────────────┘
```

## Component Composition

### Button with Icon
```
┌─────────────────────────┐
│ [🎨] Select Theme       │ ← Icon + text, 8px gap
└─────────────────────────┘
```

### Button Group
```
┌─────────────┐┌─────────────┐┌─────────────┐
│   Option 1  ││   Option 2  ││   Option 3  │ ← Connected buttons
└─────────────┘└─────────────┘└─────────────┘
```

### Split Button
```
┌─────────────────────┐┌───┐
│    Primary Action   ││ ▼ │ ← Main action + dropdown trigger
└─────────────────────┘└───┘
```