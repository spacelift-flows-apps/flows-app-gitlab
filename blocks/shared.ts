import { defineGitLabInputConfig } from "../utils/defineGitLabBlock.ts";
import {
  suggestProjects,
  suggestIssues,
  suggestMergeRequests,
  suggestBranches,
} from "../utils/suggestValues.ts";

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
  name: "Merge Request",
  description: "The internal ID of the merge request within the project",
  type: "number",
  required: true,
  apiRequestFieldKey: "merge_request_iid",
  suggestValues: suggestMergeRequests(),
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

export const branch = defineGitLabInputConfig({
  name: "Branch",
  description: "Branch name to operate on",
  type: "string",
  required: true,
  apiRequestFieldKey: "branch",
  suggestValues: suggestBranches(),
});

export const ref = defineGitLabInputConfig({
  name: "Ref",
  description:
    "Branch name, tag, or commit SHA (defaults to the default branch)",
  type: "string",
  required: false,
  suggestValues: suggestBranches(),
});

export const commitMessage = defineGitLabInputConfig({
  name: "Commit Message",
  description: "Commit message for the file operation",
  type: "string",
  required: true,
  apiRequestFieldKey: "commit_message",
});

export const authorName = defineGitLabInputConfig({
  name: "Author Name",
  description: "Override the commit author name",
  type: "string",
  required: false,
  apiRequestFieldKey: "author_name",
});

export const authorEmail = defineGitLabInputConfig({
  name: "Author Email",
  description: "Override the commit author email",
  type: "string",
  required: false,
  apiRequestFieldKey: "author_email",
});

// Shared output schemas

export const userSchema = {
  type: "object" as const,
  properties: {
    id: { type: "number" as const },
    username: { type: "string" as const },
    name: { type: "string" as const },
    state: { type: "string" as const },
    locked: { type: "boolean" as const },
    avatarUrl: { type: "string" as const },
    webUrl: { type: "string" as const },
    publicEmail: { type: "string" as const },
  },
  additionalProperties: true,
};

export const milestoneSchema = {
  type: "object" as const,
  properties: {
    id: { type: "number" as const },
    iid: { type: "number" as const },
    title: { type: "string" as const },
    description: { type: "string" as const },
    state: { type: "string" as const },
    dueDate: { type: "string" as const },
  },
  additionalProperties: true,
};

export const noteSchema = {
  type: "object" as const,
  properties: {
    id: { type: "number" as const },
    body: { type: "string" as const },
    author: userSchema,
    createdAt: { type: "string" as const },
    updatedAt: { type: "string" as const },
    system: { type: "boolean" as const },
    noteableId: { type: "number" as const },
    noteableType: { type: "string" as const },
    noteableIid: { type: "number" as const },
    internal: { type: "boolean" as const },
    confidential: { type: "boolean" as const },
  },
  required: ["id", "body", "author", "createdAt", "updatedAt"],
  additionalProperties: true,
};

export const referencesSchema = {
  type: "object" as const,
  properties: {
    short: { type: "string" as const },
    relative: { type: "string" as const },
    full: { type: "string" as const },
  },
  additionalProperties: true,
};

export const timeStatsSchema = {
  type: "object" as const,
  properties: {
    timeEstimate: { type: "number" as const },
    totalTimeSpent: { type: "number" as const },
    humanTimeEstimate: { type: "string" as const },
    humanTotalTimeSpent: { type: "string" as const },
  },
  additionalProperties: true,
};

export const commitSchema = {
  type: "object" as const,
  properties: {
    id: { type: "string" as const },
    shortId: { type: "string" as const },
    title: { type: "string" as const },
    message: { type: "string" as const },
    authorName: { type: "string" as const },
    authorEmail: { type: "string" as const },
    authoredDate: { type: "string" as const },
    committerName: { type: "string" as const },
    committerEmail: { type: "string" as const },
    committedDate: { type: "string" as const },
    createdAt: { type: "string" as const },
    parentIds: {
      type: "array" as const,
      items: { type: "string" as const },
    },
    webUrl: { type: "string" as const },
  },
  required: ["id", "shortId", "title", "message", "authorName", "createdAt"],
  additionalProperties: true,
};

export const pipelineSchema = {
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
    webUrl: { type: "string" as const },
  },
  required: ["id", "status", "ref", "sha"],
  additionalProperties: true,
};

export const taskCompletionStatusSchema = {
  type: "object" as const,
  properties: {
    count: { type: "number" as const },
    completedCount: { type: "number" as const },
  },
  additionalProperties: true,
};
