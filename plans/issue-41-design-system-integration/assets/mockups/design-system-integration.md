# Design System Integration Mockups

## Complete Interface Examples Across All Themes

### 1. Navigation Bar with Theme Switcher

#### Classic Coffee Theme
```
Coffee Roast Tracker - Classic Theme Navigation
┌──────────────────────────────────────────────────────────────────────────┐
│ [☕] Coffee Roast Tracker    Dashboard  Roasts  Beans  [🎨 Classic ▼]  [👤] │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│ Background: #fafaf9 (color-gray-50)                                     │
│ Border: 2px solid #e7e5e4 (color-gray-200)                             │
│ Logo: Gradient from #c8794a to #b86c3e                                  │
│ Navigation: color-text-primary (#1c1917)                                │
│ Theme Switcher: Primary button style with dropdown                      │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘

Theme Switcher Dropdown (Open):
                                        ┌─────────────────────┐
                                        │ ● Classic Coffee    │ ← Selected
                                        │ ○ High Contrast     │
                                        │ ○ Cool Focus        │
                                        │ ○ Energizing        │
                                        │                     │
                                        │ [🔄] System Auto    │
                                        └─────────────────────┘
```

#### High Contrast Theme
```
Coffee Roast Tracker - High Contrast Theme Navigation
┌══════════════════════════════════════════════════════════════════════════┐
║ [☕] Coffee Roast Tracker    Dashboard  Roasts  Beans  [🎨 Contrast ▼] [👤] ║
╠══════════════════════════════════════════════════════════════════════════╣
║                                                                          ║
║ Background: #ffffff (pure white)                                         ║
║ Border: 3px solid #000000 (pure black)                                  ║
║ Text: #000000 (maximum contrast)                                         ║
║ Logo: Solid black with white background                                  ║
║ Enhanced shadows for depth perception                                    ║
║                                                                          ║
╚══════════════════════════════════════════════════════════════════════════╝
```

#### Cool Focus Theme
```
Coffee Roast Tracker - Cool Focus Theme Navigation
┌──────────────────────────────────────────────────────────────────────────┐
│ [☕] Coffee Roast Tracker    Dashboard  Roasts  Beans  [🎨 Focus ▼]    [👤] │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│ Background: #f8fafc (cool-toned)                                        │
│ Border: 2px solid #e2e8f0                                               │
│ Logo: Gradient from #0ea5e9 to #0284c7                                  │
│ Accent: Calming blue-green tones                                        │
│ Typography: Enhanced readability focus                                   │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

#### Energizing Theme
```
Coffee Roast Tracker - Energizing Theme Navigation
┌──────────────────────────────────────────────────────────────────────────┐
│ [☕] Coffee Roast Tracker    Dashboard  Roasts  Beans  [🎨 Energy ▼]   [👤] │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│ Background: #fffbeb (warm cream)                                        │
│ Border: 2px solid #fed7aa                                               │
│ Logo: Gradient from #f97316 to #ea580c                                  │
│ Accent: Vibrant orange and teal combinations                            │
│ Energy: Warm, motivating color palette                                  │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### 2. Button Component Showcase

#### All Themes - Button Comparison Matrix
```
Theme Comparison - Primary Buttons:

Classic Coffee:
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   Start Roast   │  │   Start Roast   │  │   Start Roast   │
└─────────────────┘  └─────────────────┘  └─────────────────┘
   Default State      Hover State (+lift)    Focus State (ring)
   #c8794a bg         #b86c3e bg            Ring: rgba(200,121,74,0.5)

High Contrast:
┌═════════════════┐  ┌═════════════════┐  ┌═══════════════════┐
║   Start Roast   ║  ║   Start Roast   ║  ║███ Start Roast ███║
└═════════════════┘  └═════════════════┘  └═══════════════════┘
   #000000 bg         Enhanced shadow       Enhanced 6px ring
   #ffffff text       Bold borders         Maximum contrast

Cool Focus:
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   Start Roast   │  │   Start Roast   │  │   Start Roast   │
└─────────────────┘  └─────────────────┘  └─────────────────┘
   #0ea5e9 bg         #0284c7 bg           Ring: rgba(14,165,233,0.5)
   Calming blue       Deeper blue          Soothing focus

Energizing:
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   Start Roast   │  │   Start Roast   │  │   Start Roast   │
└─────────────────┘  └─────────────────┘  └─────────────────┘
   #f97316 bg         #ea580c bg           Ring: rgba(249,115,22,0.5)
   Vibrant orange     Deeper orange        Energetic focus
```

