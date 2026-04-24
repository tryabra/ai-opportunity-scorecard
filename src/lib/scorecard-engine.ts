import type {
  AccessTier,
  ScorecardInput,
  ScorecardOpportunity,
  ScorecardResult,
} from "@/lib/scorecard-schema";

type CandidateBucket =
  | "lead handling"
  | "sales follow-up"
  | "client onboarding"
  | "fulfillment and delivery"
  | "call notes and summaries"
  | "SOPs and internal operations"
  | "content repurposing"
  | "reporting and analysis";

type Candidate = {
  bucket: CandidateBucket;
  name: string;
  source: string;
  sourceType: "workflow" | "bottleneck" | "inferred";
};

const bucketKeywordMap: Array<{
  bucket: CandidateBucket;
  keywords: string[];
}> = [
  {
    bucket: "sales follow-up",
    keywords: [
      "follow-up",
      "follow up",
      "proposal",
      "discovery call",
      "sales call",
      "lead nurture",
      "outreach",
      "pipeline",
      "close",
      "lead response",
    ],
  },
  {
    bucket: "lead handling",
    keywords: [
      "lead",
      "intake",
      "qualification",
      "inbound",
      "crm",
      "booking",
      "calendar",
      "inquiry",
    ],
  },
  {
    bucket: "client onboarding",
    keywords: [
      "onboarding",
      "kickoff",
      "welcome",
      "handoff",
      "client setup",
      "client intake",
    ],
  },
  {
    bucket: "fulfillment and delivery",
    keywords: [
      "fulfillment",
      "delivery",
      "project",
      "client work",
      "production",
      "task handoff",
      "implementation",
    ],
  },
  {
    bucket: "call notes and summaries",
    keywords: [
      "call notes",
      "notes",
      "meeting summary",
      "transcript",
      "summary",
      "action items",
      "follow up email",
    ],
  },
  {
    bucket: "content repurposing",
    keywords: [
      "content",
      "youtube",
      "newsletter",
      "social",
      "repurpose",
      "clip",
      "blog",
      "post",
      "transcript",
    ],
  },
  {
    bucket: "reporting and analysis",
    keywords: [
      "reporting",
      "report",
      "analytics",
      "dashboard",
      "scorecard",
      "tracking",
      "metrics",
      "kpi",
      "forecast",
    ],
  },
  {
    bucket: "SOPs and internal operations",
    keywords: [
      "sop",
      "process",
      "operations",
      "handoff",
      "internal",
      "admin",
      "documentation",
      "standardize",
    ],
  },
];

const bucketMetadata: Record<
  CandidateBucket,
  {
    basePain: number;
    baseFrequency: number;
    baseSpeed: number;
    baseFit: number;
    baseCost: number;
    defaultDifficulty: "low" | "medium" | "high";
    defaultMode: "manual with AI" | "semi-automated" | "automated";
    costRange: string;
    impactTemplate: string;
    whyTemplate: string;
    firstMoveTemplate: string;
  }
