Please analyze the requirements and create a structured backlog for: $ARGUMENTS

Work with the `product-manager` subagent to understand your needs, break them down into actionable epics and/or stories, and create properly structured GitHub Issues.

# ANALYZE
1. Use the `product-manager` subagent to analyze the provided requirements
   - Review all provided information about what needs to be implemented
   - Identify the core business objectives and user needs
   - Understand the scope and complexity of the requested functionality
   - Consider the current application architecture and existing features
   - Analyze potential technical constraints and dependencies

# CLARIFY
1. The `product-manager` subagent should ask targeted follow-up questions to gather missing details. For example:
   - Who are the target users and what are their specific needs?
   - What are the key business goals and success metrics?
   - Are there any technical constraints or integration requirements?
   - What is the expected timeline and priority level?
   - Are there any compliance, security, or performance requirements?
   - How does this relate to existing features in the application?
   - What are the acceptance criteria for considering this complete?

2. Wait for user responses to clarifying questions before proceeding
3. Continue iterating on questions until the `product-manager` subagent has sufficient clarity

# BREAKDOWN
1. Use the `product-manager` subagent to break down requirements into structured deliverables:
   - Identify major feature areas that could become epics
   - Break down epics into specific, actionable user stories
   - Ensure each story follows the "As a [user], I want [functionality], so that [benefit]" format
   - Define comprehensive acceptance criteria for each story
   - Estimate relative complexity and effort for each story
   - Identify dependencies between stories and technical prerequisites
   - Consider integration points with existing application features

2. Create a hierarchical structure:
   - **Epics**: Large feature areas that span multiple sprints
   - **User Stories**: Specific, testable functionality that can be completed in one sprint
   - **Tasks**: Technical implementation details within stories (if needed)

# PRIORITIZE
1. The `product-manager` subagent will prioritize the backlog items:
   - Apply MoSCoW prioritization (Must have, Should have, Could have, Won't have)
   - Consider business value, user impact, and technical complexity
   - Identify MVP (Minimum Viable Product) scope for initial release
   - Plan logical delivery sequence based on dependencies
   - Align priorities with business objectives and resource constraints

# PROPOSE
1. Present the structured backlog to the user:
   - **Executive Summary**: High-level overview of what will be delivered
   - **Epic Breakdown**: Major feature areas with business rationale
   - **User Stories**: Detailed stories with acceptance criteria and estimates
   - **Priority Levels**: Clear prioritization with delivery sequence
   - **Dependencies**: Technical and business dependencies identified
   - **Success Metrics**: How success will be measured for each epic/story

2. Ask for user feedback and approval:
   - Review the proposed epic and story breakdown
   - Confirm priorities and delivery sequence
   - Address any missing requirements or concerns
   - Get approval to proceed with GitHub Issue creation

# CREATE
1. Once approved, use the `product-manager` subagent to create GitHub Issues:
   - Create epic issues with comprehensive descriptions and linked stories
   - Create individual user story issues with detailed acceptance criteria
   - Apply appropriate labels (epic, story, priority levels, feature areas)
   - Set up project milestones if delivery phases are defined
   - Link related issues and establish dependency relationships
   - Add issues to appropriate GitHub project boards if configured

2. Use GitHub CLI commands for issue creation:
   - `gh issue create` with comprehensive templates
   - Apply consistent labeling and categorization
   - Set appropriate assignees and milestones
   - Link issues using GitHub's issue linking syntax

3. Provide final summary:
   - **Issues Created**: List of all GitHub issues created with links
   - **Project Structure**: How the backlog is organized in GitHub
   - **Next Steps**: Recommended approach for beginning development
   - **Backlog Management**: Ongoing maintenance and refinement recommendations

## Quality Standards

**Epic Requirements:**
- Clear business value proposition and user impact description
- Comprehensive scope definition with included and excluded functionality
- Success metrics and validation criteria for epic completion
- Technical architecture considerations and integration requirements
- Realistic timeline estimates with dependency identification

**User Story Requirements:**
- Standard user story format with persona, functionality, and benefit
- Specific, measurable, achievable, relevant, time-bound (SMART) acceptance criteria
- Technical implementation notes and architectural considerations
- Test scenarios covering positive, negative, and edge cases
- Estimation guidance for development planning and sprint capacity

**GitHub Issue Standards:**
- Comprehensive issue descriptions with context and requirements
- Consistent labeling and categorization for workflow integration
- Proper linking between related issues and dependencies
- Milestone assignment for delivery planning and tracking
- Clear acceptance criteria that enable confident development and testing

## Success Indicators

**Requirements Analysis Complete:**
- All business objectives and user needs clearly understood
- Technical constraints and integration requirements identified
- Success metrics and validation criteria established
- Stakeholder questions and concerns addressed

**Backlog Structure Ready:**
- Epics and stories properly sized for development workflow
- Clear prioritization with business value justification
- Dependencies identified with resolution strategies
- Comprehensive acceptance criteria for all deliverables

**GitHub Issues Created:**
- All epics and stories represented as GitHub issues
- Proper organization with labels, milestones, and relationships
- Development team ready to begin sprint planning
- Stakeholder visibility into delivery roadmap and priorities

Remember to use the GitHub CLI (`gh`) for all GitHub-related tasks and maintain clear communication with stakeholders throughout the planning process.