import https from "node:https";
import http from "node:http";
import {
  GitLabClientConfig,
  GitLabRequestOptions,
  GitLabResponse,
} from "./types.ts";

interface RawResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
}

function makeRequest(
  url: string,
  options: {
    method: string;
    headers: Record<string, string>;
    body?: string;
    ca?: string;
  },
): Promise<RawResponse> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const isHttps = parsed.protocol === "https:";
    const mod = isHttps ? https : http;

    const reqOptions: https.RequestOptions = {
      hostname: parsed.hostname,
      port: parsed.port || (isHttps ? 443 : 80),
      path: parsed.pathname + parsed.search,
      method: options.method,
      headers: options.headers,
      ...(isHttps && options.ca ? { ca: options.ca } : {}),
    };

    const req = mod.request(reqOptions, (res) => {
      const chunks: Buffer[] = [];
      res.on("data", (chunk: Buffer) => chunks.push(chunk));
      res.on("end", () => {
        const responseHeaders: Record<string, string> = {};
        for (const [key, value] of Object.entries(res.headers)) {
          if (typeof value === "string") {
            responseHeaders[key] = value;
          } else if (Array.isArray(value)) {
            responseHeaders[key] = value.join(", ");
          }
        }

        resolve({
          status: res.statusCode ?? 0,
          statusText: res.statusMessage ?? "",
          headers: responseHeaders,
          body: Buffer.concat(chunks).toString("utf-8"),
        });
      });
    });

    req.on("error", reject);

    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

export class GitLabClient {
  private readonly baseUrl: string;
  private readonly accessToken: string;
  private readonly caCertificate?: string;

  constructor(config: GitLabClientConfig) {
    this.baseUrl = `${config.instanceUrl.replace(/\/+$/, "")}/api/v4`;
    this.accessToken = config.accessToken;
    this.caCertificate = config.caCertificate;
  }

  async request<T = unknown>(
    path: string,
    options: GitLabRequestOptions = {},
  ): Promise<GitLabResponse<T>> {
    const { method = "GET", body, headers = {}, queryParams } = options;

    let url = `${this.baseUrl}${path.startsWith("/") ? path : `/${path}`}`;

    if (queryParams) {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(queryParams)) {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      }
      const qs = params.toString();
      if (qs) {
        url += `?${qs}`;
      }
    }

    const requestHeaders: Record<string, string> = {
      "PRIVATE-TOKEN": this.accessToken,
      "Content-Type": "application/json",
      ...headers,
    };

    const response = await makeRequest(url, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
      ca: this.caCertificate,
    });

    if (response.status < 200 || response.status >= 300) {
      throw new Error(
        `GitLab API error (${response.status} ${response.statusText}) for ${method} ${url}: ${response.body}`,
      );
    }

    let data: T;
    const contentType = response.headers["content-type"] || "";
    if (contentType.includes("application/json") && response.body) {
      data = JSON.parse(response.body) as T;
    } else {
      data = response.body as unknown as T;
    }

    return { data, status: response.status, headers: response.headers };
  }

  async get<T = unknown>(
    path: string,
    queryParams?: GitLabRequestOptions["queryParams"],
  ): Promise<GitLabResponse<T>> {
    return this.request<T>(path, { method: "GET", queryParams });
  }

  async post<T = unknown>(
    path: string,
    body?: Record<string, unknown>,
  ): Promise<GitLabResponse<T>> {
    return this.request<T>(path, { method: "POST", body });
  }

  async put<T = unknown>(
    path: string,
    body?: Record<string, unknown>,
  ): Promise<GitLabResponse<T>> {
    return this.request<T>(path, { method: "PUT", body });
  }

  async patch<T = unknown>(
    path: string,
    body?: Record<string, unknown>,
  ): Promise<GitLabResponse<T>> {
    return this.request<T>(path, { method: "PATCH", body });
  }

  async delete<T = unknown>(path: string): Promise<GitLabResponse<T>> {
    return this.request<T>(path, { method: "DELETE" });
  }
}

export function createGitLabClient(appConfig: {
  instanceUrl?: string;
  accessToken: string;
  caCertificate?: string;
}): GitLabClient {
  return new GitLabClient({
    instanceUrl: appConfig.instanceUrl || "https://gitlab.com",
    accessToken: appConfig.accessToken,
    caCertificate: appConfig.caCertificate,
  });
}
