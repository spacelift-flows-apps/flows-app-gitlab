import memoizee from "memoizee";
import { createGitLabClient } from "../client/index.ts";

interface AppConfig {
  instanceUrl?: string;
  accessToken: string;
  caCertificate?: string;
}

function getClient(config: AppConfig) {
  return createGitLabClient(config);
}

export const fetchLabels = memoizee(
  async (config: AppConfig, projectId: string) => {
    const client = getClient(config);
    const { data } = await client.get<Array<{ name: string; color: string }>>(
      `/projects/${encodeURIComponent(projectId)}/labels`,
      { per_page: "100" },
    );
    return data;
  },
  {
    maxAge: 60000,
    promise: true,
    length: 2,
    normalizer: (args) => `${args[0].instanceUrl}:${args[1]}`,
  },
);

export const fetchMilestones = memoizee(
  async (config: AppConfig, projectId: string) => {
    const client = getClient(config);
    const { data } = await client.get<
      Array<{ id: number; title: string; description: string }>
    >(`/projects/${encodeURIComponent(projectId)}/milestones`, {
      state: "active",
      per_page: "100",
    });
    return data;
  },
  {
    maxAge: 60000,
    promise: true,
    length: 2,
    normalizer: (args) => `${args[0].instanceUrl}:${args[1]}`,
  },
);

export const fetchMembers = memoizee(
  async (config: AppConfig, projectId: string) => {
    const client = getClient(config);
    const { data } = await client.get<
      Array<{ id: number; username: string; name: string }>
    >(`/projects/${encodeURIComponent(projectId)}/members/all`, {
      per_page: "100",
    });
    return data;
  },
  {
    maxAge: 60000,
    promise: true,
    length: 2,
    normalizer: (args) => `${args[0].instanceUrl}:${args[1]}`,
  },
);

export const fetchBranches = memoizee(
  async (config: AppConfig, projectId: string) => {
    const client = getClient(config);
    const { data } = await client.get<Array<{ name: string }>>(
      `/projects/${encodeURIComponent(projectId)}/repository/branches`,
      { per_page: "100" },
    );
    return data;
  },
  {
    maxAge: 60000,
    promise: true,
    length: 2,
    normalizer: (args) => `${args[0].instanceUrl}:${args[1]}`,
  },
);

export const fetchIssues = memoizee(
  async (config: AppConfig, projectId: string) => {
    const client = getClient(config);
    const { data } = await client.get<
      Array<{ iid: number; title: string; state: string }>
    >(`/projects/${encodeURIComponent(projectId)}/issues`, {
      per_page: "100",
      state: "opened",
    });
    return data;
  },
  {
    maxAge: 60000,
    promise: true,
    length: 2,
    normalizer: (args) => `${args[0].instanceUrl}:${args[1]}`,
  },
);

export function suggestIssues() {
  return async (input: any) => {
    const projectId = input.staticInputConfig?.projectId as string | undefined;
    if (!projectId) {
      return {
        suggestedValues: [],
        message: "Configure Project to receive issue suggestions.",
      };
    }
    const data = await fetchIssues(input.app.config as AppConfig, projectId);
    let values = data.map((i) => ({
      label: `#${i.iid} — ${i.title}`,
      value: i.iid,
      description: i.state,
    }));
    if (input.searchPhrase) {
      const lower = input.searchPhrase.toLowerCase();
      values = values.filter((v) => v.label.toLowerCase().includes(lower));
    }
    return { suggestedValues: values.slice(0, 50) };
  };
}

export const fetchGroupProjects = memoizee(
  async (config: AppConfig, groupPath: string) => {
    const client = getClient(config);
    const { data } = await client.get<
      Array<{ id: number; path_with_namespace: string; name: string }>
    >(`/groups/${encodeURIComponent(groupPath)}/projects`, {
      per_page: "100",
      include_subgroups: "true",
    });
    return data;
  },
  {
    maxAge: 60000,
    promise: true,
    length: 2,
    normalizer: (args) => `${args[0].instanceUrl}:${args[1]}`,
  },
);

