# Enable Auto-Merge Action

This GitHub action enables automerge on pull requests opened by a specific
author (defaulting to `dependabot`).

## Prerequisites

- You need to allow automerge on pull requests for your chosen repository.
  Instructions for doing so can be found in
  [GitHub’s documentation](https://docs.github.com/en/github/administering-a-repository/managing-auto-merge-for-pull-requests-in-your-repository).

## Usage

Configure this action to run on the `pull_request` event. Here’s an example
`workflow.yml`:

```yaml
name: Enable automerge on dependabot PRs

on:
  pull_request:

jobs:
  merge-me:
    name: Enable automerge on dependabot PRs
    runs-on: ubuntu-latest
    steps:
      - name: Enable automerge on dependabot PRs
        uses: daneden/enable-automerge-action@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}

          # The name of the PR author to enable automerge for
          # Defaults to dependabot
          allowed-author: dependabot

          # Allowed values: MERGE | SQUASH | REBASE
          # Defaults to MERGE
          merge-method: MERGE
```

## Options

| Option           | Description                                                              | Value(s)                                                                                                                                                                                                                                                                                                  |
| :--------------- | :----------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `github-token`   | **Required.** The action’s authentication token.                         | String                                                                                                                                                                                                                                                                                                    |
| `allowed-author` | The PR author username for which pull request automerge will be enabled. | String<br/>Defaults to `dependabot`                                                                                                                                                                                                                                                                       |
| `merge-method`   | The merge strategy for automerge.                                        | `MERGE` (default)<br/>Add all commits from the head branch to the base branch with a merge commit.<br/><br/> `SQUASH`<br/>Combine all commits from the head branch into a single commit in the base branch.<br/><br/>`REBASE`<br/>Add all commits from the head branch onto the base branch individually. |
