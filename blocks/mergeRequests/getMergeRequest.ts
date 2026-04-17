import { defineGitLabBlock } from "../../utils/defineGitLabBlock.ts";
import { projectId, mergeRequestIid } from "../shared.ts";
import { mergeRequestSchema } from "./shared.ts";

export const getMergeRequest = defineGitLabBlock({
  name: "Get Merge Request",
  description: "Get a single merge request from a GitLab project",
  category: "Merge Requests",
  url: "GET /projects/{id}/merge_requests/{merge_request_iid}",
  inputConfig: { projectId, mergeRequestIid },
  outputJsonSchema: mergeRequestSchema,
});