export function suggestProjects() {
  return async (input: any) => {
    const config = input.app.config as AppConfig & {
      tokenScope?: string;
      projectOrGroupPath?: string;
    };
    const { tokenScope, projectOrGroupPath } = config;

    if (!tokenScope || !projectOrGroupPath) {
      return { suggestedValues: [] };
    }

    if (tokenScope === "project") {
      const value = {
        label: projectOrGroupPath,
        value: projectOrGroupPath,
      };
      if (
        input.searchPhrase &&
        !value.label.toLowerCase().includes(input.searchPhrase.toLowerCase())
      ) {
        return { suggestedValues: [] };
      }
      return { suggestedValues: [value] };
    }

    if (tokenScope === "group") {
      const data = await fetchGroupProjects(config, projectOrGroupPath);
      let values = data.map((p) => ({
        label: p.name,
        value: p.path_with_namespace,
        description: p.path_with_namespace,
      }));
      if (input.searchPhrase) {
        const lower = input.searchPhrase.toLowerCase();
        values = values.filter(
          (v) =>
            v.label.toLowerCase().includes(lower) ||
            v.value.toLowerCase().includes(lower),
        );
      }
      return { suggestedValues: values.slice(0, 50) };
    }

    return { suggestedValues: [] };
  };
}

function filterBySearch<T extends { label: string }>(
  values: T[],
  searchPhrase: string | undefined,
): T[] {
  if (!searchPhrase) return values;
  const lower = searchPhrase.toLowerCase();
  return values.filter((v) => v.label.toLowerCase().includes(lower));
}

export function suggestLabels(requireProjectId = true) {
  return async (input: any) => {
    const projectId = input.staticInputConfig?.projectId as string | undefined;
    if (!projectId && requireProjectId) {
      return {
        suggestedValues: [],
        message: "Configure Project ID to receive label suggestions.",
      };
    }
    if (!projectId) return { suggestedValues: [] };
    const data = await fetchLabels(input.app.config as AppConfig, projectId);
    const values = data.map((l) => ({ label: l.name, value: l.name }));
    return {
      suggestedValues: filterBySearch(values, input.searchPhrase).slice(0, 50),
    };
  };
}

export function suggestMilestones() {
  return async (input: any) => {
    const projectId = input.staticInputConfig?.projectId as string | undefined;
    if (!projectId) {
      return {
        suggestedValues: [],
        message: "Configure Project ID to receive milestone suggestions.",
      };
    }
    const data = await fetchMilestones(
      input.app.config as AppConfig,
      projectId,
    );
    const values = data.map((m) => ({
      label: m.title,
      value: m.id.toString(),
      description: m.description,
    }));
    return {
      suggestedValues: filterBySearch(values, input.searchPhrase).slice(0, 50),
    };
  };
}

export function suggestMembers() {
  return async (input: any) => {
    const projectId = input.staticInputConfig?.projectId as string | undefined;
    if (!projectId) {
      return {
        suggestedValues: [],
        message: "Configure Project ID to receive member suggestions.",
      };
    }
    const data = await fetchMembers(input.app.config as AppConfig, projectId);
    const values = data.map((m) => ({
      label: `${m.name} (${m.username})`,
      value: m.id.toString(),
    }));
    return {
      suggestedValues: filterBySearch(values, input.searchPhrase).slice(0, 50),
    };
  };
}

export function suggestBranches() {
  return async (input: any) => {
    const projectId = input.staticInputConfig?.projectId as string | undefined;
    if (!projectId) {
      return {
        suggestedValues: [],
        message: "Configure Project ID to receive branch suggestions.",
      };
    }
    const data = await fetchBranches(input.app.config as AppConfig, projectId);
    const values = data.map((b) => ({ label: b.name, value: b.name }));
    return {
      suggestedValues: filterBySearch(values, input.searchPhrase).slice(0, 50),
    };
  };
}
