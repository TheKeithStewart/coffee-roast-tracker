# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

Coffee Roast Tracker - a coffee roasting tracking application built with Next.js.

- **Root**: Contains project-level configuration
- **frontend/**: Next.js application using App Router
  - Uses TypeScript, TailwindCSS v4, and modern React (v19)
  - PWA-enabled with @ducanh2912/next-pwa
  - Form handling with react-hook-form and Zod validation
  - Charts with Chart.js/react-chartjs-2
  - UI components with Radix UI and Framer Motion animations

## Development Commands

All commands should be run from the `frontend/` directory:

```bash
# Start development server (with Turbopack)
npm run dev

# Build for production (with Turbopack)
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

## Architecture

- **Next.js 15.5.0** with App Router and Turbopack enabled
- **TypeScript** with strict configuration
- **TailwindCSS v4** with PostCSS configuration
- **PWA Support** configured but not yet fully implemented
- **Component Library**: Radix UI primitives for accessible components
- **Charts**: Chart.js integration for data visualization
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion for smooth transitions

## Key Dependencies

- React 19.1.0 with modern concurrent features
- Next.js 15.5.0 with Turbopack bundler
- TailwindCSS v4 for styling
- TypeScript for type safety
- Radix UI for accessible primitives
- Chart.js for data visualization
- React Hook Form + Zod for form handling

## Path Aliases

- `@/*` maps to `./` (relative to frontend directory)

## Development Notes

- The project is in early stages with default Next.js structure
- PWA configuration is present but may need additional setup
- Uses Turbopack for faster builds and development
- ESLint configured with Next.js and TypeScript rules

## Development Workflow

This project uses a comprehensive agent-based development workflow that covers the entire product lifecycle from requirements analysis to feature delivery.

### File Organization

```
/
├── .claude/                 # Claude Code workflow system
│   ├── agents/             # Agent persona definitions
│   │   ├── product-manager.md
│   │   ├── system-architect.md
│   │   ├── ux-designer.md
│   │   ├── staff-ux-designer.md
│   │   ├── senior-software-engineer.md
│   │   ├── qa-automation-engineer.md
│   │   └── engineering-manager.md
│   └── commands/           # Workflow command scripts
│       ├── backlog-planning.md
│       ├── design-phase.md
│       ├── implementation-phase.md
│       ├── delivery-phase.md
│       ├── workflow-status.md
│       └── workflow-utils.md
├── templates/               # Document templates
│   ├── technical-plan-template.md
│   ├── design-document-template.md
│   ├── implementation-log-template.md
│   └── review-feedback-template.md
├── scratchpads/            # Working documents for active issues
│   ├── {issue-number}-technical-plan.md
│   ├── {issue-number}-designs.md
│   ├── {issue-number}-implementation-log.md
│   └── {issue-number}-review-feedback.md
├── frontend/               # Next.js application
└── backend/                # Django application
```

### Quality Standards

- **Code Quality**: ESLint/Prettier (frontend), Black/flake8 (backend), TypeScript strict mode
- **Testing**: 90%+ test coverage with unit, integration, and E2E tests
- **Accessibility**: WCAG 2.1 AA compliance for all UI components
- **Performance**: Core Web Vitals optimization and API response benchmarks
- **Security**: OWASP compliance with comprehensive input validation

## Claude Code Workflow System

This project includes a comprehensive `.claude/` directory structure that defines the development workflow system:

### Agent System
- **Specialized Agents**: 7 persona-based agents with specific roles and capabilities
- **Agent Configuration**: Detailed agent definitions in `.claude/agents/` directory
- **Slash Commands for Workflow**: Commands that kick off the different phases of the implementation workflow

### Workflow Commands
- **backlog-planning**: Analyze requirements and create structured GitHub Issues with epics and user stories
- **design-phase**: Execute UI/UX design creation and review process
- **implementation-phase**: Manage TDD implementation with quality assurance
- **delivery-phase**: Handle PR creation, CI resolution, and final review

### Agent Capabilities
- **Product Manager**: User story creation, backlog management, requirements analysis, stakeholder coordination
- **System Architect**: Technical planning, architecture decisions, risk assessment
- **Senior UX Designer**: User experience design, prototyping, accessibility compliance
- **Staff UX Designer**: Design review, quality assurance, standards enforcement
- **Senior Software Engineer**: Full-stack implementation (Next.js/React frontend, Django/Python backend), testing, performance optimization
- **QA Automation Engineer**: Playwright E2E testing, test automation strategy, accessibility and performance validation
- **Engineering Manager**: Code review, quality standards, technical leadership

The workflow system coordinates these agents to ensure comprehensive planning, design, implementation, and delivery with consistent quality standards.