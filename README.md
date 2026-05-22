# Realtime MCP Agent

[![CI](https://github.com/cimeria-labs/realtime-mcp-agent/actions/workflows/ci.yml/badge.svg)](https://github.com/cimeria-labs/realtime-mcp-agent/actions/workflows/ci.yml)

Realtime MCP Agent is a TypeScript safety and tool-routing foundation for local AI automation demos. The current public code validates named tool calls, applies allow/block/confirm policy decisions, writes only inside a sandbox folder, and uses mock desktop/browser adapters.

The repository name reflects the target direction: a voice-first Realtime + MCP workbench. The current public implementation does not yet include a live Realtime voice client, WebRTC session flow, or real MCP server integrations.

## Problem

Local AI agents become risky when model output can directly control the desktop, browser, filesystem, or shell. This project demonstrates a safer pattern: route every tool request through explicit schemas, a policy layer, and narrow adapters.

## What Works Today

| Area | Current evidence |
|---|---|
| Tool router | `src/server/tool-router.ts` routes `open_app`, `write_sandbox_file`, and `navigate_url`. |
| Safety policy | `src/server/safety-policy.ts` returns allow, block, or confirmation decisions. |
| Sandboxed filesystem write | `write_sandbox_file` writes inside `./sandbox` and blocks path traversal. |
| Mock desktop action | `open_app` validates an allowlisted app and returns a mock adapter result. |
| Mock browser navigation | `navigate_url` validates URL scheme/domain and returns a mock adapter result. |
| Demo smoke test | `src/server/demo-tools.ts` exercises allowed, blocked, and confirmation-required paths. |
| TypeScript verification | `npm run check` / CI runs `tsc --noEmit`. |

## What Is Not Implemented Yet

- No live Realtime voice or WebRTC client.
- No server endpoint for short-lived Realtime credentials.
- No real MCP server connection.
- No real Playwright/browser control.
- No real Windows desktop bridge.
- No production deployment model.
- No unrestricted shell execution by design.

## 60-Second Reviewer Path

1. Read current status: [`docs/status.md`](docs/status.md).
2. Inspect the safety policy: [`src/server/safety-policy.ts`](src/server/safety-policy.ts).
3. Inspect the tool router: [`src/server/tool-router.ts`](src/server/tool-router.ts).
4. Review architecture boundaries: [`docs/architecture.md`](docs/architecture.md).
5. Run the checks:

```bash
npm install
npm run check
npm run demo:tools
```

Expected demo behavior:

- `open_app` accepts allowlisted demo apps such as `calculator`;
- `write_sandbox_file` writes `sandbox/demo.txt`;
- path traversal such as `../escape.txt` is blocked;
- `navigate_url` allows `https://example.com`;
- unknown domains require confirmation.

## Architecture

Current public runtime:

```text
demo-tools.ts
  -> routeToolCall()
  -> decideToolUse()
  -> allow | block | confirm
  -> mock desktop adapter
  -> sandbox filesystem adapter
  -> mock browser adapter
```

Target architecture:

```text
Voice or text command
  -> Realtime session client
  -> local server
  -> tool router
  -> safety policy
  -> MCP-style adapter
  -> local action
  -> response
```

Only the router, policy layer, sandboxed filesystem demo, and mock adapters are implemented in this public version.

## Configuration

Copy the example environment file locally:

```bash
cp .env.example .env
```

Safe demo defaults:

```env
SANDBOX_DIR=./sandbox
ALLOW_DESKTOP_APPS=calculator,notepad
ALLOW_BROWSER_DOMAINS=example.com
```

Never commit real `.env` files, service accounts, certificates, tokens, private paths, or logs.

## Safety Model

The project starts with a conservative policy:

- named tools only;
- Zod schemas for tool arguments;
- sandboxed filesystem writes;
- desktop app allowlist;
- browser scheme and domain checks;
- confirmation response for unknown domains;
- no arbitrary shell tool;
- no production system control.

See [`docs/security.md`](docs/security.md).

## Repository Layout

```text
.
|-- README.md
|-- AGENTS.md
|-- package.json
|-- tsconfig.json
|-- docs/
|   |-- architecture.md
|   |-- demo-guide.md
|   |-- mcp-tools.md
|   |-- portfolio.md
|   |-- roadmap.md
|   |-- security.md
|   `-- status.md
|-- examples/
|-- sandbox/
`-- src/server/
    |-- demo-tools.ts
    |-- safety-policy.ts
    `-- tool-router.ts
```

## Portfolio Positioning

Use this repo as evidence of:

- safe tool-calling architecture;
- policy-controlled local automation;
- sandboxed filesystem operations;
- adapter boundaries for future MCP integrations;
- TypeScript implementation of allow/block/confirm decisions.

Do not present it as a working voice assistant, real MCP integration, or production desktop automation agent.

## Resume Bullet

Built a TypeScript tool-routing and safety-policy foundation for local AI automation, validating named tool calls with Zod, enforcing allow/block/confirm decisions, restricting filesystem writes to a sandbox, and documenting a roadmap toward Realtime voice and MCP adapter integrations.

## License

MIT. See [`LICENSE`](LICENSE).
