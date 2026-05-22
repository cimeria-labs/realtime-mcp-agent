import "dotenv/config";
import { routeToolCall } from "./tool-router.js";

async function main(): Promise<void> {
  const demos = [
    {
      name: "Allowed desktop app",
      tool: "open_app",
      args: { name: "calculator" }
    },
    {
      name: "Sandbox file write",
      tool: "write_sandbox_file",
      args: { path: "demo.txt", content: "MCP is working.\n" }
    },
    {
      name: "Blocked path traversal",
      tool: "write_sandbox_file",
      args: { path: "../escape.txt", content: "should not write" }
    },
    {
      name: "Allowlisted browser navigation",
      tool: "navigate_url",
      args: { url: "https://example.com" }
    },
    {
      name: "Confirmation-required external navigation",
      tool: "navigate_url",
      args: { url: "https://openai.com" }
    }
  ];

  for (const demo of demos) {
    const result = await routeToolCall(demo.tool, demo.args);
    console.log(`\n## ${demo.name}`);
    console.log(JSON.stringify(result, null, 2));
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
