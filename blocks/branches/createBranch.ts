import {
  defineGitLabBlock,
  defineGitLabInputConfig,
} from "../../utils/defineGitLabBlock.ts";
import { projectId, commitSchema } from "../shared.ts";
import { suggestBranches } from "../../utils/suggestValues.ts";

const branch = defineGitLabInputConfig({
  name: "Branch Name",
  description: "Name of the new branch",
  type: "string",
  required: true,
  apiRequestFieldKey: "branch",
});

const ref = defineGitLabInputConfig({
  name: "Source",
  description: "Branch name or commit SHA to create the branch from",
  type: "string",
  required: true,
  apiRequestFieldKey: "ref",
  suggestValues: suggestBranches(),
});

export const createBranch = defineGitLabBlock({
  name: "Create Branch",
  description: "Create a new branch in a GitLab project",
  category: "Branches",
  url: "POST /projects/{id}/repository/branches",
  inputConfig: { projectId, branch, ref },
  outputJsonSchema: {
    type: "object" as const,
    properties: {
      name: { type: "string" as const },
      merged: { type: "boolean" as const },
      protected: { type: "boolean" as const },
      default: { type: "boolean" as const },
      webUrl: { type: "string" as const },
      commit: commitSchema,
    },
    required: ["name", "commit"],
    additionalProperties: true,
  },
});
