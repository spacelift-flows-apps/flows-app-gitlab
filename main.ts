import { blocks as blocksApi, defineApp, kv, messaging } from "@slflows/sdk/v1";
import { randomBytes, timingSafeEqual } from "node:crypto";
import { createGitLabClient } from "./client";
import { json, error } from "./request.ts";

import { webhookSubscription } from "./blocks/webhooks/webhookSubscription.ts";
import { httpRequest } from "./blocks/request/httpRequest.ts";

async function getOrCreateWebhookSecret(): Promise<string> {
  const { value: existing } = await kv.app.get("webhookSecret");
  if (existing) return existing as string;

  const secret = randomBytes(64).toString("hex");
  await kv.app.set({ key: "webhookSecret", value: secret });
  return secret;
}

interface WebhookCreateParams {
  url: string;
  token: string;
  push_events: boolean;
  issues_events: boolean;
  merge_requests_events: boolean;
  tag_push_events: boolean;
  note_events: boolean;
  pipeline_events: boolean;
  job_events: boolean;
  deployment_events: boolean;
  releases_events: boolean;
  confidential_issues_events: boolean;
  confidential_note_events: boolean;
  wiki_page_events: boolean;
}

function buildWebhookParams(
  webhookUrl: string,
  secret: string,
): WebhookCreateParams {
  return {
    url: webhookUrl,
    token: secret,
    push_events: true,
    issues_events: true,
    merge_requests_events: true,
    tag_push_events: true,
    note_events: true,
    pipeline_events: true,
    job_events: true,
    deployment_events: true,
    releases_events: true,
    confidential_issues_events: true,
    confidential_note_events: true,
    wiki_page_events: true,
  };
}

function getWebhookApiPath(
  tokenScope: string,
  projectOrGroupPath: string | undefined,
): string {
  switch (tokenScope) {
    case "project":
      return `/projects/${encodeURIComponent(projectOrGroupPath!)}/hooks`;
    case "group":
      return `/groups/${encodeURIComponent(projectOrGroupPath!)}/hooks`;
    case "system":
      return "/hooks";
    default:
      throw new Error(`Unknown access token scope: ${tokenScope}`);
  }
}

