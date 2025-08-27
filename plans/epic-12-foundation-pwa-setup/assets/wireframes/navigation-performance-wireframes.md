# Navigation & Performance Monitoring Wireframes - User Story #20

## Overview
**UPDATED DESIGN APPROACH**: Following staff designer review, performance monitoring now includes user-controlled visibility levels to prevent ADHD anxiety triggers while maintaining optimization benefits.

ADHD-optimized navigation with anxiety-aware performance monitoring that prioritizes user control and positive messaging.

---

## Option 1: ADHD-Optimized Hierarchical Navigation

### Desktop Navigation Layout

```
┌─────────────────────────────────────────────────┐
│ ☰  Coffee Roast Tracker    🎯 Theme ▼  👤 User │
├─────────────────────────────────────────────────┤
│ 🏠 Dashboard │ ☕ Roasting │ 🌱 Beans │ ⚙️ Settings │
│ ────────────                                    │
├─────────────────────────────────────────────────┤
│                                                 │
│  📍 Home > Dashboard                            │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │             Welcome Back!               │    │
│  │                                         │    │
│  │  ✨ Your app is running smoothly       │    │
│  │  📶 Connection: Strong                  │    │
│  │  💾 Sync: Up to date                   │    │
│  │                                         │    │
│  │  [⚙️ Show performance details]          │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  Quick Actions                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │ New      │ │ Continue │ │ View     │        │
│  │ Roast    │ │ Roast    │ │ History  │        │
│  └──────────┘ └──────────┘ └──────────┘        │
│                                                 │
│  Recent Activity                                │
│  ┌─────────────────────────────────────────┐    │
│  │  Ethiopian Yirgacheffe     2 hours ago │    │
│  │  Light roast • Perfect results         │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Mobile Navigation (Bottom Navigation)

```
┌─────────────────────┐
│ Coffee Roast        │
│ Tracker        👤   │
├─────────────────────┤
│                     │
│ 📍 Dashboard        │
│                     │
│ ⚡ Performance      │
│ ████████░░ 85%      │
│ Good                │
│                     │
│ Quick Start         │
│ ┌─────────────────┐ │
│ │   New Roast     │ │
│ └─────────────────┘ │
│                     │
│ Recent              │
│ ┌─────────────────┐ │
│ │ Ethiopian       │ │
│ │ 2 hrs ago       │ │
│ └─────────────────┘ │
│                     │
│ ──────────────────  │
│ 🏠  ☕  🌱  📊  ⚙️  │
│Home Roast Bean Stats Set│
│ ●                   │
└─────────────────────┘
```

### Roasting Section Navigation

```
┌─────────────────────────────────────────────────┐
│ ☰  Coffee Roast Tracker    🎯 Theme ▼  👤 User │
├─────────────────────────────────────────────────┤
│ 🏠 Dashboard │ ☕ Roasting │ 🌱 Beans │ ⚙️ Settings │
│               ─────────────                     │
├─────────────────────────────────────────────────┤
│                                                 │
│  📍 Home > Roasting                             │
│                                                 │
│  ┌─ Active Roasts ─┐ ┌─ New Roast ─┐ ┌─ History─┐ │
│  │                  │ │              │ │         │ │
│  │  ⏱️ Colombian    │ │  🌱 Select   │ │ 📊 View │ │
│  │  08:45 running   │ │    Bean      │ │  Past   │ │
│  │                  │ │              │ │ Roasts  │ │
│  │  [View Timer]    │ │ [Start New]  │ │ [Browse]│ │
│  └──────────────────┘ └──────────────┘ └─────────┘ │
│                                                 │
│  Performance Monitor                            │
│  ┌─────────────────────────────────────────┐    │
│  │  ⚡ App Speed: ████████░░ 84% Good     │    │
│  │  🔄 Loading: 0.6s (Target: <1s)        │    │
│  │  💾 Storage: 34MB used (68% full)      │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  Quick Navigation                               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │ Timer    │ │ Bean     │ │ Profile  │        │
│  │ Control  │ │ Library  │ │ Settings │        │
│  └──────────┘ └──────────┘ └──────────┘        │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Deep Navigation (3rd Level)

