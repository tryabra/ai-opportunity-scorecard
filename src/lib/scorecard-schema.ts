import { z } from "zod";

export const teamSizeOptions = ["1", "2 to 5", "6 to 15", "16+"] as const;
export const revenueBandOptions = [
  "under 10k",
  "10k to 30k",
  "30k to 100k",
  "100k+",
] as const;
export const implementationDifficultyOptions = [
  "low",
  "medium",
  "high",
] as const;
export const recommendedModeOptions = [
  "manual with AI",
  "semi-automated",
  "automated",
] as const;
export const accessTierOptions = ["free", "premier"] as const;
export const accessTierSchema = z.enum(accessTierOptions);

export const scorecardInputSchema = z.object({
  experienceId: z.string().min(1),
  businessType: z.string().min(2),
  teamSize: z.enum(teamSizeOptions),
  revenueBand: z.enum(revenueBandOptions),
  recurringWorkflows: z
    .array(z.string().trim().min(3))
    .min(2)
    .max(3),
  currentTools: z.string().trim().min(2),
  bottlenecks: z.array(z.string().trim().min(3)).min(1).max(3),
  contentEnginePresent: z.boolean(),
  salesProcessPresent: z.boolean(),
  serviceDeliveryProcessPresent: z.boolean(),
});

export const opportunityScoreSchema = z.object({
  pain: z.number().int().min(1).max(5),
  frequency: z.number().int().min(1).max(5),
  speedToValue: z.number().int().min(1).max(5),
  automationFit: z.number().int().min(1).max(5),
  costEfficiency: z.number().int().min(1).max(5),
  total: z.number().int().min(5).max(25),
});

export const recommendationSchema = z.object({
  name: z.string().min(1),
  reason: z.string().min(1),
});

export const scorecardOpportunitySchema = z.object({
  name: z.string().min(1),
  bucket: z.string().min(1),
  whyItMadeTheList: z.string().min(1),
  estimatedBusinessImpact: z.string().min(1),
  implementationDifficulty: z.enum(implementationDifficultyOptions),
  recommendedMode: z.enum(recommendedModeOptions),
  estimatedToolCostRange: z.string().min(1),
  firstMove: z.string().min(1),
  implementationOutline: z.array(z.string().min(1)).length(3),
  automateNow: z.string().min(1),
  keepManual: z.string().min(1),
  watchout: z.string().min(1),
  successSignal: z.string().min(1),
  recommendedStack: z.array(recommendationSchema).min(1).max(3),
  suggestedAbraAssets: z.array(recommendationSchema).max(3),
  score: opportunityScoreSchema,
});

export const scorecardResultSchema = z.object({
  businessSnapshot: z.object({
    businessType: z.string().min(1),
    teamSize: z.string().min(1),
    revenueBand: z.string().min(1),
    recurringWorkflows: z.array(z.string()).min(1),
    bottlenecks: z.array(z.string()).min(1),
  }),
  opportunities: z.array(scorecardOpportunitySchema).max(3),
  bestFirstMove: z.string().min(1),
  tier: accessTierSchema,
  engine: z.enum(["deterministic"]),
});

export type ScorecardInput = z.infer<typeof scorecardInputSchema>;
export type ScorecardResult = z.infer<typeof scorecardResultSchema>;
export type ScorecardOpportunity = z.infer<typeof scorecardOpportunitySchema>;
export type AccessTier = z.infer<typeof accessTierSchema>;
