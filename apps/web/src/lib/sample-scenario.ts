import { createContext, useContext, type Dispatch } from "react";
import type { PreviewMetric } from "./demo-data";

export const sourceKeys = ["csv", "excel", "paste", "json", "pos", "marketplace", "image", "pdf", "manual", "api"] as const;
export type SampleSource = (typeof sourceKeys)[number];
export type ReviewRole = "itemIdentity" | "customerIdentity" | "notAnalyzed";
export type SaleStatus = "idle" | "review" | "recorded";
export interface SampleScenario {
  source: SampleSource;
  role: ReviewRole;
  confirmed: boolean;
  sale: SaleStatus;
  hasIdentity: boolean;
  metric: PreviewMetric;
  observation: number;
  stockIndex: number;
}
export const initialScenario: SampleScenario = {
  source: "csv", role: "itemIdentity", confirmed: false, sale: "idle",
  hasIdentity: true, metric: "revenue", observation: 7, stockIndex: 0,
};
export type ScenarioAction =
  | { type: "source"; value: SampleSource }
  | { type: "role"; value: ReviewRole }
  | { type: "identity"; value: boolean }
  | { type: "metric"; value: PreviewMetric }
  | { type: "observation" | "stock"; value: number }
  | { type: "confirm-review" | "reset-review" | "preview-sale" | "confirm-sale" | "cancel-sale" | "undo-sale" | "reset" };

export function scenarioReducer(state: SampleScenario, action: ScenarioAction): SampleScenario {
  switch (action.type) {
    case "source": return action.value === state.source ? state : { ...state, source: action.value, confirmed: false };
    case "role": return action.value === state.role ? state : { ...state, role: action.value, confirmed: false };
    case "confirm-review": return { ...state, confirmed: true };
    case "reset-review": return { ...state, role: "itemIdentity", confirmed: false };
    case "identity": return { ...state, hasIdentity: action.value };
    case "metric": return { ...state, metric: action.value };
    case "observation": return Number.isInteger(action.value) && action.value >= 0 && action.value <= 7 ? { ...state, observation: action.value } : state;
    case "stock": return Number.isInteger(action.value) && action.value >= 0 && action.value < 3 ? { ...state, stockIndex: action.value } : state;
    case "preview-sale": return state.sale === "idle" ? { ...state, sale: "review" } : state;
    case "confirm-sale": return state.sale === "review" ? { ...state, sale: "recorded" } : state;
    case "cancel-sale": return state.sale === "review" ? { ...state, sale: "idle" } : state;
    case "undo-sale": return state.sale === "recorded" ? { ...state, sale: "idle" } : state;
    case "reset": return { ...initialScenario };
  }
}

export const ScenarioContext = createContext<{ state: SampleScenario; dispatch: Dispatch<ScenarioAction> } | null>(null);
export function useSampleScenario() {
  const scenario = useContext(ScenarioContext);
  if (!scenario) throw new Error("SampleScenarioProvider is required");
  return scenario;
}