```
┌─────────────────────────────────────────────────┐
│ ☰  Coffee Roast Tracker    🎯 Theme ▼  👤 User │
├─────────────────────────────────────────────────┤
│ 🏠 Dashboard │ ☕ Roasting │ 🌱 Beans │ ⚙️ Settings │
│               ─────────────                     │
├─────────────────────────────────────────────────┤
│                                                 │
│  📍 Home > Roasting > Timer Control            │
│                                                 │
│  ← Back to Roasting                             │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │              ⏱️ 08:45                   │    │
│  │           First Crack Phase             │    │
│  │                                         │    │
│  │         Colombian Supremo               │    │
│  │          Medium Roast                   │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │  Pause   │ │  Add     │ │   End    │        │
│  │  Timer   │ │  Note    │ │  Roast   │        │
│  └──────────┘ └──────────┘ └──────────┘        │
│                                                 │
│  Performance: Timer running smoothly ✅         │
│  ┌─────────────────────────────────────────┐    │
│  │  🎯 Precision: ±0.1s accuracy          │    │
│  │  ⚡ Response: <50ms input lag          │    │
│  │  🔄 Updates: Real-time sync active     │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  📍 Navigate to: Bean Details | Roast History   │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Option 2: Context-Adaptive Navigation

### Adaptive Dashboard

```
┌─────────────────────────────────────────────────┐
│ 🧠 Smart Nav            Performance: ⚡ 92%     │
├─────────────────────────────────────────────────┤
│                                                 │
│  Based on your usage, here's what's ready:     │
│                                                 │
│  🔥 Most Used                                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │ Timer    │ │Ethiopian │ │ Light    │        │
│  │ Control  │ │ Beans    │ │ Roast    │        │
│  │ ⚡ Ready │ │ 🌱 Ready │ │ 📊 Ready │        │
│  └──────────┘ └──────────┘ └──────────┘        │
│                                                 │
│  🕐 Recently Accessed                           │
│  • Roast History (2 min ago)                   │
│  • Bean Library (15 min ago)                   │
│  • Settings (1 hour ago)                       │
│                                                 │
│  💡 Suggested Next Actions                      │
│  ┌─────────────────────────────────────────┐    │
│  │  Continue yesterday's Colombian roast?  │    │
│  │  [Review Results] [Start Similar]      │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │  📊 Show Full Menu                      │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Context-Sensitive Menu

```
┌─────────────────────────────────────────────────┐
│ 🎯 Context: Active Roast Timer                  │
├─────────────────────────────────────────────────┤
│                                                 │
│  ⏱️ 08:45 Colombian Supremo                     │
│                                                 │
│  🎯 Timer Actions (Most Relevant)               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │  Pause   │ │  Add     │ │  End     │        │
│  │  Timer   │ │  Note    │ │  Roast   │        │
│  │ ⚡ 0ms   │ │ ⚡ 15ms  │ │ ⚡ 8ms   │        │
│  └──────────┘ └──────────┘ └──────────┘        │
│                                                 │
│  📚 Related Tools                               │
│  • Bean details for this roast                 │
│  • Similar past roasts (3 found)               │
│  • Temperature logs                            │
│                                                 │
│  🧭 Quick Jump                                  │
│  ┌─────────────────────────────────────────┐    │
│  │ Dashboard │ History │ Beans │ Settings │    │
│  │   ⚡ 45ms │ ⚡ 62ms │⚡ 38ms│ ⚡ 51ms  │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  Performance: Context switching optimized       │
│  🎯 90% faster access to relevant tools        │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Adaptive Mobile Interface

```
┌─────────────────────┐
│ 🧠 Smart            │
│ Context: Roasting   │
├─────────────────────┤
│                     │
│ ⏱️ 08:45           │
│ Colombian           │
│                     │
│ 🎯 Quick            │
│ ┌─────────────────┐ │
│ │ Pause Timer     │ │
│ │ ⚡ Instant      │ │
│ └─────────────────┘ │
│                     │
│ ┌─────────────────┐ │
│ │ Add Note        │ │
│ │ ⚡ 15ms         │ │
│ └─────────────────┘ │
│                     │
│ Related             │
│ • Bean info         │
│ • Past roasts       │
│                     │
│ ──────────────────  │
│ 🎯  ⏱️  📝  🧭  ⚙️  │
│Auto Timer Note Nav Set│
│ ●                   │
└─────────────────────┘
```

---

## Option 3: Performance-First Navigation

### Performance Dashboard Navigation

```
┌─────────────────────────────────────────────────┐
│ ⚡ Performance Monitor    📊 Real-time Metrics  │
├─────────────────────────────────────────────────┤
│                                                 │
│  Navigation Speed Analysis                      │
│  ┌─────────────────────────────────────────┐    │
│  │  🏠 Dashboard:     ████████░░ 0.2s      │    │
│  │  ☕ Roasting:      ████████░░ 0.3s      │    │
│  │  🌱 Beans:         ████████░░ 0.1s      │    │
│  │  📊 Statistics:    ██████░░░░ 0.8s      │    │
│  │  ⚙️ Settings:      ████████░░ 0.2s      │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  🎯 Optimized Quick Actions (< 100ms)           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │ New Roast│ │ Timer    │ │ Last     │        │
│  │ ⚡ 45ms  │ │ ⚡ 38ms  │ │ Result   │        │
│  │ ████████ │ │ ████████ │ │ ⚡ 52ms  │        │
│  └──────────┘ └──────────┘ └──────────┘        │
│                                                 │
│  ⚠️ Slower Actions (Optimization Needed)        │
│  ┌─────────────────────────────────────────┐    │
│  │  📊 Full Statistics: 0.8s               │    │
│  │  💡 Tip: Use Quick Stats instead        │    │
│  │  [Quick Stats 0.1s] [Full Stats 0.8s]  │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  Bundle Size Impact                             │
│  Main Bundle: ████████░░ 456KB (91% of budget) │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Performance-Aware Roasting Interface

