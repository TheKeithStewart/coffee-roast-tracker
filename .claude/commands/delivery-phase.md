Review changes on the given PR and prepare it for merging
  - determine which Github Pull Request is being worked on by the name of the branch
  - if that cannot be done then ask the user for clarification

# REVIEW
1. Review the comments on the PR
2. Determine if there are any other stories that should be added to the backlog based on the comments and add notes to the implementation plan listing what stories should be created for future work giving enough context to help prioritize the work appropriately

# VERIFY
1. Verify that the PR has received an approval
2. Check that all required CI checks have passed using `gh pr view --json statusCheckRollup`
3. If any checks are pending wait for completion
4. If any checks in the CI fail, have the `senior-software-engineer` subagent address the issues, commit the changes, and push the changes to the PR

# MERGE
1. Once the PR has been approved and all CI checks are passing you can merge the PR
2. Merge the PR using `gh pr merge --squash --delete-branch` (uses squash merge and deletes remote branch)
3. Verify the merge was successful

# CLEANUP
1. Switch to the main branch using `git checkout main` (or `git checkout master` if main doesn't exist)
2. Fetch the latest changes using `git fetch origin`  
3. Pull the latest changes using `git pull origin main` (or master)
4. Delete the local feature branch using `git branch -d <branch-name>`
5. Confirm all cleanup steps completed successfully

# ADD FOLLOW-UPS TO BACKLOG
1. Use the `product-manager` subagent to review the implementation plan for what was just implemented to look for any follow up items that were identified
2. Think hard about the items that were listed and determine which ones should be added to the backlog and which ones are not needed
3. Determine what the priority level should be for the backlog items
4. Provide details to the user about the backlog items that are going to be created and ask if Github Issues should be created
5. If the user approves the backlog items then create Github Issues for each of the items setting the approprite priority level for each

Remember to use the GitHub CLI (`gh`) for all GitHub-related tasks and provide colored output for better user experience.