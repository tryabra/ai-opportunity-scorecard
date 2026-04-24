import { headers } from "next/headers";

import { getWhopSdk } from "@/lib/whop-sdk";

export type ViewerContext = {
  userId: string;
  accessLevel: "admin" | "customer" | "no_access";
  tier: "free" | "premier";
  isDevBypass: boolean;
};

function isDevBypassEnabled() {
  return (
    process.env.NODE_ENV !== "production" &&
    process.env.ALLOW_DEV_BYPASS === "true"
  );
}

export async function getViewerContext(
  experienceId: string
): Promise<ViewerContext | null> {
  const requestHeaders = await headers();
  const token =
    requestHeaders.get("x-whop-user-token") ||
    requestHeaders.get("X-Whop-User-Token");

  if (!token && isDevBypassEnabled()) {
    return {
      userId: "dev_bypass_user",
      accessLevel: "admin",
      tier: process.env.DEV_DEFAULT_TIER === "free" ? "free" : "premier",
      isDevBypass: true,
    };
  }

  const whopsdk = getWhopSdk();
  const verifiedUser = await whopsdk.verifyUserToken(requestHeaders, {
    dontThrow: true,
  });

  if (!verifiedUser) {
    if (!isDevBypassEnabled()) {
      return null;
    }

    return {
      userId: "dev_bypass_user",
      accessLevel: "admin",
      tier: process.env.DEV_DEFAULT_TIER === "free" ? "free" : "premier",
      isDevBypass: true,
    };
  }

  const access = await whopsdk.users.checkAccess(experienceId, {
    id: verifiedUser.userId,
  });

  if (!access.has_access || access.access_level === "no_access") {
    return {
      userId: verifiedUser.userId,
      accessLevel: "no_access",
      tier: "free",
      isDevBypass: false,
    };
  }

  const tierResourceId = process.env.WHOP_PREMIER_RESOURCE_ID;
  let tier: "free" | "premier" = "premier";

  if (tierResourceId) {
    const tierAccess = await whopsdk.users.checkAccess(tierResourceId, {
      id: verifiedUser.userId,
    });
    tier = tierAccess.has_access ? "premier" : "free";
  }

  return {
    userId: verifiedUser.userId,
    accessLevel: access.access_level === "admin" ? "admin" : "customer",
    tier,
    isDevBypass: false,
  };
}