#### Emergency Button - All Themes
```
Classic Coffee Emergency:
┌─────────────────────────────────────┐
│            STOP ROAST               │ ← 100px height, uppercase
└─────────────────────────────────────┘
Background: #ef4444, Enhanced shadow

High Contrast Emergency:
┌═════════════════════════════════════┐
║            STOP ROAST               ║ ← Maximum contrast
└═════════════════════════════════════┘  
Background: #ff0000, Border: 4px solid #000

Cool Focus Emergency:
┌─────────────────────────────────────┐
│            STOP ROAST               │ ← Maintains theme while critical
└─────────────────────────────────────┘
Background: #ef4444, Blue accent ring

Energizing Emergency:
┌─────────────────────────────────────┐
│            STOP ROAST               │ ← High energy critical action
└─────────────────────────────────────┘
Background: #ef4444, Enhanced orange glow
```

### 3. Form Components with Themes

#### Input Field Styling Across Themes
```
Classic Coffee Form:
┌─────────────────────────────────────────────────────────────┐
│ Bean Origin *                                               │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Ethiopia Yirgacheffe                                    │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Background: #ffffff, Border: 2px solid #e7e5e4            │
│ Focus: Border becomes #c8794a, Ring: rgba(200,121,74,0.3) │
│                                                             │
└─────────────────────────────────────────────────────────────┘

High Contrast Form:
┌═════════════════════════════════════════════════════════════┐
║ Bean Origin *                                               ║
║ ┌═════════════════════════════════════════════════════════┐ ║
║ ║ Ethiopia Yirgacheffe                                    ║ ║
║ └═════════════════════════════════════════════════════════┘ ║
║                                                             ║
║ Background: #ffffff, Border: 3px solid #000000            ║
║ Focus: Enhanced border, 6px focus ring                     ║
║                                                             ║
╚═════════════════════════════════════════════════════════════╝

Cool Focus Form:
┌─────────────────────────────────────────────────────────────┐
│ Bean Origin *                                               │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Ethiopia Yirgacheffe                                    │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Background: #ffffff, Border: 2px solid #e2e8f0            │
│ Focus: Border becomes #0ea5e9, Ring: rgba(14,165,233,0.3) │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Energizing Form:
┌─────────────────────────────────────────────────────────────┐
│ Bean Origin *                                               │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Ethiopia Yirgacheffe                                    │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Background: #ffffff, Border: 2px solid #fed7aa            │
│ Focus: Border becomes #f97316, Ring: rgba(249,115,22,0.3) │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4. Card Components Themed

#### Bean Selection Cards
```
Classic Coffee Bean Card:
┌───────────────────────────────────────┐
│ ┌─────────────────────────────────────┐ │
│ │        [Bean Image]                 │ │ ← Warm, coffee-toned
│ └─────────────────────────────────────┘ │
│                                       │
│ ◉ Ethiopia Yirgacheffe               │
│   Light roast, floral notes           │
│                                       │
│ ┌─────────────┐  ┌─────────────────┐  │
│ │ Select Bean │  │     Details     │  │
│ └─────────────┘  └─────────────────┘  │
└───────────────────────────────────────┘
Background: #ffffff, Border: 2px solid #e7e5e4
Selected: Border becomes #c8794a, Background: #fdf7f0

