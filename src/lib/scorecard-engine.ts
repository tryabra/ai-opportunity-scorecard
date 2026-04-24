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
    implementationOutline: [string, string, string];
    automateNow: string;
    keepManual: string;
    watchout: string;
    successSignal: string;
    recommendedStack: Array<{ name: string; reason: string }>;
    suggestedAbraAssets: Array<{ name: string; reason: string }>;
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
    implementationOutline: [
      "Define the exact lead stages, required fields, and qualification decisions.",
      "Standardize intake capture across forms, DMs, and booked calls.",
      "Automate routing, task creation, and the first response once the process is stable.",
    ],
    automateNow:
      "Lead capture, stage assignment, response drafting, and task creation.",
    keepManual:
      "Final qualification judgment, edge-case routing, and offer-specific positioning.",
    watchout:
      "Do not automate routing before the qualification fields and pipeline stages are consistent.",
    successSignal:
      "Every inbound lead lands in the right stage with the right next action on the same day.",
    recommendedStack: [
      { name: "GoHighLevel", reason: "Use it as the system of record for lead stages, forms, and follow-up." },
      { name: "OpenRouter", reason: "Use it to draft qualification summaries and first-response copy." },
      { name: "Google Calendar", reason: "Use calendar events as a structured trigger for booked-call handoff." },
    ],
    suggestedAbraAssets: [
      { name: "Offer Environment Analyzer", reason: "Use it to tighten the offer and lead path before automating intake." },
      { name: "AI Business Development", reason: "Use it when lead handling issues are tied to weak outreach or pipeline structure." },
    ],
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
    implementationOutline: [
      "Collect recent follow-up examples and define the output format you want every time.",
      "Turn call notes into a standard summary, next-step list, and draft follow-up message.",
      "Automate CRM updates and task creation once the output structure is stable.",
    ],
    automateNow:
      "Call summary formatting, email drafts, CRM notes, and next-step task creation.",
    keepManual:
      "Relationship judgment, proposal strategy, and sensitive deal positioning.",
    watchout:
      "Do not automate follow-up timing or messaging before the team agrees on what a good next step looks like.",
    successSignal:
      "Every conversation produces a clean summary, a drafted follow-up, and a visible next action without manual cleanup.",
    recommendedStack: [
      { name: "GoHighLevel", reason: "Use it for pipeline movement, tasks, and follow-up tracking." },
      { name: "Gmail", reason: "Use it as the delivery layer for drafted follow-up once the structure is defined." },
      { name: "OpenRouter", reason: "Use it to turn notes and transcripts into next-step drafts and summaries." },
    ],
    suggestedAbraAssets: [
      { name: "Sales Call Coach", reason: "Use it to improve the quality of the conversations feeding your follow-up." },
      { name: "Offer Environment Analyzer", reason: "Use it if follow-up is weak because the offer and buying path are unclear." },
    ],
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
    implementationOutline: [
      "Write the onboarding sequence from signed client to first delivery milestone.",
      "Standardize all inputs, kickoff notes, and handoff fields.",
      "Automate reminders, document generation, and internal notifications after the process is stable.",
    ],
    automateNow:
      "Kickoff forms, internal handoff summaries, reminders, and project setup steps.",
    keepManual:
      "Client expectation setting, edge-case onboarding decisions, and strategic kickoff judgment.",
    watchout:
      "If the onboarding sequence changes every time, fix the service design before adding more software.",
    successSignal:
      "New clients move from sold to active without missing information or internal confusion.",
    recommendedStack: [
      { name: "GoHighLevel", reason: "Use it to collect onboarding inputs and trigger follow-up steps." },
      { name: "Google Docs", reason: "Use it for standardized kickoff notes and client-facing documents." },
      { name: "OpenRouter", reason: "Use it to summarize kickoff calls and generate setup checklists." },
    ],
    suggestedAbraAssets: [
      { name: "Offer Environment Analyzer", reason: "Use it if onboarding friction is really an offer or delivery design problem." },
    ],
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
    implementationOutline: [
      "Choose one repeated delivery step with stable inputs and outputs.",
      "Define the exact handoff format, approval point, and success criteria.",
      "Add AI assistance to the narrowest high-friction step before broadening the workflow.",
    ],
    automateNow:
      "Drafting recurring deliverables, summarizing updates, and generating internal prep notes.",
    keepManual:
      "Final client judgment, approval, and work that changes materially from one engagement to the next.",
    watchout:
      "Do not try to automate the whole delivery process at once. Pick one stable sub-process first.",
    successSignal:
      "The repeated delivery step takes less manual cleanup and produces more consistent output quality.",
    recommendedStack: [
      { name: "Google Docs", reason: "Use it to standardize recurring delivery templates and outputs." },
      { name: "OpenRouter", reason: "Use it for first-pass drafts, summaries, and internal prep work." },
      { name: "GoHighLevel", reason: "Use it for delivery-stage tracking and follow-up triggers when relevant." },
    ],
    suggestedAbraAssets: [
      { name: "Prompt Optimizer", reason: "Use it to tighten repeatable output prompts once the delivery format is defined." },
    ],
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
    implementationOutline: [
      "Define the exact note structure, action item format, and follow-up output you want after every call.",
      "Run the same structure across several recent calls to confirm it holds up.",
      "Automate summary generation and downstream task creation once the format is locked.",
    ],
    automateNow:
      "Summaries, action items, follow-up drafts, and CRM note formatting.",
    keepManual:
      "Interpretation of nuance, strategic judgment, and decisions that affect deal or client direction.",
    watchout:
      "Weak note structure creates weak automation. Standardize the template before scaling it.",
    successSignal:
      "Every call ends with a usable summary, next-step list, and follow-up draft within minutes.",
    recommendedStack: [
      { name: "OpenRouter", reason: "Use it to convert notes or transcripts into a standard post-call package." },
      { name: "Google Docs", reason: "Use it to define and test the note template before automating." },
      { name: "GoHighLevel", reason: "Use it to store the summary, task, and next-step outcome." },
    ],
    suggestedAbraAssets: [
      { name: "Sales Call Coach", reason: "Use it when call quality and post-call follow-up need to improve together." },
    ],
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
    implementationOutline: [
      "Pick one recurring internal process and document the current steps without cleaning them up yet.",
      "Rewrite it into a stable SOP with clear inputs, outputs, and handoff points.",
      "Automate only the repeatable parts after the SOP survives real use.",
    ],
    automateNow:
      "Documentation cleanup, checklist generation, summaries, and repeatable handoff steps.",
    keepManual:
      "Judgment calls, exceptions, and work that still depends on context-specific decision making.",
    watchout:
      "If the process is still vague, automation will just make the mess happen faster.",
    successSignal:
      "The process can be handed to another person without verbal explanation and still run cleanly.",
    recommendedStack: [
      { name: "Google Docs", reason: "Use it to create the base SOP and version the process clearly." },
      { name: "OpenRouter", reason: "Use it to turn messy notes into cleaner SOP drafts and checklists." },
      { name: "Whop Files", reason: "Use it to store repeatable internal references if the process supports community delivery." },
    ],
    suggestedAbraAssets: [
      { name: "Prompt Optimizer", reason: "Use it after the SOP exists to improve repeatable prompts tied to the process." },
    ],
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
    implementationOutline: [
      "Choose one source asset, one transcript flow, and the exact derivative outputs you want every time.",
      "Define the format for each output so repurposing does not depend on memory or taste each round.",
      "Automate draft generation and publish prep after the content structure is stable.",
    ],
    automateNow:
      "Transcript cleanup, first-pass repurposed drafts, title options, and distribution variants.",
    keepManual:
      "Final positioning, editorial judgment, and channel-specific nuance.",
    watchout:
      "Do not automate output volume before deciding what counts as a good repurposed asset.",
    successSignal:
      "One source asset reliably turns into several usable drafts without a second full production pass.",
    recommendedStack: [
      { name: "YouTube", reason: "Use it as the stable source layer for long-form content inputs." },
      { name: "Substack", reason: "Use it as one of the defined destination formats in the repurposing pipeline." },
      { name: "OpenRouter", reason: "Use it to generate structured derivatives from transcripts and source notes." },
    ],
    suggestedAbraAssets: [
      { name: "Prompt Optimizer", reason: "Use it to tighten repurposing prompts once the output formats are fixed." },
    ],
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
    implementationOutline: [
      "Define the small set of numbers that actually drive decisions.",
      "Choose the source of truth for each metric and remove duplicate reporting paths.",
      "Automate the collection and formatting after the metric definitions are stable.",
    ],
    automateNow:
      "Metric rollups, recurring summaries, and standard weekly reporting views.",
    keepManual:
      "Interpretation, diagnosis, and decisions about what actions the numbers should drive.",
    watchout:
      "A bad metric definition automated well still gives bad guidance. Fix definitions first.",
    successSignal:
      "The same core numbers are visible on time every cycle without manual aggregation work.",
    recommendedStack: [
      { name: "GoHighLevel", reason: "Use it if pipeline and lead metrics are part of the reporting set." },
      { name: "Google Sheets", reason: "Use it for a simple source-of-truth layer before building anything heavier." },
      { name: "OpenRouter", reason: "Use it to summarize what changed and flag anomalies in plain language." },
    ],
    suggestedAbraAssets: [
      { name: "Offer Environment Analyzer", reason: "Use it if weak reporting is hiding deeper offer or funnel issues." },
    ],
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
    implementationOutline: metadata.implementationOutline,
    automateNow: metadata.automateNow,
    keepManual: metadata.keepManual,
    watchout: metadata.watchout,
    successSignal: metadata.successSignal,
    recommendedStack: metadata.recommendedStack,
    suggestedAbraAssets: metadata.suggestedAbraAssets,
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
          recommendedStack: result.opportunities[0].recommendedStack.map(
            (item) => ({
              ...item,
              reason: "Premier only",
            })
          ),
          suggestedAbraAssets: result.opportunities[0].suggestedAbraAssets.map(
            (item) => ({
              ...item,
              reason: "Premier only",
            })
          ),
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
