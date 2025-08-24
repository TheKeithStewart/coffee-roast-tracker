# Claude Code Workflow System

This directory contains a comprehensive development workflow system designed for Next.js/Django applications, implementing a 19-step process with specialized agent personas.

## Directory Structure

```
.claude/
├── agents/                  # Agent persona definitions
│   ├── system-architect.md      # Technical planning and architecture
│   ├── ux-designer.md           # User experience design and prototyping
│   ├── staff-ux-designer.md     # Design review and quality assurance
│   ├── frontend-engineer.md     # Next.js/React implementation
│   ├── backend-engineer.md      # Django/Python implementation
│   └── engineering-manager.md   # Code review and standards enforcement
└── commands/               # Workflow command scripts
    ├── design-phase.md          # Execute UI/UX design phase
    ├── implementation-phase.md  # Manage TDD implementation phase
    └── delivery-phase.md        # Handle PR creation and final review
```

## Workflow Overview

### 19-Step Development Process

**Phase 1: Planning & Analysis (Steps 1-5)**
1. Issue analysis and requirement extraction
2. Technical understanding and constraint identification
3. System Architect creates comprehensive technical plan
4. Engineering Manager reviews technical approach
5. Plan iteration until approval achieved

**Phase 2: Design (Steps 6-10)** - *If UI changes required*
6. Senior UX Designer creates multiple design options
7. Staff UX Designer reviews and provides feedback
8. Design iteration until quality standards met
9. Stakeholder presentation and design selection
10. Design finalization and implementation preparation

**Phase 3: Implementation (Steps 11-16)**
11. Engineer assignment based on technical requirements
12. Test-driven development with comprehensive coverage
13. Implementation documentation and changelog updates
14. Quality assurance with automated and manual testing
15. Engineering Manager comprehensive code review
16. Implementation iteration until approval achieved

**Phase 4: Delivery (Steps 17-19)**
17. Pull request creation with comprehensive documentation
18. CI pipeline monitoring and issue resolution
19. Stakeholder final review and merge coordination

## Agent Personas

### System Architect
- **Role**: Technical planning and architecture decisions
- **Expertise**: Full-stack architecture, database design, API design, security, performance
- **Deliverables**: Comprehensive technical plans with implementation guidance
- **Quality Focus**: Scalability, maintainability, security, technical feasibility

### Senior UX Designer  
- **Role**: User experience design and prototyping
- **Expertise**: UX design, accessibility (WCAG 2.1 AA), responsive design, design systems
- **Deliverables**: Multiple design options with detailed specifications
- **Quality Focus**: User needs, accessibility compliance, design system consistency

### Staff UX Designer
- **Role**: Design review and quality assurance
- **Expertise**: Advanced UX strategy, design governance, quality assurance
- **Deliverables**: Comprehensive design review feedback and approval decisions
- **Quality Focus**: Design standards, accessibility, cross-platform consistency

### Frontend Engineer
- **Role**: Next.js/React implementation and frontend architecture
- **Expertise**: Next.js, React, TypeScript, performance optimization, accessibility implementation
- **Deliverables**: Production-ready frontend code with comprehensive tests
- **Quality Focus**: Performance, accessibility, code quality, user experience

### Backend Engineer
- **Role**: Django/Python implementation and backend architecture
- **Expertise**: Django, DRF, Python, database design, API implementation, security
- **Deliverables**: Production-ready backend code with comprehensive tests
- **Quality Focus**: Security, performance, data integrity, API design

### Engineering Manager
- **Role**: Code review and engineering standards enforcement
- **Expertise**: Code quality, technical leadership, risk assessment, team coordination
- **Deliverables**: Comprehensive code review feedback and approval decisions
- **Quality Focus**: Maintainability, standards compliance, technical debt management

## Quality Gates

### Technical Plan Approval
- [ ] Architecture is sound and scalable
- [ ] Security considerations adequately addressed
- [ ] Performance implications analyzed and optimized
- [ ] Implementation approach is technically feasible
- [ ] Timeline estimates are realistic and achievable
- [ ] All technical risks identified with mitigation strategies

