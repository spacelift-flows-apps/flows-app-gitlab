import { defineGitLabInputConfig } from "../../utils/defineGitLabBlock.ts";

export const filePath = defineGitLabInputConfig({
  name: "File Path",
  description: "Path to the file in the repository (e.g., 'src/main.ts')",
  type: "string",
  required: true,
});

export const content = defineGitLabInputConfig({
  name: "Content",
  description: "File content",
  type: "string",
  required: true,
  apiRequestFieldKey: "content",
});

export const fileSchema = {
  type: "object" as const,
  properties: {
    fileName: { type: "string" as const },
    filePath: { type: "string" as const },
    size: { type: "number" as const },
    encoding: { type: "string" as const },
    contentSha256: { type: "string" as const },
    ref: { type: "string" as const },
    blobId: { type: "string" as const },
    commitId: { type: "string" as const },
    lastCommitId: { type: "string" as const },
    executeFilemode: { type: "boolean" as const },
    content: { type: "string" as const },
  },
  required: ["fileName", "filePath", "ref", "commitId", "content"],
  additionalProperties: true,
};

export const fileWriteResponseSchema = {
  type: "object" as const,
  properties: {
    filePath: { type: "string" as const },
    branch: { type: "string" as const },
  },
  required: ["filePath", "branch"],
  additionalProperties: true,
};
