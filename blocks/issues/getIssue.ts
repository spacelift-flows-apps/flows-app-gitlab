import { defineGitLabBlock } from "../../utils/defineGitLabBlock.ts";
import { projectId, issueIid } from "../shared.ts";
import { issueSchema } from "./shared.ts";

export const getIssue = defineGitLabBlock({
  name: "Get Issue",
  description: "Get a single issue from a GitLab project",
  category: "Issues",
  url: "GET /projects/{id}/issues/{issue_iid}",
  inputConfig: { projectId, issueIid },
  outputJsonSchema: issueSchema,
});
