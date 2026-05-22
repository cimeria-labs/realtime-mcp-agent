import path from "node:path";
import { z } from "zod";

export type PolicyDecision =
  | { status: "allow"; reason: string }
  | { status: "confirm"; reason: string }
  | { status: "block"; reason: string };

export const ToolNameSchema = z.enum([
  "open_app",
  "write_sandbox_file",
  "navigate_url"
]);

export type ToolName = z.infer<typeof ToolNameSchema>;

export interface SafetyPolicyConfig {
  sandboxDir: string;
  allowedDesktopApps: string[];
  allowedBrowserDomains: string[];
}

export const defaultPolicyConfig: SafetyPolicyConfig = {
  sandboxDir: process.env.SANDBOX_DIR ?? "./sandbox",
  allowedDesktopApps: parseCsv(process.env.ALLOW_DESKTOP_APPS, ["calculator", "notepad"]),
  allowedBrowserDomains: parseCsv(process.env.ALLOW_BROWSER_DOMAINS, ["example.com"])
};

function parseCsv(value: string | undefined, fallback: string[]): string[] {
  if (!value) return fallback;
  return value
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

export function decideToolUse(
  toolName: ToolName,
  args: Record<string, unknown>,
  config: SafetyPolicyConfig = defaultPolicyConfig
): PolicyDecision {
  switch (toolName) {
    case "open_app":
      return decideOpenApp(args, config);
    case "write_sandbox_file":
      return decideWriteSandboxFile(args, config);
    case "navigate_url":
      return decideNavigateUrl(args, config);
    default:
      return { status: "block", reason: "Unknown tool" };
  }
}

function decideOpenApp(
  args: Record<string, unknown>,
  config: SafetyPolicyConfig
): PolicyDecision {
  const appName = String(args.name ?? "").toLowerCase().trim();

  if (!appName) {
    return { status: "block", reason: "Missing app name" };
  }

  if (!config.allowedDesktopApps.includes(appName)) {
    return { status: "block", reason: `Desktop app '${appName}' is not allowlisted` };
  }

  return { status: "allow", reason: `Desktop app '${appName}' is allowlisted` };
}

function decideWriteSandboxFile(
  args: Record<string, unknown>,
  config: SafetyPolicyConfig
): PolicyDecision {
  const relativePath = String(args.path ?? "").trim();

  if (!relativePath) {
    return { status: "block", reason: "Missing file path" };
  }

  if (path.isAbsolute(relativePath)) {
    return { status: "block", reason: "Absolute paths are not allowed" };
  }

  const resolvedSandbox = path.resolve(config.sandboxDir);
  const resolvedTarget = path.resolve(resolvedSandbox, relativePath);

  if (!resolvedTarget.startsWith(resolvedSandbox + path.sep) && resolvedTarget !== resolvedSandbox) {
    return { status: "block", reason: "Path escapes sandbox directory" };
  }

  return { status: "allow", reason: "File path is inside sandbox" };
}

function decideNavigateUrl(
  args: Record<string, unknown>,
  config: SafetyPolicyConfig
): PolicyDecision {
  const rawUrl = String(args.url ?? "").trim();

  if (!rawUrl) {
    return { status: "block", reason: "Missing URL" };
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return { status: "block", reason: "Invalid URL" };
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return { status: "block", reason: `Blocked URL scheme: ${parsed.protocol}` };
  }

  const hostname = parsed.hostname.toLowerCase();
  const allowed = config.allowedBrowserDomains.some(
    (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
  );

  if (!allowed) {
    return { status: "confirm", reason: `Domain '${hostname}' is not explicitly allowlisted` };
  }

  return { status: "allow", reason: `Domain '${hostname}' is allowlisted` };
}