> = {
  "lead handling": {
    basePain: 4,
    baseFrequency: 4,
    baseSpeed: 4,
    baseFit: 4,
    baseCost: 4,
    defaultDifficulty: "medium",
    defaultMode: "semi-automated",
    costRange: "$20 to $150 per month",
    impactTemplate:
      "This reduces response delays, dropped leads, and manual intake friction.",
    whyTemplate:
      "It ranked high because lead flow tends to happen repeatedly, the handoff points are usually visible, and small improvements create immediate operational clarity.",
    firstMoveTemplate:
      "Map the current lead path from first contact to next action, then standardize the fields and decisions before adding automation.",
  },
  "sales follow-up": {
    basePain: 5,
    baseFrequency: 4,
    baseSpeed: 5,
    baseFit: 4,
    baseCost: 4,
    defaultDifficulty: "low",
    defaultMode: "manual with AI",
    costRange: "$20 to $100 per month",
    impactTemplate:
      "This can tighten lead response, reduce stalled deals, and make follow-up more consistent.",
    whyTemplate:
      "It ranked high because follow-up usually happens every week, missed follow-up leaks revenue quickly, and the inputs are often already present in notes or CRM records.",
    firstMoveTemplate:
      "Collect one week of real follow-up examples, then standardize the structure of the draft, the CRM note, and the next step.",
  },
  "client onboarding": {
    basePain: 4,
    baseFrequency: 3,
    baseSpeed: 4,
    baseFit: 4,
    baseCost: 4,
    defaultDifficulty: "medium",
    defaultMode: "semi-automated",
    costRange: "$20 to $150 per month",
    impactTemplate:
      "This reduces onboarding delays, missing info, and sloppy first-week handoffs.",
    whyTemplate:
      "It ranked high because onboarding is usually structured enough to standardize and the value shows up quickly in smoother delivery.",
    firstMoveTemplate:
      "Document the onboarding sequence step by step, then isolate the information collection and handoff points first.",
  },
  "fulfillment and delivery": {
    basePain: 4,
    baseFrequency: 3,
    baseSpeed: 3,
    baseFit: 3,
    baseCost: 3,
    defaultDifficulty: "high",
    defaultMode: "semi-automated",
    costRange: "$50 to $250 per month",
    impactTemplate:
      "This can reduce delivery bottlenecks and make recurring client work more consistent.",
    whyTemplate:
      "It ranked high because delivery friction compounds across the whole business, but the process usually needs more cleanup before deeper automation is worth it.",
    firstMoveTemplate:
      "Pick one recurring delivery step, define the exact inputs and outputs, and test AI assistance there before touching the full workflow.",
  },
  "call notes and summaries": {
    basePain: 4,
    baseFrequency: 4,
    baseSpeed: 5,
    baseFit: 5,
    baseCost: 5,
    defaultDifficulty: "low",
    defaultMode: "manual with AI",
    costRange: "$0 to $50 per month",
    impactTemplate:
      "This saves immediate admin time and creates cleaner follow-up, next actions, and records.",
    whyTemplate:
      "It ranked high because notes and summaries are highly repeatable, the structure is clear, and the user can get value almost immediately.",
    firstMoveTemplate:
      "Take three recent calls and standardize the summary format, action items, and follow-up output before trying anything more complex.",
  },
  "SOPs and internal operations": {
    basePain: 3,
    baseFrequency: 4,
    baseSpeed: 3,
    baseFit: 4,
    baseCost: 5,
    defaultDifficulty: "medium",
    defaultMode: "manual with AI",
    costRange: "$0 to $50 per month",
    impactTemplate:
      "This reduces internal inconsistency and makes later automation easier to justify.",
    whyTemplate:
      "It ranked high because repeated internal work usually hides preventable friction, and clearer SOPs make everything downstream easier.",
    firstMoveTemplate:
      "Choose one messy recurring internal process and rewrite it into a stable SOP before adding software on top.",
  },
  "content repurposing": {
    basePain: 3,
    baseFrequency: 4,
    baseSpeed: 4,
    baseFit: 4,
    baseCost: 4,
    defaultDifficulty: "low",
    defaultMode: "manual with AI",
    costRange: "$20 to $100 per month",
    impactTemplate:
      "This increases content output without requiring a full second production pass every time.",
    whyTemplate:
      "It ranked high because content engines create repeated source material, the structure is visible, and fast output is possible with low setup friction.",
    firstMoveTemplate:
      "Pick one source asset type, define the exact derivative outputs you want, and standardize the prompt or pipeline around that one format.",
  },
  "reporting and analysis": {
    basePain: 3,
    baseFrequency: 3,
    baseSpeed: 3,
    baseFit: 4,
    baseCost: 4,
    defaultDifficulty: "medium",
    defaultMode: "semi-automated",
    costRange: "$20 to $150 per month",
    impactTemplate:
      "This improves visibility so decisions stop relying on scattered data or gut feel.",
    whyTemplate:
      "It ranked high because reporting gaps affect decision quality, and standard metrics are often easier to structure than people expect.",
    firstMoveTemplate:
      "Define the handful of numbers that actually drive decisions first, then build the lightest reporting layer that surfaces them consistently.",
  },
};

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

