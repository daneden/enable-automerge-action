import * as core from "@actions/core"
import * as github from "@actions/github"
import { PullRequestEvent } from "@octokit/webhooks-definitions/schema"

type MergeMethod = "MERGE" | "SQUASH" | "REBASE"

interface EnablePullRequestAutoMergeResponse {
  enablePullRequestAutoMerge: {
    pullRequest: {
      autoMergeRequest: { enabledAt: Date }
    }
  }
}

async function main() {
  if (github.context.eventName !== "pull_request") {
    return
  }

  const payload = github.context.payload as PullRequestEvent
  const mergeMethod = core.getInput("merge-method") as MergeMethod
  const token = core.getInput("github-token")
  const allowedAuthor = core.getInput("allowed-author")
  const octokit = github.getOctokit(token)

  const { data: pullRequest } = await octokit.pulls.get({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    pull_number: payload.pull_request.number,
  })

  if (pullRequest.user.login !== allowedAuthor) {
    core.info(
      `Found PR author ${pullRequest.user.login} but only ${allowedAuthor} is allowed to enable automerge via this action; ending workflow.`
    )
    return
  }

  const pullId = pullRequest.node_id

  const query = `mutation enableAutoMerge($pullId: ID!, $mergeMethod: PullRequestMergeMethod) {
      enablePullRequestAutoMerge(input: {
        pullRequestId: $pullId,
        mergeMethod: $mergeMethod,
      }) {
        pullRequest {
          id,
          autoMergeRequest {
            enabledAt
          }
        }
      }
    }`

  const data = await octokit
    .graphql(query, {
      pullId,
      mergeMethod,
      headers: {
        authorization: `token ${token}`,
      },
    })
    .then((d) => d)
    .catch((error) => {
      core.error(error)
    })

  if (!data) {
    core.error(JSON.stringify(data))
  }

  const {
    enablePullRequestAutoMerge: {
      pullRequest: {
        autoMergeRequest: { enabledAt },
      },
    },
  } = data as EnablePullRequestAutoMergeResponse

  core.info(
    `Automerge for #${pullRequest.number} “${pullRequest.title}” by ${pullRequest.user.login} enabled at ${enabledAt}`
  )
}

try {
  main()
} catch (error) {
  core.setFailed(error.message)
}
