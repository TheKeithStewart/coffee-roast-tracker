# Authentication UI/UX Wireframes - User Story #18

## Overview
**UPDATED DESIGN APPROACH**: Following staff designer review, consolidated from three to two distinctly different authentication approaches with clear use case scenarios.

Two design approaches for ADHD-friendly authentication, each optimized for different user preferences and cognitive patterns:
- **Option 1**: Progressive Disclosure (ADHD-Optimized) - For guided, step-by-step experiences
- **Option 2**: Unified Interface (Efficiency-Focused) - For streamlined, single-screen experiences

---

## Option 1: Progressive Disclosure Authentication (ADHD-Optimized)

**When to Use**: ADHD users, first-time users, complex registration, mobile-first experiences, high-security contexts requiring careful attention.

### Registration Flow Wireframes

```
┌─────────────────────────────────────────────────┐
│                  STEP 1 OF 3                    │
│            ●──●──○  Get Started                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │     Coffee Roast Tracker               │    │
│  │     Let's create your account          │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  Email Address                                  │
│  ┌─────────────────────────────────────────┐    │
│  │  your@email.com                        │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │           CONTINUE →                    │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│         Already have an account? Sign In        │
│                                                 │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│                  STEP 2 OF 3                    │
│            ●──●──○  Secure Password             │
├─────────────────────────────────────────────────┤
│                                                 │
│  ← Back                                         │
│                                                 │
│  Choose a Strong Password                       │
│  ┌─────────────────────────────────────────┐    │
│  │  ••••••••••••••••                      │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  ✓ At least 8 characters                       │
│  ✓ One uppercase letter                        │
│  ○ One number                                   │
│  ○ One special character                        │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │           CONTINUE →                    │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│                  STEP 3 OF 3                    │
│            ●──●──●  Almost Ready                │
├─────────────────────────────────────────────────┤
│                                                 │
│  ← Back                                         │
│                                                 │
│  Your Name (Optional)                           │
│  ┌─────────────────────────────────────────┐    │
│  │  First Name                            │    │
│  └─────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────┐    │
│  │  Last Name                             │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  ☑ I agree to the Terms of Service             │
│  ☑ Send me helpful roasting tips               │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │        CREATE MY ACCOUNT                │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Login Flow Wireframes

```
┌─────────────────────────────────────────────────┐
│               WELCOME BACK                      │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │     Coffee Roast Tracker               │    │
│  │     Sign in to continue                │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  Email Address                                  │
│  ┌─────────────────────────────────────────┐    │
│  │  your@email.com                        │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  Password                                       │
│  ┌─────────────────────────────────────────┐    │
│  │  ••••••••••••••••                      │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  ☑ Keep me signed in                           │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │              SIGN IN                    │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│         Forgot password? | Create account       │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Option 2: Unified Authentication Interface (Efficiency-Focused)

**When to Use**: Returning users, B2B contexts, desktop-first experiences, simple registration, users preferring streamlined experiences.

### Tabbed Interface Wireframes

