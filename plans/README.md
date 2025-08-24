# Plans Directory

This directory contains issue-specific planning and design documents organized by GitHub issue.

## Structure

Each GitHub issue gets its own subdirectory named after the issue:

```
plans/
├── issue-123-user-authentication/
│   ├── technical-plan.md
│   ├── designs.md
│   ├── implementation-log.md
│   ├── review-feedback.md
│   └── assets/
│       ├── mockups/
│       ├── wireframes/
│       └── prototypes/
└── issue-456-dashboard-redesign/
    ├── technical-plan.md
    ├── designs.md
    ├── implementation-log.md
    ├── review-feedback.md
    └── assets/
        ├── mockups/
        ├── wireframes/
        └── prototypes/
```

## File Types

### Core Documents
- **technical-plan.md** - Technical plans created by System Architect
- **designs.md** - Design documents created by UX Designer
- **implementation-log.md** - Implementation notes and progress tracking
- **review-feedback.md** - Review feedback from various personas

### Asset Organization
- **assets/mockups/** - High-fidelity design mockups and visual designs
- **assets/wireframes/** - Low-fidelity wireframes and user flow diagrams
- **assets/prototypes/** - Interactive prototype files and specifications

## Naming Convention

Directory names follow the pattern: `issue-{number}-{short-description}`

Examples:
- `issue-123-user-authentication`
- `issue-456-dashboard-redesign` 
- `issue-789-api-optimization`

## File Lifecycle

1. **Created** during workflow execution by respective personas
2. **Updated** through iteration cycles based on feedback
3. **Finalized** when all stakeholders approve
4. **Archived** after feature completion (moved to `archived/{year}/{quarter}/` subdirectories)

## Access Pattern

- Each document is owned by the persona that created it
- Other personas can read and comment but not directly modify
- Updates happen through the review and feedback process
- Final approval comes from designated reviewers

## Retention Policy

- **Active issues**: Keep in main plans directory
- **Completed issues**: Move to `archived/{year}/{quarter}/` subdirectories
- **Reference documents**: Maintain for 1 year after completion