import { defineGitLabInputConfig } from "../../utils/defineGitLabBlock.ts";

export const pipelineId = defineGitLabInputConfig({
  name: "Pipeline ID",
  description: "The ID of the pipeline",
  type: "number",
  required: true,
  apiRequestFieldKey: "pipeline_id",
});

export const pipelineDetailSchema = {
  type: "object" as const,
  properties: {
    id: { type: "number" as const },
    iid: { type: "number" as const },
    projectId: { type: "number" as const },
    sha: { type: "string" as const },
    ref: { type: "string" as const },
    status: { type: "string" as const },
    source: { type: "string" as const },
    createdAt: { type: "string" as const },
    updatedAt: { type: "string" as const },
    startedAt: { type: "string" as const },
    finishedAt: { type: "string" as const },
    committedAt: { type: "string" as const },
    duration: { type: "number" as const },
    queuedDuration: { type: "number" as const },
    coverage: { type: "string" as const },
    webUrl: { type: "string" as const },
    beforeSha: { type: "string" as const },
    tag: { type: "boolean" as const },
    yamlErrors: { type: "string" as const },
    user: {
      type: "object" as const,
      properties: {
        id: { type: "number" as const },
        username: { type: "string" as const },
        name: { type: "string" as const },
        state: { type: "string" as const },
        avatarUrl: { type: "string" as const },
        webUrl: { type: "string" as const },
      },
      additionalProperties: true,
    },
    detailedStatus: {
      type: "object" as const,
      properties: {
        icon: { type: "string" as const },
        text: { type: "string" as const },
        label: { type: "string" as const },
        group: { type: "string" as const },
        tooltip: { type: "string" as const },
        hasDetails: { type: "boolean" as const },
        detailsPath: { type: "string" as const },
        favicon: { type: "string" as const },
      },
      additionalProperties: true,
    },
  },
  required: ["id", "sha", "ref", "status", "createdAt", "webUrl"],
  additionalProperties: true,
};
