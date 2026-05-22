import 'dotenv/config';
import { PolicyEngine, defaultPolicyEngine } from './security/PolicyEngine.js';
import { SandboxManager, defaultSandboxManager } from './security/SandboxManager.js';
import fetch from 'node-fetch';
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import fs from 'fs';
import path from 'path';

export interface OrchestrationRequest {
  input: string;
  model?: string;
  allowed_tools?: string[];
  previous_response_id?: string;
}

export interface OrchestrationResponse {
  content: any;
  tool_calls?: any[];
  response_id?: string;
}

export interface PendingCall {
  name: string;
  args: any;
  id: string;
  timestamp: number;
}

export interface LlmMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class AgentOrchestrator {
  private policyEngine: PolicyEngine;
  private sandboxManager: SandboxManager;
  private apiKey: string;
  private mcpClients: Map<string, Client> = new Map();
  private pendingConfirmations: Map<string, PendingCall> = new Map();
  private conversationHistory: LlmMessage[] = [];

  // Configuração do LLM Provider
  private llmProvider: 'openai' | 'ollama';
  private llmBaseUrl: string;
  private llmApiKey: string;
  private defaultModel: string;

  constructor(
    apiKey: string,
    policyEngine = defaultPolicyEngine,
    sandboxManager = defaultSandboxManager
  ) {
    this.policyEngine = policyEngine;
    this.sandboxManager = sandboxManager;
    this.apiKey = apiKey;

    // Detecta qual provider usar
    this.llmProvider = (process.env.LLM_PROVIDER as 'openai' | 'ollama') || 'openai';
    this.llmBaseUrl = process.env.OLLAMA_BASE_URL || 'https://ollama.com/api';
    this.llmApiKey = process.env.OLLAMA_API_KEY || apiKey;
    this.defaultModel = process.env.DEFAULT_MODEL || 'gemma3';

    console.log(`🧠 LLM Provider: ${this.llmProvider}`);
    console.log(`🔗 Base URL: ${this.llmBaseUrl}`);
  }

  /**
   * Loads MCP servers from a configuration file.
   */
  async loadServersFromConfig(configPath: string) {
    try {
      const configContent = fs.readFileSync(configPath, 'utf8');
      const config = JSON.parse(configContent);
      const servers = config.mcpServers || [];

      for (const server of servers) {
        if (server.enabled) {
          await this.connectToServer(server.id, server.command, server.args);
        }
      }
    } catch (err) {
      console.error(`❌ Error loading MCP config from ${configPath}:`, err);
    }
  }

  /**
   * Connects to an MCP server via STDIO.
   */
  async connectToServer(serverId: string, command: string, args: string[] = []) {
    if (this.mcpClients.has(serverId)) return;

    const transport = new StdioClientTransport({ command, args });
    const client = new Client({
      name: "AgentOrchestrator-Client",
      version: "1.0.0",
    });

    await client.connect(transport);
    this.mcpClients.set(serverId, client);
    console.log(`✅ Connected to MCP server: ${serverId}`);
  }

  /**
   * Handles a tool execution request. If a confirmation is needed,
   * it stores the call and returns a "requires_confirmation" status.
   */
  async executeSecureTool(toolCall: { name: string, arguments: any, id: string }) {
    const { name, arguments: args, id } = toolCall;

    const action = this.policyEngine.evaluate(name);

    if (action === 'block') {
      return {
        status: 'blocked',
        tool_call_id: id,
        output: JSON.stringify({ error: `Security Policy: Tool ${name} is blocked.` })
      };
    }

    if (action === 'confirm') {
      console.warn(`⚠️ Tool ${name} requires confirmation. Storing call ${id}.`);
      this.pendingConfirmations.set(id, {
        name,
        args,
        id,
        timestamp: Date.now()
      });

      return {
        status: 'requires_confirmation',
        tool_call_id: id,
        output: JSON.stringify({
          error: `Security Policy: Tool ${name} requires manual confirmation.`,
          request: `The agent wants to execute ${name}. Do you allow this?`
        })
      };
    }

    try {
      const result = await this.executeMcpTool(name, args);
      return {
        status: 'executed',
        tool_call_id: id,
        output: JSON.stringify(result)
      };
    } catch (e: any) {
      return {
        status: 'error',
        tool_call_id: id,
        output: JSON.stringify({ error: e.message })
      };
    }
  }

