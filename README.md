# Enable Automerge Action

This GitHub action enables automerge on pull requests opened by a specific
author (defaulting to `dependabot`).

With automerge enabled, after required checks have completed, the target pull
request will automatically be merged using the chosen merge method.

## Prerequisites

- You need to allow automerge on pull requests for your chosen repository.
  Instructions for doing so can be found in
  [GitHub’s documentation](https://docs.github.com/en/github/administering-a-repository/managing-auto-merge-for-pull-requests-in-your-repository).
- It’s also recommended that you enable branch protection rules for required
  status checks and/or requiring branches to be up-to-date before merging.
  Information about branch protection rules can be found in
  [GitHub’s documentation](https://docs.github.com/en/github/administering-a-repository/managing-a-branch-protection-rule).
- You need to provide the action’s `github-token` option with a _personal access
  token_ rather than the `GITHUB_TOKEN` environment variable. See
  [Authentication](#authentication) for details.

## Usage

Configure this action to run on the `pull_request` event. Here’s an example
`workflow.yml`:

```yaml
name: Enable automerge on dependabot PRs

on:
  # See note below about using pull_request_target
  pull_request_target:

jobs:
  automerge:
    name: Enable automerge on dependabot PRs
    runs-on: ubuntu-latest
    steps:
      - name: Enable automerge on dependabot PRs
        uses: daneden/enable-automerge-action@v1
        with:
          # A personal access token that you have generated and saved in the
          # repo or org’s encrypted secrets
          github-token: ${{ secrets.PERSONAL_ACCESS_TOKEN }}

          # The name of the PR author to enable automerge for
          # Defaults to dependabot[bot]
          allowed-author: "dependabot[bot]"

          # Allowed values: MERGE | SQUASH | REBASE
          # Defaults to MERGE
          merge-method: MERGE
```

**⚠️ Warning:** Using the `pull_request_target` event runs the action with
read/write repository access from the pull request’s base branch. You should
make sure that you only specify trusted PR authors in the action config.

The `pull_request_target` event is specifically required for Dependabot PRs
because of the
[limited permissions granted to Dependabot by default](https://github.blog/changelog/2021-02-19-github-actions-workflows-triggered-by-dependabot-prs-will-run-with-read-only-permissions/).

## Authentication

You will need to
[generate a personal access token](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token)
and
[store it in repository or organisation secrets](https://docs.github.com/en/actions/reference/encrypted-secrets)
to pass as the `github-token` value for this action to run.

The reason why you can’t use the standard `GITHUB_TOKEN` env variable is that
this workflow requires a specific user with write access on the repository to
act on behalf of.

## Options

| Option           | Description                                                              | Value(s)                                                                                                                                                                                                                                                                                                  |
| :--------------- | :----------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `github-token`   | **Required.** The action’s authentication token.                         | String                                                                                                                                                                                                                                                                                                    |
| `allowed-author` | The PR author username for which pull request automerge will be enabled. | String<br/>Defaults to `dependabot[bot]`                                                                                                                                                                                                                                                                  |
| `merge-method`   | The merge strategy for automerge.                                        | `MERGE` (default)<br/>Add all commits from the head branch to the base branch with a merge commit.<br/><br/> `SQUASH`<br/>Combine all commits from the head branch into a single commit in the base branch.<br/><br/>`REBASE`<br/>Add all commits from the head branch onto the base branch individually. |
