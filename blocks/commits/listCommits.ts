import {
  defineGitLabBlock,
  defineGitLabInputConfig,
} from "../../utils/defineGitLabBlock.ts";
import { projectId, page, perPage, commitSchema } from "../shared.ts";
import { suggestBranches } from "../../utils/suggestValues.ts";

const refName = defineGitLabInputConfig({
  name: "Ref",
  description: "Branch name, tag, or commit SHA to list commits from",
  type: "string",
  required: false,
  apiRequestFieldKey: "ref_name",
  suggestValues: suggestBranches(),
});

const since = defineGitLabInputConfig({
  name: "Since",
  description: "Only commits after this date (ISO 8601 format)",
  type: "string",
  required: false,
  apiRequestFieldKey: "since",
});

const until = defineGitLabInputConfig({
  name: "Until",
  description: "Only commits before this date (ISO 8601 format)",
  type: "string",
  required: false,
  apiRequestFieldKey: "until",
});

const path = defineGitLabInputConfig({
  name: "Path",
  description: "Filter commits by file path",
  type: "string",
  required: false,
  apiRequestFieldKey: "path",
});

export const listCommits = defineGitLabBlock({
  name: "List Commits",
  description: "List repository commits in a GitLab project",
  category: "Commits",
  url: "GET /projects/{id}/repository/commits",
  inputConfig: { projectId, refName, since, until, path, page, perPage },
  outputJsonSchema: {
    type: "array" as const,
    items: commitSchema,
  },
});
