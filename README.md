# GitLab App for Spacelift Flows

A Flows app that integrates with GitLab. Works with both gitlab.com and self-hosted instances.

## What it does

Provides blocks for working with GitLab resources and reacting to GitLab events:

- **Issues** - create, read, update, list, and manage comments
- **Merge Requests** - create, review, approve, merge, and manage comments
- **Branches** - list and create branches
- **Commits** - list and inspect commits
- **Files** - read, create, update, and delete repository files
- **Pipelines** - list, trigger, and retry pipelines
- **Subscriptions** - react to pushes, issues, merge requests, notes, and pipeline events
- **HTTP/GraphQL** - escape hatches for any API endpoint not covered above

## Setup

The app needs a GitLab access token with the `api` scope. This can be a Personal Access Token, a Project Access Token,
or a Group Access Token.

Configuration fields:

| Field                 | Required                 | Description                                               |
|-----------------------|--------------------------|-----------------------------------------------------------|
| Instance URL          | No                       | Defaults to `https://gitlab.com`                          |
| Access Token          | Yes                      | Token with `api` scope                                    |
| Access Token Scope    | Yes                      | `project`, `group`, or `system`                           |
| Project or Group Path | For project/group scopes | e.g. `my-group/my-project`                                |
| CA Certificate        | No                       | PEM cert for self-hosted instances with self-signed certs |

The app automatically creates a webhook during setup. It validates the token, generates a webhook secret, and registers
the webhook on the project, group, or system depending on the token scope. The webhook is cleaned up when the app is
uninstalled.