function detectBucket(input: string): CandidateBucket {
  const normalized = normalizeText(input);

  for (const entry of bucketKeywordMap) {
    if (entry.keywords.some((keyword) => normalized.includes(keyword))) {
      return entry.bucket;
    }
  }

  return "SOPs and internal operations";
}

function titleCaseCandidate(input: string) {
  return input
    .trim()
    .replace(/\s+/g, " ")
    .replace(/^\w/, (char) => char.toUpperCase());
}

function inferCandidates(input: ScorecardInput): Candidate[] {
  const seeded: Candidate[] = [
    ...input.recurringWorkflows.map((item) => ({
      bucket: detectBucket(item),
      name: titleCaseCandidate(item),
      source: item,
      sourceType: "workflow" as const,
    })),
    ...input.bottlenecks.map((item) => ({
      bucket: detectBucket(item),
      name: titleCaseCandidate(item),
      source: item,
      sourceType: "bottleneck" as const,
    })),
  ];

  if (
    input.salesProcessPresent &&
    !seeded.some((candidate) => candidate.bucket === "sales follow-up")
  ) {
    seeded.push({
      bucket: "sales follow-up",
      name: "Sales follow-up after conversations",
      source: "sales process present",
      sourceType: "inferred",
    });
  }

  if (
    input.serviceDeliveryProcessPresent &&
    !seeded.some((candidate) => candidate.bucket === "client onboarding")
  ) {
    seeded.push({
      bucket: "client onboarding",
      name: "Client onboarding and handoff",
      source: "service delivery process present",
      sourceType: "inferred",
    });
  }

  if (
    input.contentEnginePresent &&
    !seeded.some((candidate) => candidate.bucket === "content repurposing")
  ) {
    seeded.push({
      bucket: "content repurposing",
      name: "Content repurposing from existing assets",
      source: "content engine present",
      sourceType: "inferred",
    });
  }

  const sourcePriority: Record<Candidate["sourceType"], number> = {
    workflow: 3,
    bottleneck: 2,
    inferred: 1,
  };

  const deduped = new Map<CandidateBucket, Candidate>();
  for (const candidate of seeded) {
    const existing = deduped.get(candidate.bucket);

    if (!existing) {
      deduped.set(candidate.bucket, candidate);
      continue;
    }

    const existingPriority = sourcePriority[existing.sourceType];
    const candidatePriority = sourcePriority[candidate.sourceType];

    if (candidatePriority > existingPriority) {
      deduped.set(candidate.bucket, candidate);
      continue;
    }

    if (
      candidatePriority === existingPriority &&
      candidate.name.length > existing.name.length
    ) {
      deduped.set(candidate.bucket, candidate);
    }
  }

  return Array.from(deduped.values()).slice(0, 6);
}

function includesAny(text: string, phrases: string[]) {
  const normalized = normalizeText(text);
  return phrases.some((phrase) => normalized.includes(phrase));
}

function derivePainScore(candidate: Candidate, input: ScorecardInput) {
  let score = bucketMetadata[candidate.bucket].basePain;
  const allBottlenecks = input.bottlenecks.join(" ");

  if (includesAny(allBottlenecks, ["delay", "stuck", "slow", "drop", "miss"])) {
    score += 1;
  }

  if (
    includesAny(candidate.source, [
      "follow-up",
      "proposal",
      "lead",
      "onboarding",
      "handoff",
    ])
  ) {
    score += 1;
  }

  return Math.min(score, 5);
}

function deriveFrequencyScore(candidate: Candidate, input: ScorecardInput) {
  let score = bucketMetadata[candidate.bucket].baseFrequency;

  if (candidate.sourceType === "workflow") {
    score += 1;
  }

  if (
    includesAny(input.recurringWorkflows.join(" "), [
      "daily",
      "every day",
      "every week",
      "weekly",
      "each call",
      "every call",
    ])
  ) {
    score += 1;
  }

  return Math.min(score, 5);
}