```
┌─────────────────────────────────────────────────┐
│ ☕ Roasting    Performance: ████████░░ 88%      │
├─────────────────────────────────────────────────┤
│                                                 │
│  ⚡ Real-time Performance                       │
│  ┌─────────────────────────────────────────┐    │
│  │  Timer Accuracy: ±0.05s ✅              │    │
│  │  Input Lag: 12ms ✅                     │    │
│  │  Memory Usage: 45MB ⚠️                  │    │
│  │  CPU Usage: 8% ✅                       │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│              ⏱️ 08:45                           │
│           First Crack Phase                     │
│                                                 │
│  Performance-Optimized Controls                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │  Pause   │ │  Note    │ │  End     │        │
│  │ ⚡ 0ms   │ │⚠️ 150ms  │ │ ⚡ 25ms  │        │
│  │ Instant  │ │ Slower   │ │ Fast     │        │
│  └──────────┘ └──────────┘ └──────────┘        │
│                                                 │
│  📈 Navigation Performance Tips                 │
│  ┌─────────────────────────────────────────┐    │
│  │  💡 Quick actions load 3x faster        │    │
│  │  💡 Avoid Statistics during active roast│    │
│  │  💡 Bean details cached for speed      │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Performance Alerts & Optimization

```
┌─────────────────────────────────────────────────┐
│              ⚠️ PERFORMANCE ALERT               │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │         Slower Navigation Detected      │    │
│  │                                         │    │
│  │  Some actions are taking longer than   │    │
│  │  expected:                              │    │
│  │                                         │    │
│  │  📊 Statistics: 1.2s (target: <0.8s)   │    │
│  │  🌱 Bean Library: 0.9s (target: <0.5s) │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  🚀 Optimization Suggestions                    │
│  ┌─────────────────────────────────────────┐    │
│  │  ✅ Clear browser cache                 │    │
│  │  ⚡ Use quick actions instead           │    │
│  │  🗂️ Archive old roasts (2GB saved)     │    │
│  │  📱 Restart app for best performance    │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │         OPTIMIZE NOW                    │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │           CONTINUE ANYWAY               │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  Performance will be monitored and you'll get  │
│  tips to keep your app running smoothly.       │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Breadcrumb Navigation Systems

### Standard Breadcrumbs (Option 1)

