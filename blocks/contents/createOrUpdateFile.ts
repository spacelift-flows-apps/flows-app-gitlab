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
import { filePath, content, fileWriteResponseSchema } from "./shared.ts";

export const createOrUpdateFile = defineGitLabBlock({
  name: "Create or Update File",
  description:
    "Create a new file or update an existing file in a GitLab repository. Automatically detects whether the file exists.",
  category: "Files",
  inputConfig: {
    projectId,
    filePath,
    branch,
    content,
    commitMessage,
    authorName,
    authorEmail,
  },
  outputJsonSchema: fileWriteResponseSchema,
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
    const branchValue = event.inputConfig.branch as string;
    const contentValue = event.inputConfig.content as string;
    const message = event.inputConfig.commitMessage as string;

    const body: Record<string, unknown> = {
      branch: branchValue,
      content: contentValue,
      commit_message: message,
    };
    if (event.inputConfig.authorName)
      body.author_name = event.inputConfig.authorName;
    if (event.inputConfig.authorEmail)
      body.author_email = event.inputConfig.authorEmail;

    const encodedPath = encodeURIComponent(path);
    const apiPath = `/projects/${encodeURIComponent(project)}/repository/files/${encodedPath}`;

    // Check if file exists to decide PUT vs POST
    let fileExists = false;
    try {
      await client.get(apiPath, { ref: branchValue });
      fileExists = true;
    } catch {
      // File doesn't exist, will create
    }

    const { data } = fileExists
      ? await client.put(apiPath, body)
      : await client.post(apiPath, body);

    await events.emit(convertKeysToCamelCase(data) as Record<string, any>);
  },
});
