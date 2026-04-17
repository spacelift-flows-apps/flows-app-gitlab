import {
  defineGitLabBlock,
  defineGitLabInputConfig,
} from "../../utils/defineGitLabBlock.ts";
import { projectId, commitSchema } from "../shared.ts";

const sha = defineGitLabInputConfig({
  name: "SHA",
  description: "Commit SHA, branch name, or tag name",
  type: "string",
  required: true,
  apiRequestFieldKey: "sha",
});

export const getCommit = defineGitLabBlock({
  name: "Get Commit",
  description: "Get a single commit from a GitLab project",
  category: "Commits",
  url: "GET /projects/{id}/repository/commits/{sha}",
  inputConfig: { projectId, sha },
  outputJsonSchema: {
    ...commitSchema,
    properties: {
      ...commitSchema.properties,
      stats: {
        type: "object" as const,
        properties: {
          additions: { type: "number" as const },
          deletions: { type: "number" as const },
          total: { type: "number" as const },
        },
        additionalProperties: true,
      },
      status: { type: "string" as const },
      lastPipeline: {
        type: "object" as const,
        properties: {
          id: { type: "number" as const },
          sha: { type: "string" as const },
          ref: { type: "string" as const },
          status: { type: "string" as const },
          webUrl: { type: "string" as const },
        },
        additionalProperties: true,
      },
    },
    required: [...commitSchema.required, "webUrl"],
  },
});
