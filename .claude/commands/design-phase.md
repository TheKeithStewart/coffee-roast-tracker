Please analyze and fix the GitHub Issue: $ARGUMENTS.

# PLAN
1. Use the `system-architect` subagent to work on the technical design for the feature
2. Use `gh issue view` to get the issue details
3. Understand the problem described in the issue
4. Ask clarifying questions if necessary
5. Understand the existing features that are related to what you are about to implement
  - Search for previous plans related to the issue in `/plans`
  - Search PRs to see if you can find history on this issue
  - Search the codebase for relevant files
6. Think harder about how to break the issue down into a series of small, manageable tasks.
7. Create a new branch for the issue named after the Github Issue being implemented
8. Document your plan in a new issue folder.
  - create a new folder in `/plans` named `issue-{number}-{short-description}`
  - use the `technical-plan-template.md` file as a template for `technical-plan.md`
  - include a link to the issue in the technical plan.
  - describe any tests that you will write and the behavior that they will cover.
9. Use the `engineering-manager` subagent to review the changes and give feedback
  - Reference the technical plan that contains the plan and give the second agent this prompt: "My developer wrote this plan. Give me feedback on the plan. Are there any improvements you would make? Are there any architectural changes we should make?".
  - Iterate on the implementation plan until the `system-architect` and `engineering-manager` subagents feel it is ready to move onto the UX phase.

# UX
1. Use the `ux-designer` subagent to create mockups and/or prototypes of the UI for the feature to be developed.
2. Read and understand the technical implementation plan
3. Think hard about what the best UX would be for this feature
4. Consider the existing UX and design system in use for the application
5. Create mockups and prototypes in the issue's assets folder
  - create mockups in `/plans/issue-{number}-{description}/assets/mockups/`
  - create wireframes in `/plans/issue-{number}-{description}/assets/wireframes/` 
  - create prototypes in `/plans/issue-{number}-{description}/assets/prototypes/`
  - create at least 3 options to be selected
6. Use the `design-document-template.md` file as a template to create `designs.md` in the issue folder
  - identify any existing components that should be reused for this feature
  - identify any new components that should be created for this feature
7. Use the `staff-ux-designer` subagent to review your designs and give feedback
8. Iterate on the designs until both the `ux-designer` and the `staff-ux-designer` subagents feel it is solid
9. Use the `engineering-manager` subagent to review the designs and check for technical feasibility and determine if there are any adjustments needed to the technical plan based on the designs
10. Ask me to review and give feedback on the technical plan and design options
  - if I give feedback then use the `system-architect` subagent to iterate on the technical plan and the `ux-designer` subagent to iterate on the designs based on my feedback
11. Once I have approved the plan and have chosen which design option to go with then update the designs.md with the chosen option

Remember to use the Github CLI (`gh`) for all Github-related tasks.

After all plans and designs have been agreed upon then commit your changes.