  /**
   * Confirms a pending tool call and executes it.
   */
  async confirmTool(callId: string) {
    const pending = this.pendingConfirmations.get(callId);
    if (!pending) {
      throw new Error(`No pending confirmation found for call ID: ${callId}`);
    }

    this.pendingConfirmations.delete(callId);

    console.log(`✅ Tool ${pending.name} confirmed by user. Executing...`);
    const result = await this.executeMcpTool(pending.name, pending.args);

    return {
      tool_call_id: callId,
      output: JSON.stringify(result)
    };
  }

  async run(req: OrchestrationRequest): Promise<OrchestrationResponse> {
    const { input, model, allowed_tools } = req;

    try {
      // Adiciona mensagem do usuário ao histórico
      this.conversationHistory.push({ role: 'user', content: input });

      // 1. Obtém as tools disponíveis
      const functionTools = await this.getSecureFunctionTools(allowed_tools);

      // 2. Chama o LLM (OpenAI ou Ollama)
      const llmResponse = await this.callLlm(input, functionTools, model);

      // 3. Verifica se há tool calls
      const toolCalls = llmResponse.tool_calls || [];

      if (toolCalls.length === 0) {
        // Adiciona resposta ao histórico
        this.conversationHistory.push({ role: 'assistant', content: llmResponse.content });
        return { content: llmResponse.content };
      }

      // 4. Executa tools com segurança
      const toolOutputs = [];
      for (const tc of toolCalls) {
        const result = await this.executeSecureTool({
          name: tc.name,
          arguments: tc.arguments || {},
          id: tc.id
        });
        toolOutputs.push(result);
      }

      // 5. Chama LLM novamente com resultados das tools
      const finalResponse = await this.callLlmWithToolResults(
        input,
        llmResponse.content,
        toolOutputs,
        functionTools,
        model
      );

      // Adiciona resposta final ao histórico
      this.conversationHistory.push({ role: 'assistant', content: finalResponse.content });

      return {
        content: finalResponse.content,
        response_id: finalResponse.id
      };

    } catch (err: any) {
      throw new Error(`Orchestration Error: ${err.message}`);
    }
  }

  /**
   * Chama o LLM (OpenAI ou Ollama) com base na configuração.
   */
  private async callLlm(input: string, tools: any[], model?: string) {
    if (this.llmProvider === 'openai') {
      return this.callOpenAI(input, tools, model);
    } else {
      return this.callOllama(input, tools, model);
    }
  }

  /**
   * Chama o LLM novamente após execução de tools.
   */
  private async callLlmWithToolResults(
    originalInput: string,
    assistantContent: string,
    toolOutputs: any[],
    tools: any[],
    model?: string
  ) {
    if (this.llmProvider === 'openai') {
      return this.callOpenAIWithToolResults(originalInput, assistantContent, toolOutputs, tools, model);
    } else {
      return this.callOllamaWithToolResults(originalInput, assistantContent, toolOutputs, tools, model);
    }
  }

  // ==================== OLLAMA IMPLEMENTATION ====================

