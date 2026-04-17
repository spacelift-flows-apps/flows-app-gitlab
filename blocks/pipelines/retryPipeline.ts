import { defineGitLabBlock } from "../../utils/defineGitLabBlock.ts";
import { projectId } from "../shared.ts";
import { pipelineId, pipelineDetailSchema } from "./shared.ts";

export const retryPipeline = defineGitLabBlock({
  name: "Retry Pipeline",
  description: "Retry all failed or canceled jobs in a pipeline",
  category: "Pipelines",
  url: "POST /projects/{id}/pipelines/{pipeline_id}/retry",
  inputConfig: { projectId, pipelineId },
  outputJsonSchema: pipelineDetailSchema,
});