function deriveSpeedScore(candidate: Candidate) {
  return bucketMetadata[candidate.bucket].baseSpeed;
}

function deriveAutomationFit(candidate: Candidate, input: ScorecardInput) {
  let score = bucketMetadata[candidate.bucket].baseFit;

  if (
    includesAny(candidate.source, [
      "custom",
      "creative",
      "ad hoc",
      "bespoke",
      "manual review",
    ])
  ) {
    score -= 1;
  }

  if (
    includesAny(input.currentTools, [
      "crm",
      "notion",
      "hubspot",
      "ghl",
      "gohighlevel",
      "clickup",
      "airtable",
    ])
  ) {
    score += 1;
  }

  return Math.max(1, Math.min(score, 5));
}

function deriveCostEfficiency(candidate: Candidate) {
  return bucketMetadata[candidate.bucket].baseCost;
}

function applyPenalty(score: number, candidate: Candidate) {
  let adjusted = score;

  if (
    includesAny(candidate.source, [
      "rare",
      "once a month",
      "occasionally",
      "creative",
      "custom",
    ])
  ) {
    adjusted -= 2;
  }

  if (
    includesAny(candidate.source, ["every time is different", "varies a lot"])
  ) {
    adjusted -= 2;
  }

  return Math.max(5, adjusted);
}

function scoreCandidate(
  candidate: Candidate,
  input: ScorecardInput
): ScorecardOpportunity {
  const pain = derivePainScore(candidate, input);
  const frequency = deriveFrequencyScore(candidate, input);
  const speedToValue = deriveSpeedScore(candidate);
  const automationFit = deriveAutomationFit(candidate, input);
  const costEfficiency = deriveCostEfficiency(candidate);

  const rawTotal =
    pain + frequency + speedToValue + automationFit + costEfficiency;
  const total = applyPenalty(rawTotal, candidate);
  const metadata = bucketMetadata[candidate.bucket];

  return {
    name: candidate.name,
    bucket: candidate.bucket,
    score: {
      pain,
      frequency,
      speedToValue,
      automationFit,
      costEfficiency,
      total,
    },
    whyItMadeTheList: metadata.whyTemplate,
    estimatedBusinessImpact: metadata.impactTemplate,
    implementationDifficulty: metadata.defaultDifficulty,
    recommendedMode: metadata.defaultMode,
    estimatedToolCostRange: metadata.costRange,
    firstMove: metadata.firstMoveTemplate,
  };
}

function buildBusinessSnapshot(input: ScorecardInput) {
  return {
    businessType: input.businessType,
    teamSize: input.teamSize,
    revenueBand: input.revenueBand,
    recurringWorkflows: input.recurringWorkflows,
    bottlenecks: input.bottlenecks,
  };
}

function applyTier(result: ScorecardResult, tier: AccessTier): ScorecardResult {
  if (tier === "premier") {
    return result;
  }

  const firstOpportunity = result.opportunities[0]
    ? [
        {
          ...result.opportunities[0],
          estimatedToolCostRange: "Premier only",
        },
      ]
    : [];

  return {
    ...result,
    tier,
    opportunities: firstOpportunity,
  };
}

export function generateScorecard(
  input: ScorecardInput,
  tier: AccessTier
): ScorecardResult {
  const opportunities = inferCandidates(input)
    .map((candidate) => scoreCandidate(candidate, input))
    .sort((left, right) => right.score.total - left.score.total)
    .slice(0, 3);

  const bestFirstMove =
    opportunities[0]?.firstMove ??
    "Add more detail to the recurring workflows so the scorecard can rank real opportunities.";

  const result: ScorecardResult = {
    businessSnapshot: buildBusinessSnapshot(input),
    opportunities,
    bestFirstMove,
    tier,
    engine: "deterministic",
  };

  return applyTier(result, tier);
}
