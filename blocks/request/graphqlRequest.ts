import { events } from "@slflows/sdk/v1";
import {
  defineGitLabBlock,
  defineGitLabInputConfig,
} from "../../utils/defineGitLabBlock.ts";
import { createGitLabClient } from "../../client/index.ts";
import { convertKeysToCamelCase } from "../../utils/convertKeysToCamelCase.ts";

const query = defineGitLabInputConfig({
  name: "Query",
  description: "The GraphQL query or mutation string",
  type: "string",
  required: true,
});

const variables = defineGitLabInputConfig({
  name: "Variables",
  description: "Optional GraphQL variables as key-value pairs",
  type: {
    type: "object",
    additionalProperties: true,
  },
  required: false,
});

export const graphqlRequest = defineGitLabBlock({
  name: "GraphQL Request",
  description:
    "Make a GraphQL request to the GitLab API. Use this for queries and mutations not covered by dedicated blocks.",
  category: "Request",
  inputConfig: { query, variables },
  outputJsonSchema: {
    type: "object",
    properties: {
      data: { type: "object", additionalProperties: true },
      errors: {
        type: "array",
        items: {
          type: "object",
          properties: {
            message: { type: "string" },
            locations: {
              type: "array",
              items: { type: "object", additionalProperties: true },
            },
            path: { type: "array", items: { type: "string" } },
          },
          additionalProperties: true,
        },
      },
    },
    additionalProperties: true,
  },
  onEvent: async ({ event, app }) => {
    const queryValue = event.inputConfig.query as string;
    const variablesValue = event.inputConfig.variables as
      | Record<string, unknown>
      | undefined;

    const client = createGitLabClient(
      app.config as {
        instanceUrl?: string;
        accessToken: string;
        caCertificate?: string;
      },
    );

    const body: Record<string, unknown> = { query: queryValue };
    if (variablesValue && Object.keys(variablesValue).length > 0) {
      body.variables = variablesValue;
    }

    const { data } = await client.requestRaw("/api/graphql", {
      method: "POST",
      body,
    });

    await events.emit(convertKeysToCamelCase(data) as Record<string, any>);
  },
});
