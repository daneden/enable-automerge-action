# Enable Automerge Action

This GitHub action enables automerge on pull requests opened by a specific
author (defaulting to `dependabot`).

With automerge enabled, after required checks have completed, the target pull
request will automatically be merged using the chosen merge method.

## ⚠️ Disclosure

This workflow works by leveraging a personal access token via encrypted secrets.
This means that **anyone with collaborator access to your repository** can
enable automerge for PRs via this action if it is installed on your repository.
Use with caution.

## Prerequisites

- You need to allow automerge on pull requests for your chosen repository.
  Instructions for doing so can be found in
  [GitHub’s documentation](https://docs.github.com/en/github/administering-a-repository/managing-auto-merge-for-pull-requests-in-your-repository).
- It’s also recommended that you enable branch protection rules for required
  status checks and/or requiring branches to be up-to-date before merging.
  Information about branch protection rules can be found in
  [GitHub’s documentation](https://docs.github.com/en/github/administering-a-repository/managing-a-branch-protection-rule).
- You’ll need to provide a _personal access token_ to the action rather than the
  provided `GITHUB_TOKEN` environment variable. It’s recommended that you
  [generate a personal access token](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/)
  and then
  [add it as a repository secret](https://docs.github.com/en/actions/reference/encrypted-secrets#creating-encrypted-secrets-for-a-repository).

### Why do I need to provide a PAT instead of `GITHUB_TOKEN`?</summary>

The `GITHUB_TOKEN` env variable has limited permissions and doesn’t permit
changing the automerge status of a pull request.

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
          github-token: ${{ secrets.PERSONAL_ACCESS_TOKEN }}

          # The name of the PR author to enable automerge for
          # Defaults to dependabot
          allowed-author: dependabot

          # Allowed values: MERGE | SQUASH | REBASE
          # Defaults to MERGE
          merge-method: MERGE
```

## Options

| Option           | Description                                                                                                                                        | Value(s)                                                                                                                                                                                                                                                                                                  |
| :--------------- | :------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `github-token`   | **Required.** A [personal access token](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/) for your account. | String                                                                                                                                                                                                                                                                                                    |
| `allowed-author` | The PR author username for which pull request automerge will be enabled.                                                                           | String<br/>Defaults to `dependabot`                                                                                                                                                                                                                                                                       |
| `merge-method`   | The merge strategy for automerge.                                                                                                                  | `MERGE` (default)<br/>Add all commits from the head branch to the base branch with a merge commit.<br/><br/> `SQUASH`<br/>Combine all commits from the head branch into a single commit in the base branch.<br/><br/>`REBASE`<br/>Add all commits from the head branch onto the base branch individually. |
