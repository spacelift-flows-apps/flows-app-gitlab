import { defineGitLabBlock } from "../../utils/defineGitLabBlock.ts";
import { projectId, mergeRequestIid, noteSchema } from "../shared.ts";
import { noteBody } from "./shared.ts";

export const createMergeRequestNote = defineGitLabBlock({
  name: "Create Merge Request Note",
  description: "Add a comment (note) to a merge request",
  category: "Merge Requests",
  url: "POST /projects/{id}/merge_requests/{merge_request_iid}/notes",
  inputConfig: { projectId, mergeRequestIid, body: noteBody },
  outputJsonSchema: noteSchema,
});
