import { events } from "@slflows/sdk/v1";
import { defineGitLabBlock } from "../../utils/defineGitLabBlock.ts";
import { createGitLabClient } from "../../client/index.ts";
import { convertKeysToCamelCase } from "../../utils/convertKeysToCamelCase.ts";
import { projectId, mergeRequestIid, userSchema } from "../shared.ts";

export const approveMergeRequest = defineGitLabBlock({
  name: "Approve Merge Request",
  description: "Approve a merge request",
  category: "Merge Requests",
  inputConfig: { projectId, mergeRequestIid },
  outputJsonSchema: {
    type: "object",
    properties: {
      id: { type: "number" },
      iid: { type: "number" },
      projectId: { type: "number" },
      title: { type: "string" },
      description: { type: "string" },
      state: { type: "string" },
      createdAt: { type: "string" },
      updatedAt: { type: "string" },
      mergeStatus: { type: "string" },
      approvalsRequired: { type: "number" },
      approvalsLeft: { type: "number" },
      approved: { type: "boolean" },
      approvedBy: {
        type: "array",
        items: {
          type: "object",
          properties: {
            user: userSchema,
            approvedAt: { type: "string" },
          },
          additionalProperties: true,
        },
      },
      userCanApprove: { type: "boolean" },
      userHasApproved: { type: "boolean" },
    },
    required: ["id", "iid", "approved", "approvedBy"],
    additionalProperties: true,
  },
  onEvent: async ({ event, app }) => {
    const client = createGitLabClient(
      app.config as {
        instanceUrl?: string;
        accessToken: string;
        caCertificate?: string;
      },
    );

    const project = event.inputConfig.projectId as string;
    const iid = event.inputConfig.mergeRequestIid as number;

    const { data } = await client.post(
      `/projects/${encodeURIComponent(project)}/merge_requests/${iid}/approve`,
    );

    await events.emit(convertKeysToCamelCase(data) as Record<string, any>);
  },
});
