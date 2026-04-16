import { defineGitLabBlock } from "../../utils/defineGitLabBlock.ts";
import { projectId, issueIid, labels } from "../shared.ts";
import {
  title,
  description,
  assigneeIds,
  milestoneId,
  stateEvent,
  suggestLabels,
  suggestMilestones,
  suggestMembers,
  issueSchema,
} from "./shared.ts";

export const updateIssue = defineGitLabBlock({
  name: "Update Issue",
  description: "Update an existing issue in a GitLab project",
  category: "Issues",
  url: "PUT /projects/{id}/issues/{issue_iid}",
  inputConfig: {
    projectId,
    issueIid,
    title: { ...title, required: false },
    description,
    stateEvent,
    labels: { ...labels, suggestValues: suggestLabels() },
    assigneeIds: { ...assigneeIds, suggestValues: suggestMembers() },
    milestoneId: { ...milestoneId, suggestValues: suggestMilestones() },
  },
  outputJsonSchema: issueSchema,
});
