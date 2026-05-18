# Realtime MCP Agent

> Voice-first AI agent workbench for safely routing real-time conversation into local tool actions through MCP-style adapters.

## Status

**Portfolio-grade experimental prototype.**

This repository is a sanitized public version of a local Realtime + MCP workbench. It demonstrates the architecture and safety model for connecting a conversational voice interface to local desktop, browser and filesystem actions. It is **not** a production-ready autonomous agent and should not be used to control sensitive systems without additional review.

## What works today

| Area | Status | Notes |
|---|---|---|
| Public-safe repository foundation | Done | README, docs, license, CI and guardrails are in place. |
| Tool router | Done | Routes named tool calls to controlled internal handlers. |
| Safety policy | Done | Allowlist/block/confirmation model for demo actions. |
| Filesystem sandbox demo | Done | Writes only inside the configured sandbox and blocks path traversal. |
| Desktop action demo | Partial | Mock adapter validates allowlisted app requests; real Windows/MCP bridge is roadmap. |
| Browser navigation demo | Partial | Mock adapter validates URL policy; real Playwright/MCP bridge is roadmap. |
| Realtime voice/WebRTC flow | Architected | Target architecture is documented; live Realtime integration is roadmap for this public repo. |
| MCP server integrations | Roadmap | Planned integrations include Playwright, filesystem and Windows MCP adapters. |

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

## Architecture

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

See [`docs/architecture.md`](docs/architecture.md) for the full design.

## Safe demo targets

### Demo 1 — Desktop action

```text
User: "Open the calculator"
Agent: validates the action, calls the desktop adapter, and confirms the result.
```

Current public implementation: mock desktop adapter.

### Demo 2 — Sandboxed filesystem action

```text
User: "Create demo.txt saying MCP is working"
Agent: writes only inside the configured sandbox directory and confirms the output path.
```

Current public implementation: real local sandbox write with path traversal protection.

### Demo 3 — Browser action

```text
User: "Open example.com"
Agent: validates the URL, calls the browser adapter, and reports status.
```

Current public implementation: mock browser adapter with domain allowlist/confirmation behavior.

## Quickstart

Prerequisites:

- Node.js 20+
- pnpm

```bash
pnpm install
pnpm check
pnpm demo:tools
```

Expected demo behavior:

- `open_app` accepts allowlisted demo apps such as `calculator`;
- `write_sandbox_file` writes inside `./sandbox`;
- path traversal such as `../escape.txt` is blocked;
- `navigate_url` allows `https://example.com`;
- unknown domains require confirmation.

## Configuration

Copy the example environment file locally:

```bash
cp .env.example .env
```

Public examples use placeholder values only. Do not commit real `.env` files, service accounts, certificates, tokens or local machine paths.

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
│  ├─ security.md
│  └─ status.md
├─ examples/
│  ├─ browser-navigation.md
│  ├─ create-sandbox-file.md
│  └─ open-calculator.md
├─ src/
│  └─ server/
│     ├─ demo-tools.ts
│     ├─ safety-policy.ts
│     └─ tool-router.ts
└─ .github/
   └─ workflows/
      └─ ci.yml
```

## Portfolio framing

This project demonstrates:

- voice AI interface architecture;
- agent tool routing;
- MCP-style local automation design;
- safety policies for AI-controlled tools;
- browser/desktop/filesystem automation patterns;
- practical AI assistant engineering beyond chat-only interfaces.

## Roadmap

See [`docs/roadmap.md`](docs/roadmap.md).

## Non-goals

- no autonomous purchases;
- no unrestricted shell execution;
- no email sending;
- no production deployment;
- no sensitive system automation;
- no real credentials in the repository.

## License

MIT — see [`LICENSE`](LICENSE).
