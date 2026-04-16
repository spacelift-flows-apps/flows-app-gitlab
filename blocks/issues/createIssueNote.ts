import { defineGitLabBlock } from "../../utils/defineGitLabBlock.ts";
import { projectId, issueIid } from "../shared.ts";
import { noteBody, noteSchema } from "./shared.ts";

export const createIssueNote = defineGitLabBlock({
  name: "Create Issue Note",
  description: "Add a comment (note) to an issue",
  category: "Issues",
  url: "POST /projects/{id}/issues/{issue_iid}/notes",
  inputConfig: { projectId, issueIid, body: noteBody },
  outputJsonSchema: noteSchema,
});
