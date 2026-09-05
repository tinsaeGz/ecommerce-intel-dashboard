# Integration and production branch protection

The intended `dev` and `main` policy is stored in `branch-protection.json`:

- changes arrive through a pull request; `main` accepts only `dev`;
- the stable `ci-gate` job verifies every affected subsystem passed on the latest commit;
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

gh api \
  --method PUT \
  repos/backostech/ecommerce-intel-dashboard/branches/dev/protection \
  --input .github/branch-protection.json
```

GitHub Free supports protected branches and repository rulesets for public repositories. Protecting a private repository requires GitHub Pro, Team, or Enterprise. Keep the repository private; do not change visibility merely to activate this policy.

The API currently returns HTTP 403 requesting a plan upgrade for this private
repository. This JSON file has **not** installed protection. GitHub's green
“no conflicts” message only describes mergeability, not test success. Do not
merge while `ci-gate` is absent or unsuccessful. The plan restriction is
separate from the Actions startup failure; it does not establish its cause.
