import {
  defineGitLabBlock,
  defineGitLabInputConfig,
} from "../../utils/defineGitLabBlock.ts";
import {
  projectId,
  page,
  perPage,
  orderBy,
  sort,
  ref,
  pipelineSchema,
} from "../shared.ts";

const status = defineGitLabInputConfig({
  name: "Status",
  description: "Filter by pipeline status",
  type: {
    enum: [
      "created",
      "waiting_for_resource",
      "preparing",
      "pending",
      "running",
      "success",
      "failed",
      "canceled",
      "skipped",
      "manual",
      "scheduled",
    ],
  },
  required: false,
  apiRequestFieldKey: "status",
});

export const listPipelines = defineGitLabBlock({
  name: "List Pipelines",
  description: "List pipelines in a GitLab project",
  category: "Pipelines",
  url: "GET /projects/{id}/pipelines",
  inputConfig: { projectId, status, ref, orderBy, sort, page, perPage },
  outputJsonSchema: {
    type: "array" as const,
    items: pipelineSchema,
  },
});
