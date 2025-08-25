# Next.js + TailwindCSS Integration Guide

## Overview

This guide provides step-by-step instructions for integrating the Coffee Roast Tracker design system with your Next.js 15.5 + TailwindCSS v4 project.

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
cd frontend/
npm install --save-dev @tailwindcss/typography @tailwindcss/container-queries
npm install framer-motion class-variance-authority clsx tailwind-merge
npm install @radix-ui/react-slot @radix-ui/react-dialog @radix-ui/react-toast
```

### 2. Update Tailwind Configuration

Create or update `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Coffee Roast Tracker Design System Integration
      colors: {
        // Classic Coffee Theme
        'coffee-primary': {
          50: 'rgb(var(--color-primary-50) / <alpha-value>)',
          100: 'rgb(var(--color-primary-100) / <alpha-value>)',
          200: 'rgb(var(--color-primary-200) / <alpha-value>)',
          300: 'rgb(var(--color-primary-300) / <alpha-value>)',
          400: 'rgb(var(--color-primary-400) / <alpha-value>)',
          500: 'rgb(var(--color-primary-500) / <alpha-value>)',
          600: 'rgb(var(--color-primary-600) / <alpha-value>)',
          700: 'rgb(var(--color-primary-700) / <alpha-value>)',
          800: 'rgb(var(--color-primary-800) / <alpha-value>)',
          900: 'rgb(var(--color-primary-900) / <alpha-value>)',
        },
        'coffee-secondary': {
          50: 'rgb(var(--color-secondary-50) / <alpha-value>)',
          500: 'rgb(var(--color-secondary-500) / <alpha-value>)',
          600: 'rgb(var(--color-secondary-600) / <alpha-value>)',
          // ... other shades
        },
        'coffee-accent': {
          50: 'rgb(var(--color-accent-50) / <alpha-value>)',
          500: 'rgb(var(--color-accent-500) / <alpha-value>)',
          600: 'rgb(var(--color-accent-600) / <alpha-value>)',
        },
        // Semantic colors
        'coffee-success': 'rgb(var(--color-success-500) / <alpha-value>)',
        'coffee-warning': 'rgb(var(--color-warning-500) / <alpha-value>)',
        'coffee-error': 'rgb(var(--color-error-500) / <alpha-value>)',
        'coffee-info': 'rgb(var(--color-info-500) / <alpha-value>)',
      },
      spacing: {
        // User-friendly spacing
        'touch-sm': 'var(--touch-target-min)',       // 44px
        'touch-md': 'var(--touch-target-preferred)', // 60px  
        'touch-lg': 'var(--touch-target-large)',     // 80px
        'touch-xl': 'var(--touch-target-emergency)', // 100px
        'cognitive': 'var(--space-6)',               // 24px
      },
      fontSize: {
        // Typography scale
        'display-sm': ['var(--font-size-4xl)', { lineHeight: 'var(--line-height-tight)' }],
        'display-md': ['var(--font-size-6xl)', { lineHeight: 'var(--line-height-tight)' }],
        'display-lg': ['var(--font-size-8xl)', { lineHeight: 'var(--line-height-tight)' }],
        'body-adhd': ['var(--font-size-lg)', { lineHeight: 'var(--line-height-relaxed)' }],
      },
      borderRadius: {
        'coffee': 'var(--radius-lg)',
        'coffee-xl': 'var(--radius-xl)',
        'coffee-2xl': 'var(--radius-2xl)',
      },
      boxShadow: {
        'coffee-sm': 'var(--shadow-sm)',
        'coffee-md': 'var(--shadow-md)',
        'coffee-lg': 'var(--shadow-lg)',
        'focus-ring': '0 0 0 var(--focus-ring-width) var(--color-focus-ring)',
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      fontFamily: {
        'primary': 'var(--font-primary)',
        'mono': 'var(--font-mono)',
        'display': 'var(--font-display)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/container-queries'),
  ],
};

