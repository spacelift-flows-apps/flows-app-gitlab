import { defineGitLabInputConfig } from "../utils/defineGitLabBlock.ts";
import { suggestProjects, suggestIssues } from "../utils/suggestValues.ts";

export const projectId = defineGitLabInputConfig({
  name: "Project",
  description:
    "The ID or URL-encoded path of the project (e.g., 123 or 'my-group/my-project')",
  type: "string",
  required: true,
  apiRequestFieldKey: "id",
  suggestValues: suggestProjects(),
});

export const groupId = defineGitLabInputConfig({
  name: "Group ID",
  description: "The ID or URL-encoded path of the group",
  type: "string",
  required: true,
  apiRequestFieldKey: "id",
});

export const issueIid = defineGitLabInputConfig({
  name: "Issue",
  description: "The internal ID of the issue within the project",
  type: "number",
  required: true,
  apiRequestFieldKey: "issue_iid",
  suggestValues: suggestIssues(),
});

export const mergeRequestIid = defineGitLabInputConfig({
  name: "Merge Request IID",
  description: "The internal ID of the merge request within the project",
  type: "number",
  required: true,
  apiRequestFieldKey: "merge_request_iid",
});

export const noteId = defineGitLabInputConfig({
  name: "Note ID",
  description: "The ID of the note (comment)",
  type: "number",
  required: true,
  apiRequestFieldKey: "note_id",
});

export const page = defineGitLabInputConfig({
  name: "Page",
  description: "Page number for paginated results (default: 1)",
  type: "number",
  required: false,
  apiRequestFieldKey: "page",
});

export const perPage = defineGitLabInputConfig({
  name: "Per Page",
  description: "Number of results per page (default: 20, max: 100)",
  type: "number",
  required: false,
  apiRequestFieldKey: "per_page",
});

export const stateFilter = defineGitLabInputConfig({
  name: "State",
  description: "Filter by state",
  type: { enum: ["opened", "closed", "all"] },
  required: false,
  apiRequestFieldKey: "state",
});

export const stateFilterMr = defineGitLabInputConfig({
  name: "State",
  description: "Filter by state",
  type: { enum: ["opened", "closed", "merged", "locked", "all"] },
  required: false,
  apiRequestFieldKey: "state",
});

export const orderBy = defineGitLabInputConfig({
  name: "Order By",
  description: "Order results by field",
  type: { enum: ["created_at", "updated_at"] },
  required: false,
  apiRequestFieldKey: "order_by",
});

export const sort = defineGitLabInputConfig({
  name: "Sort",
  description: "Sort direction",
  type: { enum: ["asc", "desc"] },
  required: false,
  apiRequestFieldKey: "sort",
});

export const labels = defineGitLabInputConfig({
  name: "Labels",
  description: "Comma-separated label names",
  type: "string",
  required: false,
  apiRequestFieldKey: "labels",
});