  private async callOllama(input: string, tools: any[], model?: string) {
    const modelName = model || this.defaultModel;

    // Constrói o prompt com contexto das tools
    const toolsDescription = tools.length > 0
      ? `\n\nFerramentas disponíveis:\n${tools.map((t: any) =>
          `- ${t.function.name}: ${t.function.description}`
        ).join('\n')}\n\nPara usar uma ferramenta, responda EXATAMENTE no formato JSON:\n{"tool_call": {"name": "nome_da_tool", "arguments": {"param": "valor"}}}`
      : '';

    const prompt = `${input}${toolsDescription}`;

    const r = await fetch(`${this.llmBaseUrl}/generate`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.llmApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelName,
        prompt,
        stream: false,
        system: "Você é um assistente útil. Responda em português do Brasil."
      }),
    });

    if (!r.ok) {
      const err = await r.text();
      throw new Error(`Ollama API Error: ${err}`);
    }

    const data = await r.json();

    // Tenta extrair tool calls do formato JSON
    const toolCalls = this.extractToolCalls(data.response);

    return {
      id: `ollama-${Date.now()}`,
      content: data.response,
      tool_calls: toolCalls,
    };
  }

  private async callOllamaWithToolResults(
    originalInput: string,
    assistantContent: string,
    toolOutputs: any[],
    tools: any[],
    model?: string
  ) {
    const modelName = model || this.defaultModel;

    // Constrói um prompt com o histórico da conversa e resultados das tools
    const resultsDescription = toolOutputs
      .map((to: any) => `Resultado da ferramenta ${to.tool_call_id}: ${to.output}`)
      .join('\n');

    const prompt = `Usuário: ${originalInput}\n\nVocê tentou usar ferramentas. Aqui estão os resultados:\n${resultsDescription}\n\nResponda ao usuário com base nesses resultados.`;

    const r = await fetch(`${this.llmBaseUrl}/generate`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.llmApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelName,
        prompt,
        stream: false,
        system: "Você é um assistente útil. Responda em português do Brasil."
      }),
    });

    if (!r.ok) {
      const err = await r.text();
      throw new Error(`Ollama API Error: ${err}`);
    }

    const data = await r.json();

    return {
      id: `ollama-${Date.now()}`,
      content: data.response,
      tool_calls: [],
    };
  }

  /**
   * Extrai tool calls do texto de resposta do Ollama.
   * Procura por JSON no formato {"tool_call": {...}}
   */
  private extractToolCalls(response: string): any[] {
    try {
      // Procura por JSON na resposta
      const jsonMatch = response.match(/\{[\s\S]*"tool_call"[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.tool_call) {
          return [{
            id: `call-${Date.now()}`,
            name: parsed.tool_call.name,
            arguments: parsed.tool_call.arguments || {}
          }];
        }
      }
    } catch (e) {
      // Ignora erros de parsing
    }
    return [];
  }

  // ==================== OPENAI IMPLEMENTATION (LEGACY) ====================

  private async callOpenAI(input: string, tools: any[], model?: string) {
    const modelName = model || "gpt-4o-realtime-preview";
    const payload = {
      model: modelName,
      input,
      tools: tools.length > 0 ? tools : undefined,
    };

    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!r.ok) {
      const err = await r.json();
      throw new Error(`OpenAI API Error: ${JSON.stringify(err)}`);
    }

    const data = await r.json();

    const toolCalls = (data?.output?.[0]?.content || [])
      .filter((p: any) => p?.type === "tool_call")
      .map((p: any) => p?.tool_call)
      .filter(Boolean);

    return {
      id: data.id,
      content: data.output?.[0]?.text || '',
      tool_calls: toolCalls,
    };
  }

  private async callOpenAIWithToolResults(
    originalInput: string,
    assistantContent: string,
    toolOutputs: any[],
    tools: any[],
    model?: string
  ) {
    const modelName = model || "gpt-4o-realtime-preview";

    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelName,
        tool_outputs: toolOutputs,
      }),
    });

    if (!r.ok) {
      const err = await r.json();
      throw new Error(`OpenAI API Error: ${JSON.stringify(err)}`);
    }

    const data = await r.json();

    return {
      id: data.id,
      content: data.output?.[0]?.text || '',
      tool_calls: [],
    };
  }

  // ==================== MCP TOOLS ====================

  private async getSecureFunctionTools(allowedList?: string[]) {
    const allTools: any[] = [];

    for (const [serverId, client] of this.mcpClients) {
      const result = await client.listTools();
      const tools = result.tools || [];
      allTools.push(...tools);
    }

    const filtered = allowedList && allowedList.length
      ? allTools.filter((t: any) => allowedList.includes(t.name))
      : allTools;

    return filtered.map((t: any) => ({
      type: "function",
      function: {
        name: t.name,
        description: t.description || "MCP tool",
        parameters: t.inputSchema || { type: "object", properties: {} }
      }
    }));
  }

  private async executeMcpTool(name: string, args: any) {
    for (const [serverId, client] of this.mcpClients) {
      const tools = await client.listTools();
      if (tools.tools?.some((t: any) => t.name === name)) {
        const result = await client.callTool({
          name,
          arguments: args,
        });
        return result;
      }
    }
    throw new Error(`Tool ${name} not found in any connected MCP server.`);
  }
}