export default config;
```

### 3. Update Global CSS

Update `app/globals.css`:

```css
/* Import design system files */
@import url('./design-system-core.css');
@import url('./brand-system.css');
@import url('./component-library.css');

@tailwind base;
@tailwind components;
@tailwind utilities;

/* Base styles */
html {
  font-family: var(--font-primary);
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
}

body {
  background-color: var(--color-background);
  color: var(--color-text-primary);
  min-height: 100vh;
}

/* Enhanced focus styles for better usability */
@layer utilities {
  .focus-adhd {
    @apply focus:outline-none focus:shadow-focus-ring;
  }
  
  .text-adhd {
    @apply text-body-adhd text-coffee-primary-900;
  }
  
  .touch-target-adhd {
    @apply min-h-touch-md min-w-touch-md;
  }
}

/* Component layer utilities */
@layer components {
  .btn-coffee-primary {
    @apply bg-coffee-primary-500 hover:bg-coffee-primary-600 
           text-white font-medium rounded-coffee
           min-h-touch-md px-6 py-3
           transition-all duration-200
           focus-adhd
           active:scale-95;
  }
  
  .btn-coffee-emergency {
    @apply bg-coffee-error text-white font-bold
           min-h-touch-xl px-8 py-4 
           rounded-coffee-xl text-lg
           shadow-coffee-lg hover:shadow-coffee-xl
           focus:shadow-[0_0_0_6px_rgba(239,68,68,0.5)]
           transform hover:scale-105 active:scale-100
           transition-all duration-200;
  }
  
  .card-coffee {
    @apply bg-white border-2 border-gray-200 
           rounded-coffee-xl shadow-coffee-sm
           hover:border-coffee-primary-300 hover:shadow-coffee-md
           transform hover:-translate-y-1
           transition-all duration-300;
  }
  
  .timer-display-coffee {
    @apply flex flex-col items-center justify-center
           p-8 bg-gradient-to-br from-white to-gray-50
           border-3 border-gray-200 rounded-coffee-2xl
           shadow-coffee-lg;
  }
}
```

## 🧩 React Component Examples

### 1. Theme Provider Component

Create `components/theme-provider.tsx`:

```tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'classic' | 'contrast' | 'focus' | 'energizing';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themes: { name: Theme; label: string; preview: string }[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('classic');
  const [mounted, setMounted] = useState(false);

  const themes = [
    { 
      name: 'classic' as Theme, 
      label: 'Classic Coffee', 
      preview: 'linear-gradient(45deg, #c8794a, #f2c179)' 
    },
    { 
      name: 'contrast' as Theme, 
      label: 'High Contrast', 
      preview: 'linear-gradient(45deg, #000000, #ffffff)' 
    },
    { 
      name: 'focus' as Theme, 
      label: 'Cool Focus', 
      preview: 'linear-gradient(45deg, #0ea5e9, #22c55e)' 
    },
    { 
      name: 'energizing' as Theme, 
      label: 'Energizing', 
      preview: 'linear-gradient(45deg, #f97316, #14b8a6)' 
    },
  ];

  useEffect(() => {
    setMounted(true);
    // Load saved theme
    const savedTheme = localStorage.getItem('coffee-tracker-theme') as Theme;
    if (savedTheme && themes.some(t => t.name === savedTheme)) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      document.body.dataset.theme = theme;
      localStorage.setItem('coffee-tracker-theme', theme);
    }
  }, [theme, mounted]);

  if (!mounted) {
    return <div>{children}</div>;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

### 2. Button Component with Variants

Create `components/ui/button.tsx`:

```tsx
import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // Base styles
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 focus-adhd disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "btn-coffee-primary",
        secondary: "bg-white text-coffee-primary-900 border-2 border-gray-300 hover:bg-gray-50 hover:border-coffee-primary-500",
        emergency: "btn-coffee-emergency uppercase tracking-wide",
        success: "bg-coffee-success text-white hover:bg-green-600",
        ghost: "bg-transparent text-coffee-primary-700 hover:bg-coffee-primary-50",
      },
      size: {
        sm: "min-h-touch-sm px-4 py-2 text-sm rounded-coffee",
        default: "min-h-touch-md px-6 py-3 text-base rounded-coffee",
        lg: "min-h-touch-lg px-8 py-4 text-lg rounded-coffee-xl",
        xl: "min-h-touch-xl px-12 py-6 text-xl rounded-coffee-xl font-bold",
        "icon-only": "h-touch-md w-touch-md p-0 rounded-coffee",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  icon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, icon, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
```

### 3. Timer Display Component

Create `components/coffee/timer-display.tsx`:

```tsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type RoastPhase = 'drying' | 'first-crack' | 'development' | 'second-crack' | 'cooling';

interface TimerDisplayProps {
  startTime?: Date;
  isActive?: boolean;
  phase?: RoastPhase;
  className?: string;
  onTimeUpdate?: (elapsed: number) => void;
}

const phaseConfig = {
  drying: { label: 'Drying Phase', color: 'text-coffee-warning-600' },
  'first-crack': { label: 'First Crack', color: 'text-coffee-accent-600' },
  development: { label: 'Development Phase', color: 'text-coffee-primary-600' },
  'second-crack': { label: 'Second Crack', color: 'text-coffee-secondary-600' },
  cooling: { label: 'Cooling Phase', color: 'text-coffee-info-600' },
};

export function TimerDisplay({ 
  startTime, 
  isActive = false, 
  phase, 
  className,
  onTimeUpdate 
}: TimerDisplayProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!isActive || !startTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const elapsedMs = now.getTime() - startTime.getTime();
      const elapsedSeconds = Math.floor(elapsedMs / 1000);
      setElapsed(elapsedSeconds);
      onTimeUpdate?.(elapsedSeconds);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, startTime, onTimeUpdate]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn("timer-display-coffee", className)}>
      <motion.div 
        className={cn(
          "font-mono font-bold text-coffee-primary-900 text-center mb-2",
          "text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
          isActive && "animate-pulse"
        )}
        animate={isActive ? { scale: [1, 1.02, 1] } : { scale: 1 }}
        transition={{ duration: 2, repeat: Infinity }}
        aria-live="polite"
        aria-atomic="true"
      >
        {formatTime(elapsed)}
      </motion.div>
      
      <div className="text-lg font-medium text-coffee-primary-700 uppercase tracking-wide mb-4">
        Total Roast Time
      </div>
      
      {phase && (
        <motion.div 
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full",
            "bg-coffee-primary-100 border border-coffee-primary-300",
            "text-sm font-semibold uppercase tracking-wide",
            phaseConfig[phase].color
          )}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          key={phase}
        >
          <motion.div
            className="w-2 h-2 rounded-full bg-current"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          {phaseConfig[phase].label}
        </motion.div>
      )}
    </div>
  );
}
```

### 4. Bean Card Component

Create `components/coffee/bean-card.tsx`:

```tsx
import Image from 'next/image';
import { Star, MapPin, Play, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BeanCardProps {
  id: string;
  name: string;
  origin: string;
  farm?: string;
  process?: string;
  altitude?: string;
  roastCount?: number;
  rating?: number;
  imageUrl?: string;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onStartRoast?: (id: string) => void;
  onEdit?: (id: string) => void;
  className?: string;
}

export function BeanCard({
  id,
  name,
  origin,
  farm,
  process,
  altitude,
  roastCount = 0,
  rating = 0,
  imageUrl,
  isSelected = false,
  onSelect,
  onStartRoast,
  onEdit,
  className
}: BeanCardProps) {
  const handleCardClick = () => {
    onSelect?.(id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  return (
    <article
      className={cn(
        "card-coffee cursor-pointer focus-adhd",
        isSelected && "ring-3 ring-coffee-primary-200 border-coffee-primary-500 bg-coffee-primary-50",
        className
      )}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${name} from ${origin}`}
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-coffee-accent-200 to-coffee-accent-300 rounded-t-coffee-xl overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`${name} coffee beans`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-6xl text-coffee-accent-600">
            ☕
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-semibold text-coffee-primary-900 mb-1">
              {name}
            </h3>
            <div className="inline-flex items-center gap-1 px-3 py-1 bg-coffee-accent-100 text-coffee-accent-700 text-xs font-semibold uppercase tracking-wide rounded-full">
              <MapPin className="w-3 h-3" />
              {origin}
            </div>
          </div>
          
          {/* Rating */}
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-4 h-4",
                  i < rating ? "text-coffee-warning-500 fill-current" : "text-gray-300"
                )}
              />
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          {farm && (
            <div className="flex justify-between text-sm">
              <span className="text-coffee-primary-600 font-medium">Farm</span>
              <span className="text-coffee-primary-900 font-semibold">{farm}</span>
            </div>
          )}
          {process && (
            <div className="flex justify-between text-sm">
              <span className="text-coffee-primary-600 font-medium">Process</span>
              <span className="text-coffee-primary-900 font-semibold">{process}</span>
            </div>
          )}
          {altitude && (
            <div className="flex justify-between text-sm">
              <span className="text-coffee-primary-600 font-medium">Altitude</span>
              <span className="text-coffee-primary-900 font-semibold">{altitude}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-coffee-primary-600 font-medium">Roasted</span>
            <span className="text-coffee-primary-900 font-semibold">
              {roastCount} {roastCount === 1 ? 'time' : 'times'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="primary"
            size="sm"
            icon={<Play className="w-4 h-4" />}
            onClick={(e) => {
              e.stopPropagation();
              onStartRoast?.(id);
            }}
            className="flex-1"
          >
            Start Roast
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={<Edit className="w-4 h-4" />}
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(id);
            }}
          >
            Edit
          </Button>
        </div>
      </div>
    </article>
  );
}
```

### 5. Theme Switcher Component

Create `components/ui/theme-switcher.tsx`:

```tsx
'use client';

