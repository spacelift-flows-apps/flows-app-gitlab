import { defineGitLabBlock } from "../../utils/defineGitLabBlock.ts";
import { projectId, mergeRequestIid } from "../shared.ts";

export const getMergeRequestChanges = defineGitLabBlock({
  name: "Get Merge Request Changes",
  description: "Get the changes (diff) of a merge request",
  category: "Merge Requests",
  url: "GET /projects/{id}/merge_requests/{merge_request_iid}/changes",
  inputConfig: { projectId, mergeRequestIid },
  outputJsonSchema: {
    type: "object",
    properties: {
      changes: {
        type: "array",
        items: {
          type: "object",
          properties: {
            oldPath: { type: "string" },
            newPath: { type: "string" },
            aMode: { type: "string" },
            bMode: { type: "string" },
            diff: { type: "string" },
            newFile: { type: "boolean" },
            renamedFile: { type: "boolean" },
            deletedFile: { type: "boolean" },
          },
          additionalProperties: true,
        },
      },
    },
    additionalProperties: true,
  },
});
