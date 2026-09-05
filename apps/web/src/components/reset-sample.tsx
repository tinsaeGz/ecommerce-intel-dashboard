import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSampleScenario } from "../lib/sample-scenario";

export function ResetSample() {
  const { t } = useTranslation();
  const { dispatch } = useSampleScenario();
  const [resets, setResets] = useState(0);
  return <div className="sample-reset">
    <button className="button-link" data-variant="quiet" type="button" onClick={() => {
      dispatch({ type: "reset" }); setResets(count => count + 1);
    }}>{t("cinematic.reset")}</button>
    <p role="status" key={resets}>{resets > 0 ? t("cinematic.resetDone") : t("cinematic.memory")}</p>
  </div>;
}