import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';

interface ThemeSwitcherProps {
  className?: string;
  compact?: boolean;
}

export function ThemeSwitcher({ className, compact = false }: ThemeSwitcherProps) {
  const { theme, setTheme, themes } = useTheme();

  return (
    <div 
      className={cn(
        "flex gap-2 bg-white p-2 rounded-coffee-xl border-2 border-gray-200 shadow-coffee-sm",
        compact ? "flex-col" : "flex-row",
        className
      )}
      role="group"
      aria-label="Theme selector"
    >
      {themes.map((themeOption) => (
        <button
          key={themeOption.name}
          onClick={() => setTheme(themeOption.name)}
          className={cn(
            "relative w-8 h-8 rounded-coffee border-2 transition-all duration-200 focus-adhd",
            "hover:scale-110 hover:shadow-coffee-md",
            theme === themeOption.name
              ? "border-coffee-primary-500 shadow-[0_0_0_2px_rgb(var(--color-primary-200))]"
              : "border-gray-300 hover:border-coffee-primary-400"
          )}
          style={{ background: themeOption.preview }}
          aria-label={`Switch to ${themeOption.label} theme`}
          title={themeOption.label}
        >
          {theme === themeOption.name && (
            <div className="absolute inset-0 rounded-coffee bg-white/20 backdrop-blur-sm" />
          )}
        </button>
      ))}
    </div>
  );
}
```

## 📱 Layout Components

### 1. Root Layout

Update `app/layout.tsx`:

```tsx
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-primary',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Coffee Roast Tracker',
  description: 'User-friendly coffee roasting application',
  manifest: '/manifest.json',
  themeColor: '#c8794a',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <ThemeProvider>
          <a 
            href="#main-content" 
            className="sr-only focus:not-sr-only focus:absolute focus:top-6 focus:left-6 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-coffee-primary-900 focus:rounded-coffee focus:border-2 focus:border-coffee-primary-500"
          >
            Skip to main content
          </a>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### 2. Bottom Navigation

