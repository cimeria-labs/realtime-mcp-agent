# Realtime MCP Agent

> Experimental voice-first agent workbench that connects real-time conversation to local tools through MCP-style adapters, with explicit guardrails for safe desktop, browser and filesystem automation.

## Status

**Experimental prototype / portfolio project.**

This repository is being shaped as a professional, sanitized version of a local Realtime + MCP workbench. It is not a production-ready autonomous agent and does not include private keys, service accounts, local certificates, personal paths, logs, or real credentials.

## Why this project exists

Most AI assistants are conversational only. This project explores a more useful pattern:

```text
voice command
  ↓
real-time agent session
  ↓
tool routing / policy check
  ↓
MCP-style adapter
  ↓
local action: desktop, browser, or sandboxed filesystem
  ↓
voice/text response
```

The goal is to demonstrate how natural voice input can safely trigger local automations such as opening a permitted app, navigating a browser, or writing a file inside a sandbox folder.

## Core demo targets

### Demo 1 — Desktop action

```text
User: "Open the calculator"
Agent: validates the action, calls the Windows adapter, opens the calculator, and confirms the result.
```

### Demo 2 — Sandboxed filesystem action

```text
User: "Create demo.txt saying MCP is working"
Agent: writes only inside the configured sandbox directory and confirms the output path.
```

### Demo 3 — Browser action

```text
User: "Open example.com"
Agent: validates the URL, calls the browser adapter, navigates, and reports status.
```

## Current architecture

```text
Browser UI / Microphone
        ↓
Realtime session client
        ↓
Local Node.js server
        ↓
Tool router
        ↓
Safety policy
        ↓
Adapters
  ├─ Desktop adapter
  ├─ Browser adapter
  └─ Filesystem sandbox adapter
```

## Planned integrations

- OpenAI Realtime API / WebRTC session flow
- MCP-compatible tool adapters
- Playwright-based browser automation
- Windows desktop tool bridge
- Filesystem sandbox operations
- Human confirmation for risky actions
- CI checks and reproducible demo commands

## Security model

This project intentionally starts with a conservative tool policy:

- no real credentials committed;
- no unrestricted shell execution;
- filesystem writes restricted to a sandbox directory;
- allowlist for desktop applications;
- denylist for destructive commands;
- manual confirmation required for risky operations;
- `.env.example` only, never `.env`.

See [`docs/security.md`](docs/security.md).

## Repository structure

```text
.
├─ README.md
├─ AGENTS.md
├─ docs/
│  ├─ architecture.md
│  ├─ demo-guide.md
│  ├─ mcp-tools.md
│  ├─ roadmap.md
│  └─ security.md
├─ examples/
│  ├─ browser-navigation.md
│  ├─ create-sandbox-file.md
│  └─ open-calculator.md
├─ src/
│  ├─ client/
│  └─ server/
└─ .github/
   └─ workflows/
```

## Portfolio framing

This project demonstrates:

- voice AI interface design;
- agent tool routing;
- MCP-style local automation;
- safety policies for AI-controlled tools;
- browser/desktop/filesystem automation patterns;
- practical AI assistant engineering beyond chat-only interfaces.

## Roadmap

See [`docs/roadmap.md`](docs/roadmap.md).

## License

MIT — see [`LICENSE`](LICENSE).
