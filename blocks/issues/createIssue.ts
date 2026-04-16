import { defineGitLabBlock } from "../../utils/defineGitLabBlock.ts";
import { projectId, labels } from "../shared.ts";
import {
  title,
  description,
  assigneeIds,
  milestoneId,
  suggestMilestones,
  issueSchema,
} from "./shared.ts";

export const createIssue = defineGitLabBlock({
  name: "Create Issue",
  description: "Create a new issue in a GitLab project",
  category: "Issues",
  url: "POST /projects/{id}/issues",
  inputConfig: {
    projectId,
    title,
    description,
    labels,
    assigneeIds,
    milestoneId: { ...milestoneId, suggestValues: suggestMilestones() },
  },
  outputJsonSchema: issueSchema,
});
