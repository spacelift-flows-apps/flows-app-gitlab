import { defineGitLabBlock } from "../../utils/defineGitLabBlock.ts";
import {
  projectId,
  stateFilterMr,
  labels,
  page,
  perPage,
  orderBy,
  sort,
} from "../shared.ts";
import { suggestLabels, mergeRequestListSchema } from "./shared.ts";

export const listMergeRequests = defineGitLabBlock({
  name: "List Merge Requests",
  description: "List merge requests in a GitLab project",
  category: "Merge Requests",
  url: "GET /projects/{id}/merge_requests",
  inputConfig: {
    projectId,
    stateFilterMr,
    labels: { ...labels, suggestValues: suggestLabels() },
    orderBy,
    sort,
    page,
    perPage,
  },
  outputJsonSchema: mergeRequestListSchema,
});
