Please analyze the implementation plan and the mockups and/or prototypes from the `/plans` folder for the given Github Issue:
  - determine which Github Issue is being worked on by the name of the branch
  - if that cannot be done then get the Github issue from $ARGUMENTS
  - if neither can be determined then ask the user which Github Issue is being implemented
  - if no plan and/or design can be found for the Github Issue then ask the user for clarification

# CREATE
1. Use the `senior-software-engineer` subagent to work on the implementation
2. Review the implementation plan and chosen design option for this feature
3. Think hard about the changes that need to be made to accomplish the provided plan
4. Use TDD, creating unit tests that describing the outcome of the change you are about to make before writing the functionality that will cause the test to pass
5. Implement the changes in issue in small, management steps, writing elegent code, according to your plan.
6. Update the CHANGELOG.md file with the changes you made and why you made them.
7. Commit your changes after each step.

# TEST
1. Use the `qa-automation-engineer` subagent to test the changes
2. Review the changes that were made and the implementation plan and designs
3. Think hard about the what was intended to be implemented for this feature
4. Use the playwright MCP server to test the changes in the UI to ensure that the intended acceptance criteria were satisfied
5. If there are any issues that need to be addressed now provide feedback to the `senior-software-engineer` subagent to address any issues
   - if there are any issues that are ok to handle later than add notes to the implementation-log.md listing what stories should be created for future work giving enough context to help prioritize the work appropriately
6. Include Playwright tests to cover all of the behaviors added or changed in the given feature
7. Run the full test suite to ensure you haven't broken anything
8. If the tests are failing, fix them
9. Ensure that all unit tests and playwright tests are passing before moving on to the next step
10. Ensure that all lint issues are fixed and the build completes successfully

# REVIEW
1. Use the `engineering-manager` subagent to review the changes made
2. Review the implementation plan, selected design, details in the GitHub Issue, and the changes that have been made
   - Ensure that the code changes are clean readable code and DRY
   - Look for opportunities to where components should have been reused rather than duplicating logic or functionality
   - If there are any significant issues then provide feedback to the `senior-software-engineer` subagent with changes that need to be made
   - If there are any changes that can be made later then add notes to the implementation-log.md listing what stories should be created for future work giving enough context to help prioritize the work appropriately
   - Ensure that all tasks and/or acceptance criteria on the GitHub Issue then ensure that they have been satisfied. Update the GitHub Issue description checking off any tasks and acceptance criteria items that have been completed.
3. Open a PR and request a review and approval from me

Remember to use the Github CLI (`gh`) for all Github-related tasks.