```
┌─────────────────────────────────────────────────┐
│  📍 Home > Roasting > Timer Control > Settings  │
├─────────────────────────────────────────────────┤
│                                                 │
│  ← Back to Timer Control                        │
│                                                 │
│  Timer Preferences                              │
│  ┌─────────────────────────────────────────┐    │
│  │  ☑ Sound alerts at phase changes       │    │
│  │  ☑ Vibration feedback (mobile)         │    │
│  │  ☐ Voice announcements                 │    │
│  │  ☑ Visual phase indicators             │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  Navigation Performance                         │
│  ┌─────────────────────────────────────────┐    │
│  │  From here you can quickly go to:      │    │
│  │                                         │    │
│  │  📍 Timer Control (1 click back)       │    │
│  │  📍 Roasting Hub (2 clicks back)       │    │
│  │  📍 Dashboard (3 clicks back)          │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Context-Aware Breadcrumbs (Option 2)

```
┌─────────────────────────────────────────────────┐
│  🧭 Smart Path: Timer Settings (3/3 levels)    │
├─────────────────────────────────────────────────┤
│                                                 │
│  🎯 You're here because you started a roast    │
│     and want to customize timer alerts         │
│                                                 │
│  Path Efficiency: ⚡ Excellent                  │
│  ┌─────────────────────────────────────────┐    │
│  │  Dashboard → Roasting → Timer Settings  │    │
│  │    0.2s        0.3s        0.1s        │    │
│  │  Total navigation time: 0.6s           │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  🔄 Quick Actions from here:                    │
│  • Return to active timer (1 click)            │
│  • Start new roast (2 clicks)                  │
│  • View roast history (2 clicks)               │
│                                                 │
│  Timer Preferences                              │
│  [Settings content...]                         │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Performance-Focused Breadcrumbs (Option 3)

```
┌─────────────────────────────────────────────────┐
│  📊 Path: Home(0.2s) > Roast(0.3s) > Timer(0.1s)│
├─────────────────────────────────────────────────┤
│                                                 │
│  Navigation Metrics                             │
│  ┌─────────────────────────────────────────┐    │
│  │  Current Level: 3 of 3 (Max depth)     │    │
│  │  Load Time: 0.6s total                 │    │
│  │  Bundle Size: +12KB for this level     │    │
│  │  Memory Impact: +4MB                   │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  ⚡ Optimized Back Navigation                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │ Timer    │ │Roasting  │ │Dashboard │        │
│  │ ⚡ 0ms   │ │ ⚡ 85ms  │ │ ⚡ 120ms │        │
│  │ Current  │ │ Cached   │ │ Cached   │        │
│  └──────────┘ └──────────┘ └──────────┘        │
│                                                 │
│  💡 Performance Tip: Going deeper will affect  │
│     load times. Consider using quick actions.  │
│                                                 │
│  Timer Settings                                 │
│  [Settings content...]                         │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Mobile Navigation Patterns

### Bottom Tab Navigation (Option 1)

```
┌─────────────────────┐
│ Coffee Roast        │
│ Tracker        👤   │
├─────────────────────┤
│                     │
│ Content Area        │
│ Based on selected   │
│ tab                 │
│                     │
│ Performance         │
│ ████████░░ 88%      │
│ Good speed          │
│                     │
│                     │
│                     │
│                     │
│                     │
│                     │
│                     │
│                     │
│                     │
│                     │
├─────────────────────┤
│ 🏠  ☕  🌱  📊  ⚙️  │
│Home Roast Bean Stats Set│
│ ●    ○   ○   ○   ○  │
└─────────────────────┘
```

### Contextual Mobile Navigation (Option 2)

```
┌─────────────────────┐
│ 🧠 Context Nav      │
│ Timer Active   📊85%│
├─────────────────────┤
│                     │
│ ⏱️ 08:45           │
│ Colombian Supremo   │
│                     │
│ Context Actions     │
│ ┌─────────────────┐ │
│ │ Pause (⚡ 0ms)  │ │
│ └─────────────────┘ │
│ ┌─────────────────┐ │
│ │ Add Note(⚡15ms)│ │
│ └─────────────────┘ │
│                     │
│ Quick Jump          │
│ [Dashboard][History]│
│ [⚡ 45ms]  [⚡ 62ms]│
│                     │
├─────────────────────┤
│ ⏸️  📝  🏠  📊  🧭  │
│Pause Note Home Stats Nav│
│ ●   ○   ○   ○   ○  │
└─────────────────────┘
```

### Performance-Aware Mobile Navigation (Option 3)

```
┌─────────────────────┐
│ ⚡ Performance Nav   │
│ Speed: 88%     📊   │
├─────────────────────┤
│                     │
│ Load Times          │
│ ┌─────────────────┐ │
│ │Home    ⚡ 0.2s  │ │
│ │Roast   ⚡ 0.3s  │ │
│ │Beans   ⚡ 0.1s  │ │
│ │Stats   ⚠️ 0.8s  │ │
│ │Settings⚡ 0.2s  │ │
│ └─────────────────┘ │
│                     │
│ Bundle Impact       │
│ Current: 456KB      │
│ Budget: 500KB       │
│ ████████░░ 91%      │
│                     │
├─────────────────────┤
│ 🏠  ☕  🌱  📊  ⚙️  │
│0.2s 0.3s 0.1s 0.8s 0.2s│
│ ●   ○   ○   ⚠️   ○  │
└─────────────────────┘
```

## Error States & Loading

### Navigation Loading States

```
┌─────────────────────────────────────────────────┐
│ ☰  Coffee Roast Tracker    🎯 Theme ▼  👤 User │
├─────────────────────────────────────────────────┤
│ 🏠 Dashboard │ ☕ Roasting │ 🌱 Beans │ ⚙️ Settings │
│               ─────────────                     │
├─────────────────────────────────────────────────┤
│                                                 │
│  Loading Roasting section...                   │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │  ████████████████████████░░░░░░░ 75%    │    │
│  │                                         │    │
│  │  Loading timer controls... ⚡ 0.3s      │    │
│  │                                         │    │
│  │  💡 This is taking longer than usual.  │    │
│  │     Your connection might be slow.      │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │           CONTINUE IN BASIC MODE        │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  Performance: Loading optimized for your       │
│  connection speed                               │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Navigation Error Recovery

