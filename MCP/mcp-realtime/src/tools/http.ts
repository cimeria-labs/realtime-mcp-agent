import { z } from "zod";
import fetch from "node-fetch";

export function registerHttpTools(register: Function) {
  register(
    "http.request",
    "Faz uma requisição HTTP genérica (Zapier universal)",
    {
      inputSchema: z.object({
        url: z.string().url(),
        method: z.enum(["GET", "POST", "PUT", "DELETE"]).default("GET"),
        headers: z.record(z.string()).optional(),
        body: z.union([z.string(), z.record(z.any())]).optional()
      })
    },
    async ({ url, method, headers, body }) => {
      const res = await fetch(url, {
        method,
        headers,
        body: typeof body === "object" ? JSON.stringify(body) : body
      });

      const text = await res.text();
      const headersObj: Record<string, string> = {};
      res.headers.forEach((v, k) => { headersObj[k] = v; });

      return {
        content: [{ type: "json", json: { status: res.status, headers: headersObj, body: text } }]
      };
    }
  );
}
