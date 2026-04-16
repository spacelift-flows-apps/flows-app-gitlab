import { AppBlock, AppBlockConfigField, events } from "@slflows/sdk/v1";
import { createGitLabClient } from "../client";
import { convertKeysToCamelCase } from "./convertKeysToCamelCase.ts";

interface GitLabBlockInputConfigParams extends Pick<
  AppBlockConfigField,
  "name" | "description" | "type" | "required" | "suggestValues"
> {
  apiRequestFieldKey?: string;
  apiRequestTransform?: (value: unknown) => unknown;
}

export function defineGitLabInputConfig(
  params: GitLabBlockInputConfigParams,
): GitLabBlockInputConfigParams {
  return params;
}

interface GitLabBlockConfigParams extends Pick<
  AppBlockConfigField,
  "name" | "description" | "type" | "required" | "suggestValues"
> {
  apiRequestFieldKey?: string;
}

export function defineGitLabBlockConfig(
  params: GitLabBlockConfigParams,
): GitLabBlockConfigParams {
  return params;
}

function mapBlockConfig(
  blockConfig: Record<string, GitLabBlockConfigParams>,
): Record<string, AppBlockConfigField> {
  return Object.fromEntries(
    Object.entries(blockConfig).map(([key, value]) => [
      key,
      {
        name: value.name,
        description: value.description,
        type: value.type,
        required: value.required,
        ...(value.suggestValues ? { suggestValues: value.suggestValues } : {}),
      },
    ]),
  );
}

function mapInputConfig(
  inputConfig: Record<string, GitLabBlockInputConfigParams>,
): Record<string, AppBlockConfigField> {
  return Object.fromEntries(
    Object.entries(inputConfig).map(([key, value]) => [
      key,
      {
        name: value.name,
        description: value.description,
        type: value.type,
        required: value.required,
        ...(value.suggestValues ? { suggestValues: value.suggestValues } : {}),
      },
    ]),
  );
}

type GitLabBlockParams = {
  name: string;
  description: string;
  category: string;
  entrypoint?: boolean;
  inputConfig?: Record<string, GitLabBlockInputConfigParams>;
  staticConfig?: Record<string, GitLabBlockConfigParams>;
  outputJsonSchema: NonNullable<
    NonNullable<AppBlock["outputs"]>[string]["type"]
  >;
  onInternalMessage?: AppBlock["onInternalMessage"];
} & (
  | {
      url: string;
      headers?: Record<string, string>;
    }
  | {
      onEvent: NonNullable<AppBlock["inputs"]>[string]["onEvent"];
    }
  | {
      onInternalMessage: AppBlock["onInternalMessage"];
    }
);

function buildRequestParams(
  url: string,
  inputConfig: Record<string, GitLabBlockInputConfigParams>,
  eventInputConfig: Record<string, unknown>,
): { method: string; path: string; body: Record<string, unknown> } {
  const [method, pathTemplate] = url.split(" ", 2);
  const body: Record<string, unknown> = {};

  // Extract path parameter names from the template
  const pathParamNames = new Set<string>();
  pathTemplate.replace(/\{(\w+)\}/g, (_, name) => {
    pathParamNames.add(name);
    return "";
  });

  // Map input config fields to their API keys and values
  let path = pathTemplate;
  for (const [key, config] of Object.entries(inputConfig)) {
    const apiKey = config.apiRequestFieldKey || key;
    const value = eventInputConfig[key];

    if (pathParamNames.has(apiKey) && value !== undefined) {
      // URL-encode path parameters (handles project paths like "group/project")
      path = path.replace(`{${apiKey}}`, encodeURIComponent(String(value)));
    } else if (value !== undefined) {
      body[apiKey] = config.apiRequestTransform
        ? config.apiRequestTransform(value)
        : value;
    }
  }

  return { method, path, body };
}

export function defineGitLabBlock(params: GitLabBlockParams): AppBlock {
  return {
    name: params.name,
    description: params.description,
    category: params.category,
    entrypoint: params.entrypoint,
    outputs: {
      default: {
        type: params.outputJsonSchema,
        possiblePrimaryParents: params.inputConfig ? ["default"] : undefined,
      },
    },
    config: params.staticConfig
      ? mapBlockConfig(params.staticConfig)
      : undefined,
    inputs:
      params.inputConfig && !("onInternalMessage" in params)
        ? {
            default: {
              config: mapInputConfig(params.inputConfig),
              onEvent:
                "onEvent" in params
                  ? params.onEvent
                  : async ({ event, app }) => {
                      const client = createGitLabClient(
                        app.config as {
                          instanceUrl?: string;
                          accessToken: string;
                          caCertificate?: string;
                        },
                      );

                      const { method, path, body } = buildRequestParams(
                        (params as { url: string }).url,
                        params.inputConfig!,
                        event.inputConfig,
                      );

                      const hasBody =
                        method !== "GET" &&
                        method !== "DELETE" &&
                        Object.keys(body).length > 0;

                      const queryParams =
                        method === "GET"
                          ? (body as Record<
                              string,
                              string | number | boolean | undefined
                            >)
                          : undefined;

                      const { data } = await client.request(path, {
                        method: method as
                          | "GET"
                          | "POST"
                          | "PUT"
                          | "PATCH"
                          | "DELETE",
                        body: hasBody ? body : undefined,
                        queryParams,
                        headers: (
                          params as { headers?: Record<string, string> }
                        ).headers,
                      });

                      await events.emit(
                        convertKeysToCamelCase(data) as Record<string, any>,
                      );
                    },
            },
          }
        : undefined,
    onInternalMessage: params.onInternalMessage,
  };
}
