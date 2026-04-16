import { defineGitLabInputConfig } from "../../utils/defineGitLabBlock.ts";
import {
  suggestLabels,
  suggestMilestones,
  suggestMembers,
  suggestBranches,
} from "../../utils/suggestValues.ts";
import {
  userSchema,
  milestoneSchema,
  referencesSchema,
  timeStatsSchema,
  taskCompletionStatusSchema,
} from "../shared.ts";

export const title = defineGitLabInputConfig({
  name: "Title",
  description: "Merge request title",
  type: "string",
  required: true,
  apiRequestFieldKey: "title",
});

export const description = defineGitLabInputConfig({
  name: "Description",
  description: "Merge request description (Markdown supported)",
  type: "string",
  required: false,
  apiRequestFieldKey: "description",
});

export const sourceBranch = defineGitLabInputConfig({
  name: "Source Branch",
  description: "The source branch for the merge request",
  type: "string",
  required: true,
  apiRequestFieldKey: "source_branch",
  suggestValues: suggestBranches(),
});

export const targetBranch = defineGitLabInputConfig({
  name: "Target Branch",
  description: "The target branch for the merge request",
  type: "string",
  required: true,
  apiRequestFieldKey: "target_branch",
  suggestValues: suggestBranches(),
});

export const assigneeIds = defineGitLabInputConfig({
  name: "Assignee IDs",
  description: "Comma-separated user IDs to assign",
  type: "string",
  required: false,
  apiRequestFieldKey: "assignee_ids",
  suggestValues: suggestMembers(),
});

export const reviewerIds = defineGitLabInputConfig({
  name: "Reviewer IDs",
  description: "Comma-separated user IDs to set as reviewers",
  type: "string",
  required: false,
  apiRequestFieldKey: "reviewer_ids",
  suggestValues: suggestMembers(),
});

export const milestoneId = defineGitLabInputConfig({
  name: "Milestone ID",
  description: "The ID of the milestone",
  type: "number",
  required: false,
  apiRequestFieldKey: "milestone_id",
  suggestValues: suggestMilestones(),
});

export const stateEvent = defineGitLabInputConfig({
  name: "State Event",
  description: "Change the state of the merge request",
  type: { enum: ["close", "reopen"] },
  required: false,
  apiRequestFieldKey: "state_event",
});

export const noteBody = defineGitLabInputConfig({
  name: "Body",
  description: "Note/comment body (Markdown supported)",
  type: "string",
  required: true,
  apiRequestFieldKey: "body",
});

export { suggestLabels, suggestMembers, suggestBranches };

export const mergeRequestSchema = {
  type: "object" as const,
  properties: {
    id: { type: "number" as const },
    iid: { type: "number" as const },
    projectId: { type: "number" as const },
    title: { type: "string" as const },
    description: { type: "string" as const },
    state: { type: "string" as const },
    createdAt: { type: "string" as const },
    updatedAt: { type: "string" as const },
    mergedAt: { type: "string" as const },
    closedAt: { type: "string" as const },
    mergedBy: userSchema,
    closedBy: userSchema,
    sourceBranch: { type: "string" as const },
    targetBranch: { type: "string" as const },
    draft: { type: "boolean" as const },
    mergeStatus: { type: "string" as const },
    detailedMergeStatus: { type: "string" as const },
    sha: { type: "string" as const },
    mergeCommitSha: { type: "string" as const },
    squashCommitSha: { type: "string" as const },
    diffRefs: {
      type: "object" as const,
      properties: {
        baseSha: { type: "string" as const },
        headSha: { type: "string" as const },
        startSha: { type: "string" as const },
      },
      additionalProperties: true,
    },
    labels: { type: "array" as const, items: { type: "string" as const } },
    milestone: milestoneSchema,
    assignee: userSchema,
    assignees: { type: "array" as const, items: userSchema },
    reviewers: { type: "array" as const, items: userSchema },
    author: userSchema,
    upvotes: { type: "number" as const },
    downvotes: { type: "number" as const },
    squash: { type: "boolean" as const },
    shouldRemoveSourceBranch: { type: "boolean" as const },
    forceRemoveSourceBranch: { type: "boolean" as const },
    mergeWhenPipelineSucceeds: { type: "boolean" as const },
    webUrl: { type: "string" as const },
    references: referencesSchema,
    hasConflicts: { type: "boolean" as const },
    blockingDiscussionsResolved: { type: "boolean" as const },
    changesCount: { type: "string" as const },
    userNotesCount: { type: "number" as const },
    discussionLocked: { type: "boolean" as const },
    subscribed: { type: "boolean" as const },
    taskCompletionStatus: taskCompletionStatusSchema,
    timeStats: timeStatsSchema,
    pipeline: {
      type: "object" as const,
      properties: {
        id: { type: "number" as const },
        iid: { type: "number" as const },
        sha: { type: "string" as const },
        ref: { type: "string" as const },
        status: { type: "string" as const },
        webUrl: { type: "string" as const },
      },
      additionalProperties: true,
    },
  },
  required: [
    "id",
    "iid",
    "projectId",
    "title",
    "state",
    "createdAt",
    "updatedAt",
    "sourceBranch",
    "targetBranch",
    "author",
    "webUrl",
  ],
  additionalProperties: true,
};

export const mergeRequestListSchema = {
  type: "array" as const,
  items: mergeRequestSchema,
};
