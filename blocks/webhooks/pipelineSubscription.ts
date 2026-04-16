import { events } from "@slflows/sdk/v1";
import { convertKeysToCamelCase } from "../../utils/convertKeysToCamelCase.ts";
import { defineGitLabBlock } from "../../utils/defineGitLabBlock.ts";
import {
  project,
  branchFilter,
  userSchema,
  webhookProjectSchema,
  commitSchema,
} from "./shared.ts";

export const pipelineSubscription = defineGitLabBlock({
  name: "On Pipeline",
  description:
    "Subscribes to pipeline events (success, failed, pending, etc.) in a GitLab project",
  category: "Subscriptions",
  entrypoint: true,
  outputJsonSchema: {
    type: "object",
    properties: {
      objectKind: { type: "string" },
      user: userSchema,
      project: webhookProjectSchema,
      commit: commitSchema,
      objectAttributes: {
        type: "object",
        properties: {
          id: { type: "number" },
          iid: { type: "number" },
          name: { type: "string" },
          ref: { type: "string" },
          sha: { type: "string" },
          status: { type: "string" },
          detailedStatus: { type: "string" },
          source: { type: "string" },
          stages: { type: "array", items: { type: "string" } },
          duration: { type: "number" },
          queuedDuration: { type: "number" },
          createdAt: { type: "string" },
          finishedAt: { type: "string" },
          url: { type: "string" },
        },
        required: ["id", "ref", "sha", "status"],
        additionalProperties: true,
      },
      mergeRequest: { type: "object", additionalProperties: true },
      builds: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "number" },
            stage: { type: "string" },
            name: { type: "string" },
            status: { type: "string" },
            createdAt: { type: "string" },
            startedAt: { type: "string" },
            finishedAt: { type: "string" },
            duration: { type: "number" },
            queuedDuration: { type: "number" },
            allowFailure: { type: "boolean" },
            user: userSchema,
          },
          additionalProperties: true,
        },
      },
    },
    required: ["objectKind", "objectAttributes", "project"],
    additionalProperties: true,
  },
  staticConfig: {
    project,
    status: {
      name: "Status",
      description: "Filter by pipeline status. Leave empty for all statuses.",
      type: "string",
      required: false,
      suggestValues: async (input) => {
        const statuses = [
          "success",
          "failed",
          "canceled",
          "running",
          "pending",
          "created",
          "skipped",
          "manual",
        ];
        let values = statuses.map((s) => ({ label: s, value: s }));
        if (input.searchPhrase) {
          const lower = input.searchPhrase.toLowerCase();
          values = values.filter((v) => v.label.includes(lower));
        }
        return { suggestedValues: values };
      },
    },
    ref: branchFilter,
  },
  onInternalMessage: async (input) => {
    const payload = input.message.body.payload;
    const { project, status, ref } = input.block.config;

    if (project && payload.project?.path_with_namespace !== project) {
      return;
    }

    if (status && payload.object_attributes?.status !== status) {
      return;
    }

    if (ref && payload.object_attributes?.ref !== ref) {
      return;
    }

    await events.emit(convertKeysToCamelCase(payload) as Record<string, any>);
  },
});
