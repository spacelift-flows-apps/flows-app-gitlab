import { events } from "@slflows/sdk/v1";
import {
  defineGitLabBlock,
  defineGitLabInputConfig,
} from "../../utils/defineGitLabBlock.ts";
import { createGitLabClient } from "../../client/index.ts";
import { convertKeysToCamelCase } from "../../utils/convertKeysToCamelCase.ts";

const method = defineGitLabInputConfig({
  name: "HTTP Method",
  description: "HTTP method for the request",
  type: {
    enum: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  },
  required: true,
});

const path = defineGitLabInputConfig({
  name: "Path",
  description:
    'The API path relative to the instance URL (e.g., "/api/v4/projects/123/issues")',
  type: "string",
  required: true,
});

const requestBody = defineGitLabInputConfig({
  name: "Body",
  description: "Optional request body as key-value pairs",
  type: {
    type: "object",
    additionalProperties: true,
  },
  required: false,
});

const queryParams = defineGitLabInputConfig({
  name: "Query Parameters",
  description: "Optional query parameters as key-value pairs",
  type: {
    type: "object",
    additionalProperties: true,
  },
  required: false,
});

export const httpRequest = defineGitLabBlock({
  name: "HTTP Request",
  description:
    "Make a direct request to the GitLab API. Use this as an escape hatch for any endpoint not covered by dedicated blocks.",
  category: "Request",
  inputConfig: {
    method,
    path,
    requestBody,
    queryParams,
  },
  outputJsonSchema: {
    type: "object",
    additionalProperties: true,
  },
  onEvent: async ({ event, app }) => {
    const methodValue = event.inputConfig.method as string;
    const pathValue = event.inputConfig.path as string;
    const bodyValue = event.inputConfig.requestBody as
      | Record<string, unknown>
      | undefined;
    const queryParamsValue = event.inputConfig.queryParams as
      | Record<string, string | number | boolean | undefined>
      | undefined;

    const client = createGitLabClient(
      app.config as {
        instanceUrl?: string;
        accessToken: string;
        caCertificate?: string;
      },
    );

    const { data } = await client.requestRaw(pathValue, {
      method: methodValue as "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
      body: bodyValue,
      queryParams: queryParamsValue,
    });

    await events.emit(convertKeysToCamelCase(data) as Record<string, any>);
  },
});
