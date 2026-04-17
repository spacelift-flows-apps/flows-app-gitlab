import { events } from "@slflows/sdk/v1";
import {
  defineGitLabBlock,
  defineGitLabInputConfig,
} from "../../utils/defineGitLabBlock.ts";
import { createGitLabClient } from "../../client/index.ts";
import { convertKeysToCamelCase } from "../../utils/convertKeysToCamelCase.ts";
import { projectId } from "../shared.ts";
import { suggestBranches } from "../../utils/suggestValues.ts";
import { pipelineDetailSchema } from "./shared.ts";

const ref = defineGitLabInputConfig({
  name: "Ref",
  description: "Branch or tag name to run the pipeline on",
  type: "string",
  required: true,
  suggestValues: suggestBranches(),
});

const variables = defineGitLabInputConfig({
  name: "Variables",
  description: "Pipeline variables as key-value pairs",
  type: {
    type: "object",
    additionalProperties: true,
  },
  required: false,
});

export const triggerPipeline = defineGitLabBlock({
  name: "Trigger Pipeline",
  description: "Create and trigger a new pipeline in a GitLab project",
  category: "Pipelines",
  inputConfig: { projectId, ref, variables },
  outputJsonSchema: pipelineDetailSchema,
  onEvent: async ({ event, app }) => {
    const client = createGitLabClient(
      app.config as {
        instanceUrl?: string;
        accessToken: string;
        caCertificate?: string;
      },
    );

    const project = event.inputConfig.projectId as string;
    const refValue = event.inputConfig.ref as string;
    const vars = event.inputConfig.variables as
      | Record<string, string>
      | undefined;

    const body: Record<string, unknown> = { ref: refValue };

    if (vars && Object.keys(vars).length > 0) {
      body.variables = Object.entries(vars).map(([key, value]) => ({
        key,
        value,
        variable_type: "env_var",
      }));
    }

    const { data } = await client.post(
      `/projects/${encodeURIComponent(project)}/pipeline`,
      body,
    );

    await events.emit(convertKeysToCamelCase(data) as Record<string, any>);
  },
});