Create `components/navigation/bottom-nav.tsx`:

```tsx
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Coffee, Package, BarChart3, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Roast', href: '/', icon: Coffee },
  { name: 'Beans', href: '/beans', icon: Package },
  { name: 'Data', href: '/data', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-gray-200 shadow-coffee-lg p-2">
      <ul className="flex justify-around items-center gap-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <li key={item.name} className="flex-1">
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 min-h-touch-md p-2 rounded-coffee text-center transition-all duration-200 focus-adhd",
                  isActive
                    ? "text-coffee-primary-600 bg-coffee-primary-100 border-2 border-coffee-primary-300"
                    : "text-gray-600 hover:text-coffee-primary-600 hover:bg-coffee-primary-50"
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="w-6 h-6 flex-shrink-0" />
                <span className="text-xs font-medium leading-none">
                  {item.name}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
```

## 🔧 Utility Functions

Create `lib/utils.ts`:

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// User experience utilities
export function announceToScreenReader(message: string) {
  const announcement = document.getElementById('screen-reader-announcements');
  if (announcement) {
    announcement.textContent = message;
  }
}

export function manageFocus(element: HTMLElement | null) {
  if (element) {
    element.focus();
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// Theme utilities
export function getThemeFromPreference(): 'classic' | 'contrast' | 'focus' | 'energizing' {
  if (typeof window === 'undefined') return 'classic';
  
  const saved = localStorage.getItem('coffee-tracker-theme');
  if (saved && ['classic', 'contrast', 'focus', 'energizing'].includes(saved)) {
    return saved as any;
  }
  
  // Check system preferences
  if (window.matchMedia('(prefers-contrast: high)').matches) {
    return 'contrast';
  }
  
  return 'classic';
}

// Auto-save utility
export function createAutoSaver(
  saveFunction: () => void | Promise<void>,
  interval: number = 30000 // 30 seconds for better UX
) {
  let timeoutId: NodeJS.Timeout;
  
  const scheduleAutoSave = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      saveFunction();
      scheduleAutoSave(); // Schedule next save
    }, interval);
  };
  
  const triggerManualSave = async () => {
    clearTimeout(timeoutId);
    await saveFunction();
    scheduleAutoSave(); // Reschedule
  };
  
  const cleanup = () => {
    clearTimeout(timeoutId);
  };
  
  // Start auto-save cycle
  scheduleAutoSave();
  
  return { triggerManualSave, cleanup };
}
```

## 🧪 Testing Setup

### Component Testing

Create `__tests__/components/button.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/button';
import { ThemeProvider } from '@/components/theme-provider';