High Contrast Bean Card:
┌═══════════════════════════════════════┐
║ ┌═════════════════════════════════════┐ ║
║ ║        [Bean Image]                 ║ ║ ← High contrast
║ └═════════════════════════════════════┘ ║
║                                       ║
║ ◉ Ethiopia Yirgacheffe               ║
║   Light roast, floral notes           ║
║                                       ║
║ ┌═══════════┐  ┌═════════════════┐    ║
║ ║Select Bean║  ║     Details     ║    ║
║ └═══════════┘  └═════════════════┘    ║
╚═══════════════════════════════════════╝
Background: #ffffff, Border: 3px solid #000000
Selected: Enhanced border, strong shadow

Cool Focus Bean Card:
┌───────────────────────────────────────┐
│ ┌─────────────────────────────────────┐ │
│ │        [Bean Image]                 │ │ ← Cool-toned overlay
│ └─────────────────────────────────────┘ │
│                                       │
│ ◉ Ethiopia Yirgacheffe               │
│   Light roast, floral notes           │
│                                       │
│ ┌─────────────┐  ┌─────────────────┐  │
│ │ Select Bean │  │     Details     │  │
│ └─────────────┘  └─────────────────┘  │
└───────────────────────────────────────┘
Background: #ffffff, Border: 2px solid #e2e8f0
Selected: Border becomes #0ea5e9, Background: #f0f9ff

Energizing Bean Card:
┌───────────────────────────────────────┐
│ ┌─────────────────────────────────────┐ │
│ │        [Bean Image]                 │ │ ← Warm, energetic tones
│ └─────────────────────────────────────┘ │
│                                       │
│ ◉ Ethiopia Yirgacheffe               │
│   Light roast, floral notes           │
│                                       │
│ ┌─────────────┐  ┌─────────────────┐  │
│ │ Select Bean │  │     Details     │  │
│ └─────────────┘  └─────────────────┘  │
└───────────────────────────────────────┘
Background: #ffffff, Border: 2px solid #fed7aa
Selected: Border becomes #f97316, Background: #fff7ed
```

### 5. Timer Display Component

#### Large Timer Display - All Themes
```
Classic Coffee Timer:
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                          05:23                                  │ ← Tabular nums
│                      First Crack                               │
│                                                                 │
│                   ┌─────────────────┐                          │
│                   │   STOP ROAST    │                          │
│                   └─────────────────┘                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
Background: Linear gradient (surface → surface-secondary)
Border: 3px solid border color
Time: Mono font, 8vw responsive sizing, primary-600 color
Phase: Secondary text, uppercase, letter-spacing

