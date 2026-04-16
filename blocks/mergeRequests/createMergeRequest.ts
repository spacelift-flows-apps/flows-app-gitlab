import {
  defineGitLabBlock,
  defineGitLabInputConfig,
} from "../../utils/defineGitLabBlock.ts";
import { projectId, labels } from "../shared.ts";
import {
  title,
  description,
  sourceBranch,
  targetBranch,
  assigneeIds,
  reviewerIds,
  milestoneId,
  mergeRequestSchema,
} from "./shared.ts";

const draft = defineGitLabInputConfig({
  name: "Draft",
  description: "Create as a draft merge request",
  type: "boolean",
  required: false,
  apiRequestFieldKey: "draft",
});

const removeSourceBranch = defineGitLabInputConfig({
  name: "Remove Source Branch",
  description: "Remove the source branch when merge request is merged",
  type: "boolean",
  required: false,
  apiRequestFieldKey: "remove_source_branch",
});

export const createMergeRequest = defineGitLabBlock({
  name: "Create Merge Request",
  description: "Create a new merge request in a GitLab project",
  category: "Merge Requests",
  url: "POST /projects/{id}/merge_requests",
  inputConfig: {
    projectId,
    sourceBranch,
    targetBranch,
    title,
    description,
    labels,
    assigneeIds,
    reviewerIds,
    milestoneId,
    draft,
    removeSourceBranch,
  },
  outputJsonSchema: mergeRequestSchema,
});