const ButtonWithTheme = (props: any) => (
  <ThemeProvider>
    <Button {...props} />
  </ThemeProvider>
);

describe('Button Component', () => {
  it('meets accessibility requirements', async () => {
    render(<ButtonWithTheme>Test Button</ButtonWithTheme>);
    
    const button = screen.getByRole('button');
    
    // Check minimum touch target size (60px for accessibility)
    const styles = window.getComputedStyle(button);
    const minHeight = parseInt(styles.minHeight);
    expect(minHeight).toBeGreaterThanOrEqual(60);
    
    // Check focus ring visibility
    await userEvent.tab();
    expect(button).toHaveFocus();
    expect(button).toHaveClass('focus-adhd');
  });

  it('provides tactile feedback', async () => {
    const user = userEvent.setup();
    render(<ButtonWithTheme>Test Button</ButtonWithTheme>);
    
    const button = screen.getByRole('button');
    
    // Should have transform effects on hover/active
    await user.hover(button);
    expect(button).toHaveStyle('transition: all 200ms');
  });

  it('supports emergency variant with proper styling', () => {
    render(<ButtonWithTheme variant="emergency">Emergency Stop</ButtonWithTheme>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn-coffee-emergency');
    
    // Emergency buttons should have larger touch targets
    const styles = window.getComputedStyle(button);
    const minHeight = parseInt(styles.minHeight);
    expect(minHeight).toBeGreaterThanOrEqual(100);
  });
});
```

### Accessibility Testing

Create `__tests__/accessibility/a11y.test.tsx`:

```tsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { TimerDisplay } from '@/components/coffee/timer-display';
import { ThemeProvider } from '@/components/theme-provider';

expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  it('TimerDisplay has no accessibility violations', async () => {
    const { container } = render(
      <ThemeProvider>
        <TimerDisplay startTime={new Date()} isActive={true} phase="development" />
      </ThemeProvider>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('meets contrast requirements in high contrast theme', async () => {
    document.body.dataset.theme = 'contrast';
    
    const { container } = render(
      <ThemeProvider>
        <div>
          <h1 className="text-coffee-primary-900">High Contrast Heading</h1>
          <p className="text-coffee-primary-700">Body text with sufficient contrast</p>
        </div>
      </ThemeProvider>
    );

    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: true }
      }
    });
    
    expect(results).toHaveNoViolations();
  });
});
```

## 🚀 Performance Optimization

### PWA Configuration

Update `next.config.ts`:

```typescript
import type { NextConfig } from 'next';
import withPWA from '@ducanh2912/next-pwa';

