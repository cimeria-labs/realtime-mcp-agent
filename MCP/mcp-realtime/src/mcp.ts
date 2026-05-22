import type { Server } from "@modelcontextprotocol/sdk/server/index.js";

export function getToolRegistrar(server: Server) {
  return (
    name: string,
    description: string,
    opts: { inputSchema: any },
    handler: (input: any) => Promise<any>
  ) => {
    server.tool(name, description, opts, async (args) => {
      try {
        const result = await handler(args);
        if (Array.isArray(result?.content)) return result;
        if (typeof result === "string") return { content: [{ type: "text", text: result }] };
        return { content: [{ type: "json", json: result }] };
      } catch (err: any) {
        return { content: [{ type: "text", text: `Erro: ${err?.message || err}` }] };
      }
    });
  };
}
