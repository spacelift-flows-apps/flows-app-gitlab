import { defineGitLabBlock } from "../../utils/defineGitLabBlock.ts";
import {
  projectId,
  stateFilter,
  labels,
  page,
  perPage,
  orderBy,
  sort,
} from "../shared.ts";
import { suggestLabels, issueListSchema } from "./shared.ts";

export const listIssues = defineGitLabBlock({
  name: "List Issues",
  description: "List issues in a GitLab project",
  category: "Issues",
  url: "GET /projects/{id}/issues",
  inputConfig: {
    projectId,
    stateFilter,
    labels: { ...labels, suggestValues: suggestLabels() },
    orderBy,
    sort,
    page,
    perPage,
  },
  outputJsonSchema: issueListSchema,
});
