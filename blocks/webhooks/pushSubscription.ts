import { events } from "@slflows/sdk/v1";
import { convertKeysToCamelCase } from "../../utils/convertKeysToCamelCase.ts";
import { defineGitLabBlock } from "../../utils/defineGitLabBlock.ts";
import {
  project,
  branchFilter,
  webhookProjectSchema,
  commitSchema,
} from "./shared.ts";

export const pushSubscription = defineGitLabBlock({
  name: "On Push",
  description: "Subscribes to push events in a GitLab project",
  category: "Subscriptions",
  entrypoint: true,
  outputJsonSchema: {
    type: "object",
    properties: {
      objectKind: { type: "string" },
      eventName: { type: "string" },
      ref: {
        type: "string",
        description: "The full ref (e.g., refs/heads/main)",
      },
      refProtected: { type: "boolean" },
      before: { type: "string", description: "SHA before the push" },
      after: { type: "string", description: "SHA after the push" },
      checkoutSha: { type: "string" },
      userId: { type: "number" },
      userName: { type: "string" },
      userUsername: { type: "string" },
      userEmail: { type: "string" },
      userAvatar: { type: "string" },
      project: webhookProjectSchema,
      commits: {
        type: "array",
        items: {
          ...commitSchema,
          properties: {
            ...commitSchema.properties,
            url: { type: "string" as const },
            timestamp: { type: "string" as const },
            added: {
              type: "array" as const,
              items: { type: "string" as const },
            },
            modified: {
              type: "array" as const,
              items: { type: "string" as const },
            },
            removed: {
              type: "array" as const,
              items: { type: "string" as const },
            },
          },
        },
      },
      totalCommitsCount: { type: "number" },
    },
    required: ["objectKind", "ref", "before", "after", "project"],
    additionalProperties: true,
  },
  staticConfig: {
    project,
    branch: branchFilter,
    includeTags: {
      name: "Include Tags",
      description: "Whether to include tag pushes as well as branch pushes.",
      type: "boolean",
      required: false,
    },
  },
  onInternalMessage: async (input) => {
    const payload = input.message.body.payload;
    const { project, branch, includeTags } = input.block.config;

    if (project && payload.project?.path_with_namespace !== project) {
      return;
    }

    const ref = payload.ref as string;
    const isTag = ref.startsWith("refs/tags/");
    const isBranch = ref.startsWith("refs/heads/");

    if (isTag && !includeTags) {
      return;
    }

    if (branch && isBranch) {
      const branchName = ref.replace("refs/heads/", "");
      if (branchName !== branch) {
        return;
      }
    }

    await events.emit(convertKeysToCamelCase(payload) as Record<string, any>);
  },
});
