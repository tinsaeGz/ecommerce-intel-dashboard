import { useReducer, type ReactNode } from "react";
import { initialScenario, scenarioReducer, ScenarioContext } from "../lib/sample-scenario";

export function SampleScenarioProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(scenarioReducer, initialScenario);
  return <ScenarioContext.Provider value={{ state, dispatch }}>{children}</ScenarioContext.Provider>;
}
