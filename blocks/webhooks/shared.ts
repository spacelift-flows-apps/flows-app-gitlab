import { defineGitLabBlockConfig } from "../../utils/defineGitLabBlock.ts";
import { suggestProjects, suggestBranches } from "../../utils/suggestValues.ts";
import { userSchema, commitSchema } from "../shared.ts";

export const project = defineGitLabBlockConfig({
  name: "Project",
  description:
    "Filter by project path (e.g., 'my-group/my-project'). Leave empty for all projects.",
  type: "string",
  required: false,
  suggestValues: suggestProjects(),
});

export const labels = defineGitLabBlockConfig({
  name: "Labels",
  description:
    "Label names to filter by. Matches if the event's resource has any of these labels.",
  type: { type: "array", items: { type: "string" } },
  required: false,
});

export const branchFilter = defineGitLabBlockConfig({
  name: "Branch",
  description: "Filter by branch name. Leave empty for all branches.",
  type: "string",
  required: false,
  suggestValues: suggestBranches(),
});

// Shared output schemas for webhook payloads

export const webhookProjectSchema = {
  type: "object" as const,
  properties: {
    id: { type: "number" as const },
    name: { type: "string" as const },
    description: { type: "string" as const },
    webUrl: { type: "string" as const },
    avatarUrl: { type: "string" as const },
    gitSshUrl: { type: "string" as const },
    gitHttpUrl: { type: "string" as const },
    namespace: { type: "string" as const },
    pathWithNamespace: { type: "string" as const },
    defaultBranch: { type: "string" as const },
    homepage: { type: "string" as const },
    url: { type: "string" as const },
    sshUrl: { type: "string" as const },
    httpUrl: { type: "string" as const },
    visibilityLevel: { type: "number" as const },
  },
  required: ["id", "name", "pathWithNamespace", "webUrl"],
  additionalProperties: true,
};

export const webhookLabelSchema = {
  type: "object" as const,
  properties: {
    id: { type: "number" as const },
    title: { type: "string" as const },
    color: { type: "string" as const },
    projectId: { type: "number" as const },
    createdAt: { type: "string" as const },
    updatedAt: { type: "string" as const },
    description: { type: "string" as const },
    type: { type: "string" as const },
    groupId: { type: "number" as const },
  },
  required: ["id", "title"],
  additionalProperties: true,
};

export { userSchema, commitSchema };
