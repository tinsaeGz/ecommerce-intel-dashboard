import type { ProblemDetails } from "@suq-insights/shared-types";

import type { components, paths } from "./schema";

export type ApiPaths = paths;
export type VersionResponse = components["schemas"]["VersionResponse"];

export class ApiProblem extends Error {
  readonly problem: ProblemDetails;

  constructor(problem: ProblemDetails) {
    super(problem.detail);
    this.name = "ApiProblem";
    this.problem = problem;
  }
}

export interface ApiClientOptions {
  baseUrl?: string;
  fetch?: typeof globalThis.fetch;
}

export function createApiClient(options: ApiClientOptions = {}) {
  const baseUrl = options.baseUrl ?? "";
  const fetchImplementation = options.fetch ?? globalThis.fetch;

  return {
    async version(): Promise<VersionResponse> {
      const response = await fetchImplementation(`${baseUrl}/v1/version`, {
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Version request failed with status ${response.status}`);
      }

      return (await response.json()) as VersionResponse;
    },
  };
}
