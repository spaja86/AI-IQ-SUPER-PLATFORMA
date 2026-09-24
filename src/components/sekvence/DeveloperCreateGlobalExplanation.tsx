import {
  DEVELOPER_CREATE_VRH_MAPE_UMA_EXPLANATION_TITLE,
  DEVELOPER_CREATE_VRH_MAPE_UMA_SCOPE_LOCK,
  DEVELOPER_CREATE_VRH_MAPE_UMA_READINESS_MODEL,
  DEVELOPER_CREATE_VRH_MAPE_UMA_THEMATIC_SIGNALS,
} from '@/lib/developer-create-vrh-mape-uma-contract';

export default function DeveloperCreateGlobalExplanation() {
  return (
    <section
      id="developer-create-vrh-mape-uma-global-explanation"
      aria-label={DEVELOPER_CREATE_VRH_MAPE_UMA_EXPLANATION_TITLE}
      className="rounded-2xl border border-blue-500/30 bg-blue-950/20 p-4 md:p-5"
    >
      <h2 className="text-sm font-semibold text-blue-200 md:text-base">
        {DEVELOPER_CREATE_VRH_MAPE_UMA_EXPLANATION_TITLE}
      </h2>
      <p className="mt-2 text-xs text-blue-100/90 md:text-sm">{DEVELOPER_CREATE_VRH_MAPE_UMA_SCOPE_LOCK}</p>
      <p className="mt-2 text-xs text-blue-100/80 md:text-sm">
        Additive-only reflection sloj (bez novih runtime ruta, bez promene ownership split-a).
      </p>
      <p className="mt-2 text-xs text-blue-100/80 md:text-sm">
        Status model: {DEVELOPER_CREATE_VRH_MAPE_UMA_READINESS_MODEL.join(' / ')}.
      </p>
      <p className="mt-1 text-xs text-blue-100/80 md:text-sm">
        Signal paket: {DEVELOPER_CREATE_VRH_MAPE_UMA_THEMATIC_SIGNALS.join(', ')}.
      </p>
    </section>
  );
}
