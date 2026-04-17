import { defineGitLabBlock } from "../../utils/defineGitLabBlock.ts";
import { projectId, mergeRequestIid, labels } from "../shared.ts";
import {
  title,
  description,
  stateEvent,
  assignees,
  reviewers,
  milestoneId,
  mergeRequestSchema,
} from "./shared.ts";

export const updateMergeRequest = defineGitLabBlock({
  name: "Update Merge Request",
  description: "Update an existing merge request in a GitLab project",
  category: "Merge Requests",
  url: "PUT /projects/{id}/merge_requests/{merge_request_iid}",
  inputConfig: {
    projectId,
    mergeRequestIid,
    title: { ...title, required: false },
    description,
    stateEvent,
    labels,
    assignees,
    reviewers,
    milestoneId,
  },
  outputJsonSchema: mergeRequestSchema,
});