```
┌─────────────────────────────────────────────────┐
│          SIGN IN  │  CREATE ACCOUNT             │
│          ────────────────────────               │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │     Coffee Roast Tracker               │    │
│  │     Welcome to your roasting journey   │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  Email Address                                  │
│  ┌─────────────────────────────────────────┐    │
│  │  your@email.com                        │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  Password                                       │
│  ┌─────────────────────────────────────────┐    │
│  │  ••••••••••••••••                      │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  ☑ Keep me signed in                           │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │              SIGN IN                    │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│              Forgot password?                   │
│                                                 │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│            SIGN IN  │  CREATE ACCOUNT           │
│                     ───────────────────────     │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │     Coffee Roast Tracker               │    │
│  │     Start your roasting journey        │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  Email Address                                  │
│  ┌─────────────────────────────────────────┐    │
│  │  your@email.com                        │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  Password                                       │
│  ┌─────────────────────────────────────────┐    │
│  │  Choose a strong password              │    │
│  └─────────────────────────────────────────┘    │
│  ✓ At least 8 characters                       │
│  ○ One uppercase letter                        │
│                                                 │
│  Name (Optional)                                │
│  ┌─────────────────────────────────────────┐    │
│  │  What should we call you?              │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │          CREATE ACCOUNT                 │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Decision Framework Integration

### When to Use Progressive Disclosure (Option 1):
✅ ADHD-friendly experiences requiring reduced cognitive load  
✅ Mobile-first applications with limited screen space  
✅ Complex registration flows with multiple validation steps  
✅ First-time users unfamiliar with the platform  
✅ High-security contexts requiring careful step-by-step attention  

### When to Use Unified Interface (Option 2):
✅ Efficiency-focused experiences for returning users  
✅ Desktop applications with ample screen space  
✅ B2B contexts where speed is prioritized  
✅ Simple registration with minimal required fields  
✅ Users who explicitly prefer streamlined experiences  

**Implementation Note**: Both options maintain the same security standards and ADHD-friendly principles, differing only in information architecture and interaction patterns.

### Password Reset Flow

```
┌─────────────────────────────────────────────────┐
│                RESET PASSWORD                   │
├─────────────────────────────────────────────────┤
│                                                 │
│  ← Back to Sign In                              │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │     Forgot your password?               │    │
│  │     No worries, we'll help you reset   │    │
│  │     it securely.                       │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  Email Address                                  │
│  ┌─────────────────────────────────────────┐    │
│  │  Enter your registered email           │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │         SEND RESET LINK                 │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  🔒 We'll send a secure reset link to your     │
│      email. Check your inbox in a few minutes. │
│                                                 │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│              EMAIL SENT SUCCESSFULLY             │
├─────────────────────────────────────────────────┤
│                                                 │
│               ✅ Check Your Email               │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │   We sent a password reset link to:    │    │
│  │            your@email.com               │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  Click the link in the email to create a new   │
│  password. The link expires in 1 hour for      │
│  security.                                      │
│                                                 │
│  📧 Didn't receive the email?                   │
│  • Check your spam folder                      │
│  • Make sure you entered the correct email     │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │           RESEND EMAIL                  │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│              Return to Sign In                  │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Mobile Responsive Wireframes

### Mobile Authentication (< 768px)

```
┌─────────────────────┐
│  Coffee Roast       │
│  Tracker            │
│                     │
│ ●──○──○ Step 1 of 3 │
│                     │
│ Get Started         │
│                     │
│ Email Address       │
│ ┌─────────────────┐ │
│ │your@email.com   │ │
│ └─────────────────┘ │
│                     │
│ ┌─────────────────┐ │
│ │   CONTINUE →    │ │
│ └─────────────────┘ │
│                     │
│ Already have an     │
│ account? Sign In    │
│                     │
│ ──────────────────  │
│ Theme: Classic ▼    │
│ ──────────────────  │
└─────────────────────┘
```

### Tablet Authentication (768px - 1024px)

```
┌───────────────────────────────────────────┐
│           Coffee Roast Tracker            │
│                                           │
│       ●──○──○  Step 1 of 3               │
│                                           │
│  ┌─────────────────┐ ┌─────────────────┐  │
│  │ Get Started     │ │ Why Sign Up?    │  │
│  │                 │ │                 │  │
│  │ Email Address   │ │ ✓ Save roasts   │  │
│  │ ┌─────────────┐ │ │ ✓ Track progress│  │
│  │ │your@email.co│ │ │ ✓ Get insights  │  │
│  │ └─────────────┘ │ │ ✓ Join community│  │
│  │                 │ │                 │  │
│  │ ┌─────────────┐ │ │                 │  │
│  │ │ CONTINUE →  │ │ │                 │  │
│  │ └─────────────┘ │ │                 │  │
│  │                 │ │                 │  │
│  │ Already have    │ │                 │  │
│  │ account? Sign In│ │                 │  │
│  └─────────────────┘ └─────────────────┘  │
│                                           │
└───────────────────────────────────────────┘
```

## Error States & Validation

### Form Validation Wireframes

