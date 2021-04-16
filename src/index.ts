import * as core from "@actions/core"
import * as github from "@actions/github"
import { PullRequestEvent } from "@octokit/webhooks-definitions/schema"

type MergeMethod = "MERGE" | "SQUASH" | "REBASE"

async function main() {
  if (github.context.eventName !== "pull_request") {
    return
  }

  const payload = github.context.payload as PullRequestEvent
  const mergeMethod = core.getInput("merge-method") as MergeMethod
  const token = core.getInput("github-token")
  const octokit = github.getOctokit(token)

  const { data: pullRequest } = await octokit.pulls.get({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    pull_number: payload.pull_request.number,
  })

  const pullId = pullRequest.node_id

  const query = `mutation {
      enablePullRequestAutoMerge(input: {
        pullRequestId: $pullId,
        mergeMethod: $mergeMethod,
      }) {
        id,
        autoMergeRequest {
          enabledAt
        }
      }
    }`

  const {
    enablePullRequestAutoMerge: {
      pullRequest: {
        autoMergeRequest: { enabledAt },
      },
    },
  } = await octokit.graphql(query, {
    pullId,
    mergeMethod,
    headers: {
      authorization: `token ${token}`,
    },
  })

  core.info(`${enabledAt as string}`)
}

try {
  main()
} catch (error) {
  core.setFailed(error.message)
}
