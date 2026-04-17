import { events } from "@slflows/sdk/v1";
import { defineGitLabBlock } from "../../utils/defineGitLabBlock.ts";
import { createGitLabClient } from "../../client/index.ts";
import { convertKeysToCamelCase } from "../../utils/convertKeysToCamelCase.ts";
import { projectId, ref } from "../shared.ts";
import { filePath, fileSchema } from "./shared.ts";

export const getFileContents = defineGitLabBlock({
  name: "Get File Contents",
  description: "Get the contents of a file from a GitLab repository",
  category: "Files",
  inputConfig: { projectId, filePath, ref },
  outputJsonSchema: fileSchema,
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
    const refValue = event.inputConfig.ref as string | undefined;

    const queryParams: Record<string, string> = {};
    if (refValue) queryParams.ref = refValue;

    const { data } = await client.get(
      `/projects/${encodeURIComponent(project)}/repository/files/${encodeURIComponent(path)}`,
      queryParams,
    );

    await events.emit(convertKeysToCamelCase(data) as Record<string, any>);
  },
});