const nextConfig: NextConfig = {
  // Enable Turbopack for faster development
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  
  // Optimize images for coffee beans
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Enable static exports for better performance
  output: 'standalone',
  
  // CSS optimization
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        },
      },
    },
    {
      urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-font-assets',
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
        },
      },
    },
  ],
})(nextConfig);
```

### Performance Monitoring

Create `lib/performance.ts`:

```typescript
// Performance monitoring for critical interactions
export class UserExperienceMonitor {
  private static instance: UserExperienceMonitor;
  private metrics: Map<string, number[]> = new Map();

  static getInstance() {
    if (!UserExperienceMonitor.instance) {
      UserExperienceMonitor.instance = new UserExperienceMonitor();
    }
    return UserExperienceMonitor.instance;
  }

  // Monitor critical action response times (should be < 200ms for optimal UX)
  measureInteraction(name: string, startTime: number) {
    const duration = performance.now() - startTime;
    
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    this.metrics.get(name)!.push(duration);
    
    // Alert if response time is too slow for optimal UX
    if (duration > 200) {
      console.warn(`UX Performance Warning: ${name} took ${duration.toFixed(2)}ms (should be < 200ms)`);
    }
  }

  // Monitor theme switch performance
  measureThemeSwitch() {
    const startTime = performance.now();
    
    return () => {
      this.measureInteraction('theme-switch', startTime);
    };
  }

  // Get performance report
  getReport() {
    const report: Record<string, { avg: number; max: number; count: number }> = {};
    
    for (const [name, measurements] of this.metrics) {
      const avg = measurements.reduce((a, b) => a + b, 0) / measurements.length;
      const max = Math.max(...measurements);
      
      report[name] = {
        avg: Math.round(avg * 100) / 100,
        max: Math.round(max * 100) / 100,
        count: measurements.length,
      };
    }
    
    return report;
  }
}

// Usage in components:
// const monitor = UserExperienceMonitor.getInstance();
// const endMeasurement = monitor.measureThemeSwitch();
// // ... perform theme switch
// endMeasurement();
```

## 📚 Additional Resources

### Storybook Integration

For component development and testing:

```bash
npx storybook@latest init
```

Create `.storybook/main.ts`:

```typescript
import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  stories: ['../components/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-viewport',
    '@storybook/addon-controls',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
};

export default config;
```

This comprehensive integration guide provides everything needed to implement the Coffee Roast Tracker design system in your Next.js application with full user experience optimization and accessibility support.