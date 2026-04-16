import { defineGitLabBlock } from "../../utils/defineGitLabBlock.ts";
import { projectId, issueIid, noteId } from "../shared.ts";

export const deleteIssueNote = defineGitLabBlock({
  name: "Delete Issue Note",
  description: "Delete a comment (note) from an issue",
  category: "Issues",
  url: "DELETE /projects/{id}/issues/{issue_iid}/notes/{note_id}",
  inputConfig: { projectId, issueIid, noteId },
  outputJsonSchema: { type: "object", additionalProperties: true },
});
