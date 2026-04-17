import {
  defineGitLabBlock,
  defineGitLabInputConfig,
} from "../../utils/defineGitLabBlock.ts";
import { projectId, page, perPage, commitSchema } from "../shared.ts";

const search = defineGitLabInputConfig({
  name: "Search",
  description: "Filter branches by name (supports regex)",
  type: "string",
  required: false,
  apiRequestFieldKey: "search",
});

const branchSchema = {
  type: "object" as const,
  properties: {
    name: { type: "string" as const },
    merged: { type: "boolean" as const },
    protected: { type: "boolean" as const },
    default: { type: "boolean" as const },
    developersCanPush: { type: "boolean" as const },
    developersCanMerge: { type: "boolean" as const },
    canPush: { type: "boolean" as const },
    webUrl: { type: "string" as const },
    commit: commitSchema,
  },
  required: ["name"],
  additionalProperties: true,
};

export const listBranches = defineGitLabBlock({
  name: "List Branches",
  description: "List repository branches in a GitLab project",
  category: "Branches",
  url: "GET /projects/{id}/repository/branches",
  inputConfig: { projectId, search, page, perPage },
  outputJsonSchema: {
    type: "array" as const,
    items: branchSchema,
  },
});