```
┌─────────────────────────────────────────────────┐
│              ⚠️ NAVIGATION ERROR                │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │         Page Failed to Load             │    │
│  │                                         │    │
│  │  The Roasting section couldn't load    │    │
│  │  due to a connection or performance     │    │
│  │  issue.                                 │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  📊 Performance Impact:                         │
│  • Failed after 2.3s (timeout: 3s)             │
│  • Bundle size: 234KB attempted                │
│  • Memory usage spike detected                 │
│                                                 │
│  🔄 Recovery Options:                           │
│  ┌─────────────────────────────────────────┐    │
│  │           TRY AGAIN                     │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │         LOAD BASIC VERSION              │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │         RETURN TO DASHBOARD             │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  💡 Your active roast data is safe and          │
│     accessible from the basic version.         │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Accessibility Navigation Features

### Screen Reader Navigation

```
┌─────────────────────────────────────────────────┐
│ <nav aria-label="Main navigation">              │
│ <ul role="menubar">                             │
│   <li role="none">                              │
│     <a role="menuitem" aria-current="page"     │
│        href="/dashboard">Dashboard</a>          │
│   <li role="none">                              │
│     <a role="menuitem" href="/roasting"        │
│        aria-expanded="false">Roasting</a>      │
│     <ul role="menu" aria-hidden="true">        │
│       <li><a role="menuitem">Timer</a>         │
│       <li><a role="menuitem">New Roast</a>     │
│     </ul>                                       │
├─────────────────────────────────────────────────┤
│                                                 │
│ <nav aria-label="Breadcrumb">                  │
│   <ol>                                          │
│     <li><a href="/">Home</a></li>              │
│     <li><a href="/roasting">Roasting</a></li>  │
│     <li aria-current="page">Timer Control</li> │
│   </ol>                                         │
│ </nav>                                          │
│                                                 │
│ <main id="main-content" tabindex="-1">         │
│   <h1>Timer Control</h1>                       │
│   [Main content...]                            │
│ </main>                                         │
│                                                 │
│ <aside aria-label="Performance information">   │
│   <h2>Performance Status</h2>                  │
│   <p>Current speed: 88% (Good)</p>            │
│ </aside>                                        │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Keyboard Navigation Flow