High Contrast Timer:
┌═══════════════════════════════════════════════════════════════════┐
║                                                                   ║
║                            05:23                                  ║ ← Pure black text
║                        First Crack                               ║
║                                                                   ║
║                   ┌═══════════════════┐                          ║
║                   ║    STOP ROAST     ║                          ║
║                   └═══════════════════┘                          ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
Background: Pure white (#ffffff)
Border: 4px solid pure black (#000000)
Text: Maximum contrast, enhanced readability

Cool Focus Timer:
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                          05:23                                  │ ← Cool blue text
│                      First Crack                               │
│                                                                 │
│                   ┌─────────────────┐                          │
│                   │   STOP ROAST    │                          │
│                   └─────────────────┘                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
Background: Cool gradient (slate tones)
Text: Deep slate blue for concentration
Calming, focus-enhancing color scheme

Energizing Timer:
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                          05:23                                  │ ← Vibrant orange
│                      First Crack                               │
│                                                                 │
│                   ┌─────────────────┐                          │
│                   │   STOP ROAST    │                          │
│                   └─────────────────┘                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
Background: Warm gradient (orange to amber)
Text: Rich orange for energy and motivation
Motivating, active color scheme
```

### 6. Alert Components

#### Alert Messages Across Themes
```
Classic Coffee Alerts:

Success Alert:
┌─────────────────────────────────────────────────────────────────┐
│ ║ [✓] Roast profile saved successfully!                         │
│ ║     Your settings have been applied to the current session.   │
└─────────────────────────────────────────────────────────────────┘
Background: #ecfdf5, Border-left: 4px solid #10b981, Text: #065f46

Warning Alert:
┌─────────────────────────────────────────────────────────────────┐
│ ║ [!] Temperature rising quickly!                               │
│ ║     Monitor roast closely to prevent burning.                 │
└─────────────────────────────────────────────────────────────────┘
Background: #fffbeb, Border-left: 4px solid #f59e0b, Text: #92400e

Error Alert:
┌─────────────────────────────────────────────────────────────────┐
│ ║ [✗] Connection to roaster lost!                               │
│ ║     Please check your connection and try again.               │
└─────────────────────────────────────────────────────────────────┘
Background: #fef2f2, Border-left: 4px solid #ef4444, Text: #991b1b

High Contrast Alerts:

Success Alert:
┌═══════════════════════════════════════════════════════════════════┐
║ ████ [✓] Roast profile saved successfully!                       ║
║ ████     Your settings have been applied to the current session. ║
╚═══════════════════════════════════════════════════════════════════╝
Background: #ffffff, Border-left: 6px solid #008000, Text: #000000

Warning Alert:
┌═══════════════════════════════════════════════════════════════════┐
║ ████ [!] Temperature rising quickly!                             ║
║ ████     Monitor roast closely to prevent burning.               ║
╚═══════════════════════════════════════════════════════════════════╝
Background: #ffffff, Border-left: 6px solid #ff8000, Text: #000000

Error Alert:
┌═══════════════════════════════════════════════════════════════════┐
║ ████ [✗] Connection to roaster lost!                             ║
║ ████     Please check your connection and try again.             ║
╚═══════════════════════════════════════════════════════════════════╝
Background: #ffffff, Border-left: 6px solid #ff0000, Text: #000000
```

## Responsive Behavior

### Mobile Layout Adaptations (< 768px)

#### Navigation Collapse
```
Classic Coffee Mobile Navigation:
┌─────────────────────────────────────┐
│ ☰ Coffee Roast Tracker       🎨 👤 │ ← Hamburger menu, compact theme switcher
├─────────────────────────────────────┤
│                                     │
│ Mobile menu (when opened):          │
│ ┌─────────────────────────────────┐ │
│ │ Dashboard                       │ │
│ │ Roasts                          │ │
│ │ Beans                           │ │
│ │ ─────────────────────────       │ │
│ │ Theme: Classic Coffee      [>]  │ │ ← Theme selection
│ │ Profile Settings           [>]  │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

#### Button Sizing Adjustments
```
Mobile Button Scaling:

Desktop (Standard):
┌─────────────────┐
│   Action        │ ← 60px height
└─────────────────┘

Mobile (Enhanced):
┌───────────────────────┐
│        Action         │ ← 80px height, larger text
└───────────────────────┘

Mobile Button Group:
┌────────────────────────┐
│      Primary           │ ← Full width, 80px height
└────────────────────────┘
          ↓ 16px gap
┌────────────────────────┐
│      Secondary         │ ← Full width, 80px height  
└────────────────────────┘
```

### Tablet Layout (768px - 1024px)

#### Theme Switcher Adaptations
```
Tablet Theme Switcher (Option 2 - Tabs):
┌─────────────────────────────────────────────────────────────┐
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│ │Classic  │ │ High    │ │ Cool    │ │Energi-  │           │
│ │Coffee   │ │Contrast │ │ Focus   │ │zing     │           │ ← Horizontal tabs
│ │   ●     │ │    ○    │ │    ○    │ │    ○    │           │   maintain spacing
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘           │
└─────────────────────────────────────────────────────────────┘

Tablet Card Grid (Option 3):
┌───────────────────────────────────────────────────────────────┐
│ ┌────────────────┐              ┌────────────────┐          │
│ │ Classic Coffee │              │ High Contrast  │          │
│ │ ┌────────────┐ │              │ ┌────────────┐ │          │
│ │ │[Btn] Text  │ │              │ │[Btn] Text  │ │          │ ← 2×2 grid
│ │ │■■■■■       │ │              │ │■■■■■       │ │            optimized
│ │ └────────────┘ │              │ └────────────┘ │            for tablets
│ │ [Select Theme] │              │ [Select Theme] │          │
│ └────────────────┘              └────────────────┘          │
│ ┌────────────────┐              ┌────────────────┐          │
│ │ Cool Focus     │              │ Energizing     │          │
│ │ ┌────────────┐ │              │ ┌────────────┐ │          │
│ │ │[Btn] Text  │ │              │ │[Btn] Text  │ │          │
│ │ │■■■■■       │ │              │ │■■■■■       │ │          │
│ │ └────────────┘ │              │ └────────────┘ │          │
│ │ [Select Theme] │              │ [✓ Current]    │          │
│ └────────────────┘              └────────────────┘          │
└───────────────────────────────────────────────────────────────┘
```

## Performance Optimization Visual Indicators

### Theme Transition States
```
Theme Switch Loading Sequence:

Frame 1 (Initiation):
┌─────────────────────────────────────────┐
│ Current Theme Interface                 │ ← Normal state
└─────────────────────────────────────────┘

Frame 2 (Transition - 100ms):
┌─────────────────────────────────────────┐
│ ░░░░░ Theme Interface ░░░░░             │ ← Brief opacity fade
└─────────────────────────────────────────┘

Frame 3 (New Theme - 200ms):
┌─────────────────────────────────────────┐
│ New Theme Interface                     │ ← Colors updated
└─────────────────────────────────────────┘
```

### Loading States for Theme Previews
```
Theme Preview Loading:
┌─────────────────────────┐
│ Theme Name              │
│ ┌─────────────────────┐ │
│ │ ░░░░░░░░░░░░░░░░░░░ │ │ ← Skeleton loading
│ │ ░░░░░░░░░░░░░░░░░░░ │ │   for preview area
│ │ ░░░░░░░░░░░░░░░░░░░ │ │
│ └─────────────────────┘ │
│ [Loading Theme...]      │
└─────────────────────────┘
```

## Accessibility Enhancement Indicators

### Focus Management
```
Keyboard Navigation Flow:
Tab 1: Theme Switcher Trigger
┌═════════════════════════┐
║ [🎨] Classic Coffee [▼] ║ ← Focus ring visible
└═════════════════════════┘

Tab 2: First Theme Option (when dropdown open)
┌─────────────────────────┐
│ ● Classic Coffee        │ ← Normal
│ ○═══High Contrast═══════│ ← Focus ring on option
│ ○ Cool Focus            │
│ ○ Energizing            │
└─────────────────────────┘

Tab 3: Next Theme Option
┌─────────────────────────┐
│ ● Classic Coffee        │
│ ○ High Contrast         │
│ ○═══Cool Focus══════════│ ← Focus moves to next
│ ○ Energizing            │
└─────────────────────────┘
```

### Screen Reader Announcements
```
Live Region Updates:
┌─────────────────────────────────────────┐
│ [Screen Reader Announcement]            │
│ "Theme changed to High Contrast"        │
│ "All interface colors updated"          │
│ "Press Tab to continue navigation"      │
└─────────────────────────────────────────┘

Aria Labels:
┌─────────────────────────────────────────┐
│ Button: "Select color theme,            │
│         current selection Classic       │
│         Coffee, button menu"            │
│                                         │
│ Options: "Classic Coffee theme,         │
│          warm brown colors,             │
│          currently selected"            │
└─────────────────────────────────────────┘
```

This comprehensive mockup system demonstrates how the design system creates consistent, accessible, and user-friendly experiences across all four themes while maintaining the coffee roasting application's specific requirements and constraints.