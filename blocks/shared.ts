import { defineGitLabInputConfig } from "../utils/defineGitLabBlock.ts";

export const projectId = defineGitLabInputConfig({
  name: "Project ID",
  description:
    "The ID or URL-encoded path of the project (e.g., 123 or 'my-group/my-project')",
  type: "string",
  required: true,
  apiRequestFieldKey: "id",
});

export const groupId = defineGitLabInputConfig({
  name: "Group ID",
  description: "The ID or URL-encoded path of the group",
  type: "string",
  required: true,
  apiRequestFieldKey: "id",
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
