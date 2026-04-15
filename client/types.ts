export interface GitLabClientConfig {
  instanceUrl: string;
  accessToken: string;
  caCertificate?: string;
}

export interface GitLabRequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
  queryParams?: Record<string, string | number | boolean | undefined>;
}

export interface GitLabResponse<T = unknown> {
  data: T;
  status: number;
  headers: Record<string, string>;
}