```
┌─────────────────────────────────────────────────┐
│ Tab Order and Focus Management                  │
├─────────────────────────────────────────────────┤
│                                                 │
│ 1. Skip Links (hidden until focused)           │
│    • Skip to main content                      │
│    • Skip to navigation                        │
│                                                 │
│ 2. Main Navigation (Tab/Arrow keys)            │
│    • Dashboard (Home key: first item)          │
│    • Roasting (Space/Enter: expand submenu)    │
│    • Beans (End key: last item)                │
│    • Settings                                  │
│                                                 │
│ 3. Breadcrumb Navigation                       │
│    • Each level is focusable                   │
│    • Click/Enter: navigate to that level       │
│                                                 │
│ 4. Main Content Area                           │
│    • Logical reading order                     │
│    • Form controls grouped in fieldsets        │
│                                                 │
│ 5. Performance Sidebar (optional)              │
│    • Focusable for screen readers              │
│    • Non-essential, can be skipped             │
│                                                 │
│ Focus Indicators:                               │
│ • 4px solid ring around focused elements       │
│ • High contrast in all themes                  │
│ • Visible in reduced motion mode               │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Performance Monitoring UI Components

### Real-Time Performance Metrics

```
┌─────────────────────────────────────────────────┐
│              📊 LIVE PERFORMANCE                │
├─────────────────────────────────────────────────┤
│                                                 │
│  Core Web Vitals (Real Users)                  │
│  ┌─────────────────────────────────────────┐    │
│  │  LCP: ████████░░ 2.1s (Good)           │    │
│  │  FID: ████████░░ 45ms (Good)           │    │
│  │  CLS: ████████░░ 0.08 (Good)           │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  Custom App Metrics                            │
│  ┌─────────────────────────────────────────┐    │
│  │  Navigation: ████████░░ 0.3s           │    │
│  │  Timer Precision: ████████░░ ±0.05s    │    │
│  │  Sync Latency: ████████░░ 125ms        │    │
│  │  Bundle Size: ██████░░░░ 456KB         │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  🎯 Performance Score: 88/100                  │
│  ┌─────────────────────────────────────────┐    │
│  │  Excellent navigation speed             │    │
│  │  ⚠️ Bundle size near limit (91%)        │    │
│  │  ✅ Memory usage optimal                │    │
│  │  ✅ Timer accuracy excellent            │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  [View Detailed Report] [Optimization Tips]    │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Performance Budget Warnings

```
┌─────────────────────────────────────────────────┐
│              ⚠️ PERFORMANCE BUDGET              │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │      Approaching Bundle Size Limit     │    │
│  │                                         │    │
│  │  Current: 456KB / 500KB (91%)          │    │
│  │  ████████████████████████████████░░░░  │    │
│  │                                         │    │
│  │  Adding Statistics page will exceed    │    │
│  │  budget by ~45KB                       │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  Impact Prediction:                             │
│  • Load time: +0.2s (2.8s total)               │
│  • User experience: Noticeable delay           │
│  • Mobile users: Most affected                 │
│                                                 │
│  🚀 Optimization Options:                       │
│  ┌─────────────────────────────────────────┐    │
│  │  ✅ Load Statistics on demand (+0.1s)   │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │      CONTINUE WITH OPTIMIZATION         │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │      LOAD ANYWAY (NOT RECOMMENDED)      │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Design Rationale

### ADHD-Optimized Navigation Principles

1. **Maximum 3-Level Hierarchy**: Prevents cognitive overload and decision paralysis
2. **Clear Visual Hierarchy**: Uses consistent spacing, colors, and typography
3. **Immediate Feedback**: Every interaction provides instant visual confirmation  
4. **Consistent Patterns**: Same interaction models across all navigation areas
5. **Performance Transparency**: Users understand app speed and optimization

### Performance-First Design Philosophy

1. **Speed Awareness**: Users see performance metrics to understand app behavior
2. **Optimization Guidance**: Proactive suggestions for maintaining performance
3. **Budget Management**: Clear warnings before performance degradation
4. **Recovery Options**: Graceful degradation when performance issues occur

### Accessibility Integration

1. **Semantic Navigation**: Proper landmarks and ARIA attributes
2. **Keyboard Optimization**: Logical tab order with efficient shortcuts
3. **Screen Reader Support**: Clear announcements for navigation changes
4. **Focus Management**: Highly visible focus indicators across all themes