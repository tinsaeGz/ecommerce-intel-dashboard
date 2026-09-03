# Main branch protection

The intended `main` policy is stored in `branch-protection.json`:

- changes arrive through a pull request from `dev`;
- CI branch-policy, API quality, and client/package quality checks pass on the latest commit;
- the branch is current before merge;
- one approval is required and stale approvals are dismissed;
- the final push is approved by someone other than its author;
- conversations are resolved and history remains linear;
- administrators follow the same rules;
- force pushes and deletion are blocked.

Apply the policy after the repository plan supports protected private branches:

```sh
gh api \
  --method PUT \
  repos/backostech/ecommerce-intel-dashboard/branches/main/protection \
  --input .github/branch-protection.json
```

GitHub Free supports protected branches and repository rulesets for public repositories. Protecting a private repository requires GitHub Pro, Team, or Enterprise. Keep the repository private; do not change visibility merely to activate this policy.
