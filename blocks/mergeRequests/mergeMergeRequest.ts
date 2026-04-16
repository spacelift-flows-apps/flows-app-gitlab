import { events } from "@slflows/sdk/v1";
import {
  defineGitLabBlock,
  defineGitLabInputConfig,
} from "../../utils/defineGitLabBlock.ts";
import { createGitLabClient } from "../../client/index.ts";
import { convertKeysToCamelCase } from "../../utils/convertKeysToCamelCase.ts";
import { projectId, mergeRequestIid } from "../shared.ts";
import { mergeRequestSchema } from "./shared.ts";

const squash = defineGitLabInputConfig({
  name: "Squash",
  description: "Squash commits when merging",
  type: "boolean",
  required: false,
});

const squashCommitMessage = defineGitLabInputConfig({
  name: "Squash Commit Message",
  description: "Custom squash commit message",
  type: "string",
  required: false,
});

const shouldRemoveSourceBranch = defineGitLabInputConfig({
  name: "Remove Source Branch",
  description: "Remove the source branch after merging",
  type: "boolean",
  required: false,
});

const mergeWhenPipelineSucceeds = defineGitLabInputConfig({
  name: "Merge When Pipeline Succeeds",
  description: "Merge automatically when the pipeline succeeds",
  type: "boolean",
  required: false,
});

export const mergeMergeRequest = defineGitLabBlock({
  name: "Merge Merge Request",
  description: "Merge a merge request",
  category: "Merge Requests",
  inputConfig: {
    projectId,
    mergeRequestIid,
    squash,
    squashCommitMessage,
    shouldRemoveSourceBranch,
    mergeWhenPipelineSucceeds,
  },
  outputJsonSchema: mergeRequestSchema,
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

    const body: Record<string, unknown> = {};
    if (event.inputConfig.squash !== undefined)
      body.squash = event.inputConfig.squash;
    if (event.inputConfig.squashCommitMessage)
      body.squash_commit_message = event.inputConfig.squashCommitMessage;
    if (event.inputConfig.shouldRemoveSourceBranch !== undefined)
      body.should_remove_source_branch =
        event.inputConfig.shouldRemoveSourceBranch;
    if (event.inputConfig.mergeWhenPipelineSucceeds !== undefined)
      body.merge_when_pipeline_succeeds =
        event.inputConfig.mergeWhenPipelineSucceeds;

    const { data } = await client.put(
      `/projects/${encodeURIComponent(project)}/merge_requests/${iid}/merge`,
      body,
    );

    await events.emit(convertKeysToCamelCase(data) as Record<string, any>);
  },
});