### Design Approval (if applicable)
- [ ] User needs effectively addressed through design solutions
- [ ] WCAG 2.1 AA accessibility compliance verified
- [ ] Design system consistency maintained across components
- [ ] Multiple design options provided for stakeholder selection
- [ ] Technical feasibility confirmed with implementation team
- [ ] Responsive design strategy defined for all breakpoints

### Implementation Approval
- [ ] Test coverage of 90%+ achieved with meaningful tests
- [ ] All automated quality checks passing (linting, type checking, builds)
- [ ] Cross-browser compatibility verified across supported browsers
- [ ] WCAG 2.1 AA accessibility compliance implemented and tested
- [ ] Performance benchmarks met with Core Web Vitals optimization
- [ ] Security audit passed with no critical vulnerabilities
- [ ] Code review approved by Engineering Manager

### Delivery Approval
- [ ] Pull request created with comprehensive documentation
- [ ] All CI pipeline checks passing consistently
- [ ] Testing instructions provided for stakeholder verification
- [ ] Risk assessment completed with deployment considerations
- [ ] Stakeholder review requested with appropriate context

## Usage Instructions

### Starting a New Workflow
```
"Start the development workflow for GitHub issue #123"
```
or
```
"I have this feature requirement: [description]. Please start the development workflow."
```

### Workflow Commands
- **design-phase**: Executes design creation and review (if UI changes)
- **implementation-phase**: Manages TDD implementation with quality assurance
- **delivery-phase**: Handles PR creation, CI resolution, and final review

### Agent Coordination
The workflow system automatically:
- Spawns appropriate agents based on phase requirements
- Provides comprehensive context and deliverables from previous phases
- Ensures quality gates are met before phase transitions
- Manages iteration cycles until approval criteria satisfied
- Coordinates communication between agents and stakeholders

## Integration with Project

### Document Templates
Located in `/templates/` directory:
- `technical-plan-template.md` - Comprehensive technical planning structure
- `design-document-template.md` - Multi-option design documentation
- `implementation-log-template.md` - Implementation progress tracking
- `review-feedback-template.md` - Structured review and feedback format

### Working Documents
Created in `/scratchpads/` directory:
- `{issue-number}-technical-plan.md` - Technical planning and architecture
- `{issue-number}-designs.md` - Design options and specifications
- `{issue-number}-implementation-log.md` - Implementation progress and decisions
- `{issue-number}-review-feedback.md` - Review feedback and iterations

### Project Integration
The workflow system integrates with:
- **Next.js frontend**: Component development, testing, performance optimization
- **Django backend**: API development, database design, security implementation
- **GitHub Issues**: Issue tracking and requirement management
- **Pull Requests**: Code review, CI/CD integration, deployment coordination
- **Quality Tools**: ESLint, TypeScript, Jest, Playwright, Django testing framework

## Configuration

### Workflow Configuration
Managed in `config/workflow-config.json`:
- Agent definitions and capabilities
- Phase structure and quality gates
- Template mappings and file structure
- Command definitions and execution parameters

### Customization
The system can be customized by:
- Modifying agent persona definitions in `/agents/` directory
- Adjusting quality gates and success criteria
- Adding new workflow commands and utilities
- Extending template structures for specific project needs
- Integrating additional quality assurance tools and processes

## Success Metrics

### Workflow Efficiency
- **Planning Phase**: Average time from issue to approved technical plan
- **Design Phase**: Average time from design start to stakeholder selection
- **Implementation Phase**: Average time from start to code review approval
- **Delivery Phase**: Average time from PR creation to merge

### Quality Metrics
- **First-Pass Success Rate**: Percentage of phases completed without iteration
- **Test Coverage**: Average coverage across all implementations (target: 90%+)
- **Accessibility Compliance**: Percentage meeting WCAG 2.1 AA standards (target: 100%)
- **Performance Standards**: Core Web Vitals and API response time benchmarks

### Team Collaboration
- **Agent Coordination**: Effective handoff and communication between personas
- **Documentation Quality**: Completeness and accuracy of workflow documents
- **Stakeholder Satisfaction**: Approval rates and feedback quality
- **Knowledge Transfer**: Documentation effectiveness for future maintenance

This workflow system ensures consistent, high-quality development processes while maintaining efficiency and stakeholder satisfaction throughout the entire development lifecycle.