```
┌─────────────────────────────────────────────────┐
│                  STEP 1 OF 3                    │
│            ●──●──○  Get Started                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  Email Address                                  │
│  ┌─────────────────────────────────────────┐    │
│  │  invalid-email                         │ ❌  │
│  └─────────────────────────────────────────┘    │
│  ⚠️ Please enter a valid email address          │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │           CONTINUE →                    │    │
│  └─────────────────────────────────────────┘    │
│  (Button disabled until valid email)            │
│                                                 │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│                  STEP 2 OF 3                    │
│            ●──●──○  Secure Password             │
├─────────────────────────────────────────────────┤
│                                                 │
│  Choose a Strong Password                       │
│  ┌─────────────────────────────────────────┐    │
│  │  weak123                               │ ⚠️   │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  ✓ At least 8 characters                       │
│  ❌ One uppercase letter                       │
│  ❌ One number                                  │
│  ❌ One special character                       │
│                                                 │
│  💡 Try: "MyRoast2024!"                        │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │           CONTINUE →                    │    │
│  └─────────────────────────────────────────┘    │
│  (Button enabled when password is strong)       │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Network Error States

```
┌─────────────────────────────────────────────────┐
│               ⚠️ CONNECTION ISSUE               │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │         Unable to Sign In               │    │
│  │                                         │    │
│  │    Please check your internet          │    │
│  │    connection and try again.           │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │             TRY AGAIN                   │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │          WORK OFFLINE                   │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  💡 You can still browse saved roasts while    │
│     offline. Your data will sync when you      │
│     reconnect.                                  │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Accessibility Features

### Screen Reader Landmarks

```
┌─────────────────────────────────────────────────┐
│ <header> Coffee Roast Tracker                   │
│ <nav> Skip to main content                      │
├─────────────────────────────────────────────────┤
│ <main>                                          │
│   <section aria-labelledby="step-heading">      │
│     <h1 id="step-heading">Step 1 of 3</h1>     │
│     <form aria-label="Account registration">    │
│       <fieldset>                               │
│         <legend>Get Started</legend>           │
│         <label for="email">Email Address</label│
│         <input id="email" type="email"         │
│                aria-describedby="email-help">  │
│         <p id="email-help">We'll never share   │
│            your email</p>                      │
│         <button type="submit">Continue</button>│
│       </fieldset>                              │
│     </form>                                    │
│   </section>                                   │
│ </main>                                         │
├─────────────────────────────────────────────────┤
│ <footer> Already have account? Sign in          │
└─────────────────────────────────────────────────┘
```

### Keyboard Navigation Flow

```
Tab Order:
1. Skip Link (hidden until focused)
2. Step Progress Indicator (focusable for context)
3. Back Button (if present)
4. Email Input Field
5. Continue Button
6. "Already have account?" Link
7. Theme Switcher (if present)

Focus Indicators:
• 4px solid focus ring using theme focus colors
• High contrast focus indicators
• Focus moves logically through form elements
• Focus trapped within modal dialogs
```

---

## Design Rationale

### ADHD-Friendly Considerations (Both Options)

1. **Reduced Cognitive Load**: Either through step-by-step progression or streamlined single-screen design
2. **Clear Visual Hierarchy**: Important elements stand out with appropriate sizing and spacing
3. **Immediate Feedback**: Real-time validation helps maintain engagement across both approaches
4. **Large Touch Targets**: 60px minimum reduces motor precision requirements
5. **Consistent Patterns**: Same interaction patterns within chosen approach
6. **Error Recovery**: Clear, actionable error messages with constructive solutions
7. **User Control**: Choice between approaches allows users to select their preferred interaction style

### Security UX Balance

1. **Transparency**: Security measures are visible but not overwhelming
2. **Education**: Users learn about security benefits without friction
3. **Trust Building**: Progress indicators and confirmations build confidence
4. **Clear Communication**: Security errors explained in plain language

### Cross-Platform Consistency

1. **Responsive Design**: Layouts adapt gracefully across devices
2. **Touch-Friendly**: All interactions work well on mobile devices
3. **Progressive Enhancement**: Core functionality works without JavaScript
4. **Browser Compatibility**: Consistent experience across major browsers