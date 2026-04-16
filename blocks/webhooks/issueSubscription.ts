import { events } from "@slflows/sdk/v1";
import { convertKeysToCamelCase } from "../../utils/convertKeysToCamelCase.ts";
import { defineGitLabBlock } from "../../utils/defineGitLabBlock.ts";
import {
  project,
  labels,
  userSchema,
  webhookProjectSchema,
  webhookLabelSchema,
} from "./shared.ts";

export const issueSubscription = defineGitLabBlock({
  name: "On Issue",
  description:
    "Subscribes to issue events (opened, closed, updated, etc.) in a GitLab project",
  category: "Subscriptions",
  entrypoint: true,
  outputJsonSchema: {
    type: "object",
    properties: {
      objectKind: { type: "string" },
      eventType: { type: "string" },
      user: userSchema,
      project: webhookProjectSchema,
      objectAttributes: {
        type: "object",
        properties: {
          id: { type: "number" },
          iid: { type: "number" },
          title: { type: "string" },
          description: { type: "string" },
          state: { type: "string" },
          action: { type: "string" },
          severity: { type: "string" },
          confidential: { type: "boolean" },
          url: { type: "string" },
          dueDate: { type: "string" },
          createdAt: { type: "string" },
          updatedAt: { type: "string" },
          closedAt: { type: "string" },
        },
        required: ["id", "iid", "title", "state", "action"],
        additionalProperties: true,
      },
      assignees: { type: "array", items: userSchema },
      labels: { type: "array", items: webhookLabelSchema },
      changes: { type: "object", additionalProperties: true },
    },
    required: ["objectKind", "objectAttributes", "project"],
    additionalProperties: true,
  },
  staticConfig: {
    project,
    action: {
      name: "Action",
      description: "Filter by action type. Leave empty for all actions.",
      type: "string",
      required: false,
      suggestValues: async (input) => {
        const actions = ["open", "close", "reopen", "update"];
        let values = actions.map((a) => ({ label: a, value: a }));
        if (input.searchPhrase) {
          const lower = input.searchPhrase.toLowerCase();
          values = values.filter((v) => v.label.includes(lower));
        }
        return { suggestedValues: values };
      },
    },
    labels,
  },
  onInternalMessage: async (input) => {
    const payload = input.message.body.payload;
    const { project, action, labels } = input.block.config;

    if (project && payload.project?.path_with_namespace !== project) {
      return;
    }

    if (action && payload.object_attributes?.action !== action) {
      return;
    }

    if (labels) {
      const filterLabels = (labels as string)
        .split(",")
        .map((l: string) => l.trim())
        .filter(Boolean);
      if (filterLabels.length > 0) {
        const eventLabels = (payload.labels || []).map(
          (l: { title: string }) => l.title,
        );
        const hasMatch = filterLabels.some((l: string) =>
          eventLabels.includes(l),
        );
        if (!hasMatch) {
          return;
        }
      }
    }

    await events.emit(convertKeysToCamelCase(payload) as Record<string, any>);
  },
});
