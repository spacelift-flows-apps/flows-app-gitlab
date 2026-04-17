import { events } from "@slflows/sdk/v1";
import { convertKeysToCamelCase } from "../../utils/convertKeysToCamelCase.ts";
import { defineGitLabBlock } from "../../utils/defineGitLabBlock.ts";
import { project, userSchema, webhookProjectSchema } from "./shared.ts";

export const noteSubscription = defineGitLabBlock({
  name: "On Note",
  description:
    "Subscribes to comment/note events on issues, merge requests, commits, or snippets",
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
          note: { type: "string" },
          noteableType: { type: "string" },
          noteableId: { type: "number" },
          authorId: { type: "number" },
          action: { type: "string" },
          url: { type: "string" },
          createdAt: { type: "string" },
          updatedAt: { type: "string" },
          type: { type: "string" },
        },
        required: ["id", "note", "noteableType"],
        additionalProperties: true,
      },
      issue: { type: "object", additionalProperties: true },
      mergeRequest: { type: "object", additionalProperties: true },
      commit: { type: "object", additionalProperties: true },
      snippet: { type: "object", additionalProperties: true },
    },
    required: ["objectKind", "objectAttributes", "project"],
    additionalProperties: true,
  },
  staticConfig: {
    project,
    noteableType: {
      name: "Noteable Type",
      description:
        "Filter by the type of object being commented on. Leave empty for all types.",
      type: "string",
      required: false,
      suggestValues: async (input) => {
        const types = ["Issue", "MergeRequest", "Commit", "Snippet"];
        let values = types.map((t) => ({ label: t, value: t }));
        if (input.searchPhrase) {
          const lower = input.searchPhrase.toLowerCase();
          values = values.filter((v) => v.label.toLowerCase().includes(lower));
        }
        return { suggestedValues: values };
      },
    },
  },
  onInternalMessage: async (input) => {
    const payload = input.message.body.payload;
    const { project, noteableType } = input.block.config;

    if (project && payload.project?.path_with_namespace !== project) {
      return;
    }

    if (
      noteableType &&
      payload.object_attributes?.noteable_type !== noteableType
    ) {
      return;
    }

    await events.emit(convertKeysToCamelCase(payload) as Record<string, any>);
  },
});
