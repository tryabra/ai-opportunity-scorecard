import { ScorecardApp } from "@/components/scorecard-app";
import { getViewerContext } from "@/lib/auth";

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ experienceId: string }>;
}) {
  const { experienceId } = await params;
  const viewer = await getViewerContext(experienceId);

  return (
    <ScorecardApp
      viewer={{
        experienceId,
        accessLevel: viewer?.accessLevel ?? "no_access",
        tier: viewer?.tier ?? "free",
        isDevBypass: viewer?.isDevBypass ?? false,
      }}
    />
  );
}
