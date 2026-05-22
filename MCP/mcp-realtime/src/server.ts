import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

import { getToolRegistrar } from "./mcp.js";
import { registerUtilTools } from "./tools/util.js";
import { registerHttpTools } from "./tools/http.js";
import { registerEmailTools } from "./tools/email.js";
import { AgentOrchestrator } from "./orchestrator.js";

const PORT = Number(process.env.PORT || 3000);
const MCP_AUTH = process.env.MCP_AUTH || "";

async function main() {
  const mcp = new Server({ name: "RealtimeMCP", version: "1.0.0" });
  const register = getToolRegistrar(mcp);

  registerUtilTools(register);
  registerHttpTools(register);
  registerEmailTools(register);

  const orchestrator = new AgentOrchestrator(process.env.OPENAI_API_KEY || "");

  // Carrega MCP servers do arquivo de configuração
  await orchestrator.loadServersFromConfig(path.join(process.cwd(), 'mcp-config.json'));

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/", (_req, res) => res.status(200).send("MCP Realtime OK"));

  app.post("/mcp/run", async (req, res) => {
    try {
      const result = await orchestrator.run(req.body);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/mcp/execute", async (req, res) => {
    try {
      const result = await orchestrator.executeSecureTool(req.body);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/mcp/confirm", async (req, res) => {
    try {
      const { callId } = req.body;
      if (!callId) return res.status(400).json({ error: "callId é obrigatório" });
      const result = await orchestrator.confirmTool(callId);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/mcp", async (req, res) => {
    if (MCP_AUTH) {
      if ((req.headers.authorization || "") !== MCP_AUTH) {
        return res.status(401).send("Unauthorized");
      }
    }
    const transport = new SSEServerTransport("/mcp", res, req);
    await mcp.connect(transport);
  });

  app.listen(PORT, () => {
    console.log(`✅ MCP rodando em http://localhost:${PORT}/mcp`);
    console.log(`🚀 Orchestrator: http://localhost:${PORT}/mcp/run`);
    console.log(`🛠️ Secure Execute: http://localhost:${PORT}/mcp/execute`);
    console.log(`🔐 Secure Confirm: http://localhost:${PORT}/mcp/confirm`);
    console.log(`📦 MCP Config auto-loaded from mcp-config.json`);
  });
}

main().catch((err) => {
  console.error("Erro na inicialização:", err);
  process.exit(1);
});
