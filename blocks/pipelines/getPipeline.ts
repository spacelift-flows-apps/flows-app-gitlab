import { defineGitLabBlock } from "../../utils/defineGitLabBlock.ts";
import { projectId } from "../shared.ts";
import { pipelineId, pipelineDetailSchema } from "./shared.ts";

export const getPipeline = defineGitLabBlock({
  name: "Get Pipeline",
  description: "Get a single pipeline from a GitLab project",
  category: "Pipelines",
  url: "GET /projects/{id}/pipelines/{pipeline_id}",
  inputConfig: { projectId, pipelineId },
  outputJsonSchema: pipelineDetailSchema,
});
