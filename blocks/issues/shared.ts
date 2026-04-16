import { defineGitLabInputConfig } from "../../utils/defineGitLabBlock.ts";
import {
  suggestLabels,
  suggestMilestones,
  suggestMembers,
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
  description: "Issue title",
  type: "string",
  required: true,
  apiRequestFieldKey: "title",
});

export const description = defineGitLabInputConfig({
  name: "Description",
  description: "Issue description (Markdown supported)",
  type: "string",
  required: false,
  apiRequestFieldKey: "description",
});

export const noteBody = defineGitLabInputConfig({
  name: "Body",
  description: "Note/comment body (Markdown supported)",
  type: "string",
  required: true,
  apiRequestFieldKey: "body",
});

export const assigneeIds = defineGitLabInputConfig({
  name: "Assignee IDs",
  description: "Comma-separated user IDs to assign",
  type: "string",
  required: false,
  apiRequestFieldKey: "assignee_ids",
});

export const milestoneId = defineGitLabInputConfig({
  name: "Milestone ID",
  description: "The ID of the milestone",
  type: "number",
  required: false,
  apiRequestFieldKey: "milestone_id",
});

export const stateEvent = defineGitLabInputConfig({
  name: "State Event",
  description: "Change the state of the issue",
  type: { enum: ["reopen", "close"] },
  required: false,
  apiRequestFieldKey: "state_event",
});

export { suggestLabels, suggestMilestones, suggestMembers };

export const issueSchema = {
  type: "object" as const,
  properties: {
    id: { type: "number" as const },
    iid: { type: "number" as const },
    projectId: { type: "number" as const },
    title: { type: "string" as const },
    description: { type: "string" as const },
    state: { type: "string" as const },
    type: { type: "string" as const },
    issueType: { type: "string" as const },
    severity: { type: "string" as const },
    confidential: { type: "boolean" as const },
    createdAt: { type: "string" as const },
    updatedAt: { type: "string" as const },
    closedAt: { type: "string" as const },
    closedBy: userSchema,
    labels: { type: "array" as const, items: { type: "string" as const } },
    milestone: milestoneSchema,
    assignee: userSchema,
    assignees: { type: "array" as const, items: userSchema },
    author: userSchema,
    upvotes: { type: "number" as const },
    downvotes: { type: "number" as const },
    dueDate: { type: "string" as const },
    webUrl: { type: "string" as const },
    references: referencesSchema,
    Links: {
      type: "object" as const,
      properties: {
        self: { type: "string" as const },
        notes: { type: "string" as const },
        awardEmoji: { type: "string" as const },
        project: { type: "string" as const },
        closedAsDuplicateOf: { type: "string" as const },
      },
      additionalProperties: true,
    },
    subscribed: { type: "boolean" as const },
    movedToId: { type: "number" as const },
    imported: { type: "boolean" as const },
    importedFrom: { type: "string" as const },
    serviceDeskReplyTo: { type: "string" as const },
    discussionLocked: { type: "boolean" as const },
    mergeRequestsCount: { type: "number" as const },
    userNotesCount: { type: "number" as const },
    hasTasks: { type: "boolean" as const },
    taskStatus: { type: "string" as const },
    taskCompletionStatus: taskCompletionStatusSchema,
    timeStats: timeStatsSchema,
  },
  required: [
    "id",
    "iid",
    "projectId",
    "title",
    "state",
    "createdAt",
    "updatedAt",
    "author",
    "webUrl",
  ],
  additionalProperties: true,
};

export const issueListSchema = {
  type: "array" as const,
  items: issueSchema,
};
