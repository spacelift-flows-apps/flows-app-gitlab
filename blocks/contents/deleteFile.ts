import { events } from "@slflows/sdk/v1";
import { defineGitLabBlock } from "../../utils/defineGitLabBlock.ts";
import { createGitLabClient } from "../../client/index.ts";
import { convertKeysToCamelCase } from "../../utils/convertKeysToCamelCase.ts";
import {
  projectId,
  branch,
  commitMessage,
  authorName,
  authorEmail,
} from "../shared.ts";
import { filePath } from "./shared.ts";

export const deleteFile = defineGitLabBlock({
  name: "Delete File",
  description: "Delete a file from a GitLab repository",
  category: "Files",
  inputConfig: {
    projectId,
    filePath,
    branch,
    commitMessage,
    authorName,
    authorEmail,
  },
  outputJsonSchema: { type: "object", additionalProperties: true },
  onEvent: async ({ event, app }) => {
    const client = createGitLabClient(
      app.config as {
        instanceUrl?: string;
        accessToken: string;
        caCertificate?: string;
      },
    );

    const project = event.inputConfig.projectId as string;
    const path = event.inputConfig.filePath as string;

    const body: Record<string, unknown> = {
      branch: event.inputConfig.branch,
      commit_message: event.inputConfig.commitMessage,
    };
    if (event.inputConfig.authorName)
      body.author_name = event.inputConfig.authorName;
    if (event.inputConfig.authorEmail)
      body.author_email = event.inputConfig.authorEmail;

    const encodedPath = encodeURIComponent(path);

    const { data } = await client.request(
      `/projects/${encodeURIComponent(project)}/repository/files/${encodedPath}`,
      { method: "DELETE", body },
    );

    await events.emit(
      (convertKeysToCamelCase(data) as Record<string, any>) || {},
    );
  },
});
