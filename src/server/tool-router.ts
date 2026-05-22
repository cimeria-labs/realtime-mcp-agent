import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { decideToolUse, defaultPolicyConfig, ToolNameSchema } from "./safety-policy.js";

const OpenAppArgsSchema = z.object({
  name: z.string().min(1)
});

const WriteSandboxFileArgsSchema = z.object({
  path: z.string().min(1),
  content: z.string().default("")
});

const NavigateUrlArgsSchema = z.object({
  url: z.string().url()
});

export interface ToolResult {
  ok: boolean;
  tool: string;
  message: string;
  data?: Record<string, unknown>;
}

export async function routeToolCall(
  toolNameInput: string,
  argsInput: Record<string, unknown>
): Promise<ToolResult> {
  const toolName = ToolNameSchema.parse(toolNameInput);
  const decision = decideToolUse(toolName, argsInput);

  if (decision.status === "block") {
    return {
      ok: false,
      tool: toolName,
      message: `Blocked by safety policy: ${decision.reason}`
    };
  }

  if (decision.status === "confirm") {
    return {
      ok: false,
      tool: toolName,
      message: `Confirmation required: ${decision.reason}`,
      data: { requiresConfirmation: true }
    };
  }

  switch (toolName) {
    case "open_app":
      return openApp(argsInput);
    case "write_sandbox_file":
      return writeSandboxFile(argsInput);
    case "navigate_url":
      return navigateUrl(argsInput);
    default:
      return {
        ok: false,
        tool: toolName,
        message: "Unknown tool"
      };
  }
}

async function openApp(argsInput: Record<string, unknown>): Promise<ToolResult> {
  const args = OpenAppArgsSchema.parse(argsInput);

  // Placeholder adapter. Real Windows/MCP integration will be added later.
  return {
    ok: true,
    tool: "open_app",
    message: `Demo adapter accepted request to open '${args.name}'.`,
    data: {
      adapter: "mock-desktop",
      app: args.name
    }
  };
}

async function writeSandboxFile(argsInput: Record<string, unknown>): Promise<ToolResult> {
  const args = WriteSandboxFileArgsSchema.parse(argsInput);
  const sandboxRoot = path.resolve(defaultPolicyConfig.sandboxDir);
  const target = path.resolve(sandboxRoot, args.path);
  const publicPath = path.relative(process.cwd(), target).replaceAll(path.sep, "/");

  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, args.content, "utf8");

  return {
    ok: true,
    tool: "write_sandbox_file",
    message: `Wrote file inside sandbox: ${publicPath}`,
    data: {
      path: publicPath
    }
  };
}

async function navigateUrl(argsInput: Record<string, unknown>): Promise<ToolResult> {
  const args = NavigateUrlArgsSchema.parse(argsInput);

  // Placeholder adapter. Real Playwright/MCP integration will be added later.
  return {
    ok: true,
    tool: "navigate_url",
    message: `Demo adapter accepted navigation to '${args.url}'.`,
    data: {
      adapter: "mock-browser",
      url: args.url
    }
  };
}
