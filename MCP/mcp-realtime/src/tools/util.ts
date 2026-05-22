import { z } from "zod";

export function registerUtilTools(register: Function) {
  register(
    "util.echo",
    "Repete o texto informado",
    { inputSchema: z.object({ text: z.string() }) },
    async ({ text }: { text: string }) => ({ content: [{ type: "text", text }] })
  );

  register(
    "util.now",
    "Retorna data/hora atual (ISO)",
    { inputSchema: z.object({}) },
    async () => ({ content: [{ type: "text", text: new Date().toISOString() }] })
  );
}
