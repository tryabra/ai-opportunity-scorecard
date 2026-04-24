"use client";

import { useState, useTransition } from "react";

import type {
  AccessTier,
  ScorecardInput,
  ScorecardResult,
} from "@/lib/scorecard-schema";

type ViewerState = {
  experienceId: string;
  tier: AccessTier;
  accessLevel: "admin" | "customer" | "no_access";
  isDevBypass: boolean;
};

type ScorecardAppProps = {
  viewer: ViewerState;
};

type FormState = Omit<ScorecardInput, "experienceId">;

const initialFormState: FormState = {
  businessType: "",
  teamSize: "1",
  revenueBand: "under 10k",
  recurringWorkflows: ["", "", ""],
  currentTools: "",
  bottlenecks: ["", "", ""],
  contentEnginePresent: false,
  salesProcessPresent: false,
  serviceDeliveryProcessPresent: false,
};

function cleanArray(values: string[]) {
  return values.map((value) => value.trim()).filter(Boolean);
}

export function ScorecardApp({ viewer }: ScorecardAppProps) {
  const [hasStarted, setHasStarted] = useState(false);
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [formError, setFormError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [result, setResult] = useState<ScorecardResult | null>(null);
  const [isPending, startTransition] = useTransition();

  function updateWorkflow(index: number, value: string) {
    setFormState((current) => {
      const next = [...current.recurringWorkflows];
      next[index] = value;
      return { ...current, recurringWorkflows: next };
    });
  }

  function updateBottleneck(index: number, value: string) {
    setFormState((current) => {
      const next = [...current.bottlenecks];
      next[index] = value;
      return { ...current, bottlenecks: next };
    });
  }

  function validate() {
    const recurringWorkflows = cleanArray(formState.recurringWorkflows);
    const bottlenecks = cleanArray(formState.bottlenecks);

    if (!formState.businessType.trim()) {
      return "Add the business type before running the scorecard.";
    }

    if (recurringWorkflows.length < 2) {
      return "Add at least two recurring workflows so the scorecard has something real to rank.";
    }

    if (bottlenecks.length < 1) {
      return "Add at least one bottleneck so the scorecard can see where work is getting stuck.";
    }

    if (!formState.currentTools.trim()) {
      return "List the current tools so the scorecard can judge implementation fit and likely cost.";
    }

    return null;
  }

  function reset() {
    setResult(null);
    setHasStarted(false);
    setFormState(initialFormState);
    setFormError(null);
    setApiError(null);
  }

  function handleSubmit() {
    const error = validate();
    setFormError(error);
    setApiError(null);

    if (error) {
      return;
    }

    startTransition(async () => {
      const payload: ScorecardInput = {
        experienceId: viewer.experienceId,
        businessType: formState.businessType.trim(),
        teamSize: formState.teamSize,
        revenueBand: formState.revenueBand,
        recurringWorkflows: cleanArray(formState.recurringWorkflows),
        currentTools: formState.currentTools.trim(),
        bottlenecks: cleanArray(formState.bottlenecks),
        contentEnginePresent: formState.contentEnginePresent,
        salesProcessPresent: formState.salesProcessPresent,
        serviceDeliveryProcessPresent: formState.serviceDeliveryProcessPresent,
      };

      const response = await fetch("/api/scorecard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setApiError(
          data.error ??
            "The scorecard could not be generated. Try again with more specific workflow detail."
        );
        return;
      }

      setResult(data.result);
    });
  }

  if (viewer.accessLevel === "no_access") {
    return (
      <div className="shell">
        <section className="panel empty-state">
          <h1>Access required</h1>
          <p>
            This tool is only available to members with access to this Whop
            experience.
          </p>
        </section>
      </div>
    );
  }

  if (result) {
    return (
      <div className="shell">
        <section className="hero">
          <div>
            <p className="eyebrow">AI Opportunity Scorecard</p>
            <h1>Top implementation opportunities</h1>
            <p className="subtle">
              A ranked view of where AI is worth implementing first inside this
              business.
            </p>
          </div>
          <button className="secondary-button" onClick={reset} type="button">
            Run another scorecard
          </button>
        </section>

        {viewer.isDevBypass ? (
          <div className="notice">Dev bypass is active for local preview.</div>
        ) : null}

        <section className="panel">
          <h2>Business snapshot</h2>
          <div className="snapshot-grid">
            <div>
              <span className="label">Business type</span>
              <p>{result.businessSnapshot.businessType}</p>
            </div>
            <div>
              <span className="label">Team size</span>
              <p>{result.businessSnapshot.teamSize}</p>
            </div>
            <div>
              <span className="label">Revenue band</span>
              <p>{result.businessSnapshot.revenueBand}</p>
            </div>
          </div>
          <div className="list-block">
            <span className="label">Recurring workflows</span>
            <ul>
              {result.businessSnapshot.recurringWorkflows.map((workflow) => (
                <li key={workflow}>{workflow}</li>
              ))}
            </ul>
          </div>
          <div className="list-block">
            <span className="label">Main bottlenecks</span>
            <ul>
              {result.businessSnapshot.bottlenecks.map((bottleneck) => (
                <li key={bottleneck}>{bottleneck}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="results-stack">
          {result.opportunities.map((opportunity, index) => (
            <article className="panel opportunity-card" key={opportunity.name}>
              <div className="opportunity-header">
                <div>
                  <p className="eyebrow">Rank {index + 1}</p>
                  <h2>{opportunity.name}</h2>
                  <p className="subtle">{opportunity.bucket}</p>
                </div>
                <div className="score-pill">
                  <span>{opportunity.score.total}</span>
                  <small>/ 25</small>
                </div>
              </div>

              <p>{opportunity.whyItMadeTheList}</p>

              <div className="meta-grid">
                <div>
                  <span className="label">Business impact</span>
                  <p>{opportunity.estimatedBusinessImpact}</p>
                </div>
                <div>
                  <span className="label">Difficulty</span>
                  <p>{opportunity.implementationDifficulty}</p>
                </div>
                <div>
                  <span className="label">Recommended mode</span>
                  <p>{opportunity.recommendedMode}</p>
                </div>
                <div>
                  <span className="label">Estimated tool cost</span>
                  <p>{opportunity.estimatedToolCostRange}</p>
                </div>
              </div>

              {result.tier === "premier" ? (
                <div className="score-breakdown">
                  <span className="label">Score breakdown</span>
                  <div className="score-grid">
                    <div>Pain: {opportunity.score.pain}</div>
                    <div>Frequency: {opportunity.score.frequency}</div>
                    <div>Speed to value: {opportunity.score.speedToValue}</div>
                    <div>Automation fit: {opportunity.score.automationFit}</div>
                    <div>Cost efficiency: {opportunity.score.costEfficiency}</div>
                  </div>
                </div>
              ) : null}

              <div className="first-move">
                <span className="label">First move</span>
                <p>{opportunity.firstMove}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="panel">
          <span className="label">Best first move</span>
          <p>{result.bestFirstMove}</p>
        </section>

        {result.tier === "free" ? (
          <section className="panel upgrade-panel">
            <h2>Premier unlock</h2>
            <p>
              Premier unlocks the full top 3 ranking, the score breakdown, and
              the recommended implementation order.
            </p>
          </section>
        ) : null}
      </div>
    );
  }

  return (
    <div className="shell">
      <section className="hero">
        <div>
          <p className="eyebrow">AI Opportunity Scorecard</p>
          <h1>Find the best place to implement AI first</h1>
          <p className="subtle">
            This tool ranks the top implementation opportunities inside a
            business. It is built to force prioritization, not generate a vague
            AI audit.
          </p>
        </div>
        {!hasStarted ? (
          <button
            className="primary-button"
            onClick={() => setHasStarted(true)}
            type="button"
          >
            Start scorecard
          </button>
        ) : null}
      </section>

      {viewer.isDevBypass ? (
        <div className="notice">Dev bypass is active for local preview.</div>
      ) : null}

      {hasStarted ? (
        <section className="panel form-panel">
          <div className="form-grid">
            <label className="field span-2">
              <span>What kind of business is this, and how do you make money?</span>
              <textarea
                rows={3}
                value={formState.businessType}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    businessType: event.target.value,
                  }))
                }
              />
            </label>

            <label className="field">
              <span>Team size</span>
              <select
                value={formState.teamSize}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    teamSize: event.target.value as FormState["teamSize"],
                  }))
                }
              >
                <option value="1">1</option>
                <option value="2 to 5">2 to 5</option>
                <option value="6 to 15">6 to 15</option>
                <option value="16+">16+</option>
              </select>
            </label>

            <label className="field">
              <span>Monthly revenue band</span>
              <select
                value={formState.revenueBand}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    revenueBand: event.target.value as FormState["revenueBand"],
                  }))
                }
              >
                <option value="under 10k">under 10k</option>
                <option value="10k to 30k">10k to 30k</option>
                <option value="30k to 100k">30k to 100k</option>
                <option value="100k+">100k+</option>
              </select>
            </label>

            {formState.recurringWorkflows.map((workflow, index) => (
              <label className="field span-2" key={`workflow-${index}`}>
                <span>Recurring workflow {index + 1}</span>
                <textarea
                  rows={2}
                  value={workflow}
                  onChange={(event) => updateWorkflow(index, event.target.value)}
                />
              </label>
            ))}

            <label className="field span-2">
              <span>What tools are already in the stack?</span>
              <textarea
                rows={2}
                value={formState.currentTools}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    currentTools: event.target.value,
                  }))
                }
              />
            </label>

            {formState.bottlenecks.map((bottleneck, index) => (
              <label className="field span-2" key={`bottleneck-${index}`}>
                <span>Bottleneck {index + 1}</span>
                <textarea
                  rows={2}
                  value={bottleneck}
                  onChange={(event) =>
                    updateBottleneck(index, event.target.value)
                  }
                />
              </label>
            ))}

            <label className="toggle">
              <input
                type="checkbox"
                checked={formState.contentEnginePresent}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    contentEnginePresent: event.target.checked,
                  }))
                }
              />
              <span>Content engine present</span>
            </label>

            <label className="toggle">
              <input
                type="checkbox"
                checked={formState.salesProcessPresent}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    salesProcessPresent: event.target.checked,
                  }))
                }
              />
              <span>Sales process present</span>
            </label>

            <label className="toggle">
              <input
                type="checkbox"
                checked={formState.serviceDeliveryProcessPresent}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    serviceDeliveryProcessPresent: event.target.checked,
                  }))
                }
              />
              <span>Service delivery process present</span>
            </label>
          </div>

          {formError ? <p className="error-text">{formError}</p> : null}
          {apiError ? <p className="error-text">{apiError}</p> : null}

          <div className="actions">
            <button
              className="secondary-button"
              onClick={() => setHasStarted(false)}
              type="button"
            >
              Back
            </button>
            <button
              className="primary-button"
              disabled={isPending}
              onClick={handleSubmit}
              type="button"
            >
              {isPending ? "Reviewing your workflows..." : "Generate scorecard"}
            </button>
          </div>
        </section>
      ) : (
        <section className="panel">
          <h2>What this tool returns</h2>
          <ul className="feature-list">
            <li>Top implementation opportunities ranked in the right order</li>
            <li>Clear first move for the best opportunity</li>
            <li>Difficulty, likely cost range, and automation fit</li>
          </ul>
        </section>
      )}
    </div>
  );
}
