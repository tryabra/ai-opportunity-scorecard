import Whop from "@whop/sdk";

let whopClient: Whop | null = null;

function requireEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is missing`);
  }

  return value;
}

export function getWhopSdk() {
  if (whopClient) {
    return whopClient;
  }

  whopClient = new Whop({
    apiKey: requireEnv("WHOP_API_KEY"),
    appID:
      process.env.WHOP_APP_ID ||
      process.env.NEXT_PUBLIC_WHOP_APP_ID ||
      undefined,
  });

  return whopClient;
}