export const app = defineApp({
  name: "GitLab",
  installationInstructions: `GitLab integration for Spacelift Flows.

To install:
1. Provide a GitLab access token (Personal, Project, or Group Access Token) with the \`api\` scope
2. Set the instance URL if using a self-hosted GitLab (defaults to gitlab.com)
3. Choose the access token scope (project, group, or system) and provide the project/group path if applicable
4. The webhook will be created automatically during setup`,

  blocks: {
    webhookSubscription,
    httpRequest,
  },

  config: {
    instanceUrl: {
      name: "GitLab Instance URL",
      description: "Your GitLab instance URL. Leave empty for gitlab.com.",
      type: "string",
      required: false,
      default: "https://gitlab.com",
    },
    accessToken: {
      name: "Access Token",
      description:
        "A GitLab access token (Personal, Project, or Group Access Token) with the api scope.",
      type: "string",
      required: true,
      sensitive: true,
    },
    tokenScope: {
      name: "Access Token Scope",
      description:
        "The scope of the access token. 'project' for a project access token, 'group' for a group access token, 'system' for a personal or admin access token. This determines where the webhook is registered.",
      type: {
        enum: ["project", "group", "system"],
      },
      required: true,
    },
    projectOrGroupPath: {
      name: "Project or Group Path",
      description:
        "The path of the project (e.g., 'my-group/my-project') or group (e.g., 'my-group'). Required for project and group scopes, ignored for system scope.",
      type: "string",
      required: false,
    },
    caCertificate: {
      name: "CA Certificate",
      description:
        "PEM-encoded CA certificate for self-hosted instances with self-signed or private certificates. Leave empty to use the system default trust store.",
      type: "string",
      required: false,
      sensitive: true,
    },
  },

  signals: {
    authenticatedUser: {
      name: "Authenticated User",
      description: "Username of the authenticated GitLab user or token owner",
    },
    instanceUrl: {
      name: "Instance URL",
      description: "The GitLab instance URL being used",
    },
  },

  http: {
    onRequest: async ({ request }) => {
      switch (request.path) {
        case "/webhook": {
          const gitlabToken = request.headers["X-Gitlab-Token"];

          const { value: storedSecret } = await kv.app.get("webhookSecret");

          if (!storedSecret || !gitlabToken) {
            return error(request.requestId, 401, "Unauthorized");
          }

          const secretBuffer = Buffer.from(storedSecret as string);
          const tokenBuffer = Buffer.from(gitlabToken);

          if (
            secretBuffer.length !== tokenBuffer.length ||
            !timingSafeEqual(secretBuffer, tokenBuffer)
          ) {
            return error(request.requestId, 401, "Unauthorized");
          }

          const eventType = request.headers["X-Gitlab-Event"] as string;

          if (!eventType) {
            return error(
              request.requestId,
              400,
              "Missing X-Gitlab-Event header",
            );
          }

          const payload = request.body;

          const listOutput = await blocksApi.list({
            typeIds: ["webhookSubscription"],
          });

          const blockIds = listOutput.blocks.map((block) => block.id);

          if (blockIds.length === 0) {
            return json(request.requestId, {
              message: "No subscription blocks found",
              eventType,
            });
          }

          await messaging.sendToBlocks({
            body: {
              headers: request.headers,
              payload,
              eventType,
            },
            blockIds,
          });

          return json(request.requestId, {
            message: "ok",
            eventType,
            blocksNotified: blockIds.length,
          });
        }
      }

      return error(request.requestId, 404, "Not found");
    },
  },

  onSync: async ({ app }) => {
    const {
      instanceUrl,
      accessToken,
      tokenScope,
      projectOrGroupPath,
      caCertificate,
    } = app.config as {
      instanceUrl?: string;
      accessToken: string;
      tokenScope: string;
      projectOrGroupPath?: string;
      caCertificate?: string;
    };

    // Validate config
    if (
      (tokenScope === "project" || tokenScope === "group") &&
      !projectOrGroupPath
    ) {
      return {
        newStatus: "failed" as const,
        customStatusDescription: `Project or group path is required for '${tokenScope}' access token scope.`,
      };
    }

    const resolvedInstanceUrl = instanceUrl || "https://gitlab.com";
    const client = createGitLabClient({
      instanceUrl,
      accessToken,
      caCertificate,
    });

    // Validate token by fetching current user
    const { data: user } = await client.get<{ username: string }>("/user");
    const authenticatedUser = user.username;

    // Generate or retrieve webhook secret
    const secret = await getOrCreateWebhookSecret();

    // Create or update webhook
    const webhookUrl = `${app.http.url}/webhook`;
    const webhookParams = buildWebhookParams(webhookUrl, secret);
    const basePath = getWebhookApiPath(tokenScope, projectOrGroupPath);
    const { value: existingWebhookId } = await kv.app.get("webhookId");

    if (existingWebhookId) {
      await client.put(
        `${basePath}/${existingWebhookId}`,
        webhookParams as unknown as Record<string, unknown>,
      );
    } else {
      const { data } = await client.post<{ id: number }>(
        basePath,
        webhookParams as unknown as Record<string, unknown>,
      );
      await kv.app.set({ key: "webhookId", value: data.id });
    }

    // Store config for onDrain
    await kv.app.set({ key: "tokenScope", value: tokenScope });
    if (projectOrGroupPath) {
      await kv.app.set({
        key: "projectOrGroupPath",
        value: projectOrGroupPath,
      });
    }

    console.log(
      `[onSync] Ready — user: ${authenticatedUser}, instance: ${resolvedInstanceUrl}`,
    );

    return {
      newStatus: "ready" as const,
      signalUpdates: {
        authenticatedUser,
        instanceUrl: resolvedInstanceUrl,
      },
    };
  },

  onDrain: async ({ app }) => {
    const { instanceUrl, accessToken, caCertificate } = app.config as {
      instanceUrl?: string;
      accessToken: string;
      caCertificate?: string;
    };

    const [
      { value: webhookId },
      { value: tokenScope },
      { value: projectOrGroupPath },
    ] = await kv.app.getMany(["webhookId", "tokenScope", "projectOrGroupPath"]);

    if (webhookId && tokenScope) {
      try {
        const client = createGitLabClient({
          instanceUrl,
          accessToken,
          caCertificate,
        });
        const basePath = getWebhookApiPath(
          tokenScope as string,
          projectOrGroupPath as string | undefined,
        );
        await client.delete(`${basePath}/${webhookId}`);
      } catch (err) {
        console.warn(`Failed to delete webhook: ${(err as Error).message}`);
      }
    }

    await kv.app.delete([
      "webhookId",
      "webhookSecret",
      "tokenScope",
      "projectOrGroupPath",
    ]);

    return {
      newStatus: "drained" as const,
    };
  },
});
