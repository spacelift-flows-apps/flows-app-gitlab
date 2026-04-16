import { defineGitLabBlock } from "../../utils/defineGitLabBlock.ts";
import { projectId, issueIid, noteId, noteSchema } from "../shared.ts";
import { noteBody } from "./shared.ts";

export const updateIssueNote = defineGitLabBlock({
  name: "Update Issue Note",
  description: "Update a comment (note) on an issue",
  category: "Issues",
  url: "PUT /projects/{id}/issues/{issue_iid}/notes/{note_id}",
  inputConfig: { projectId, issueIid, noteId, body: noteBody },
  outputJsonSchema: noteSchema,
});
