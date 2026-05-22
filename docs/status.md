# Project Status

Realtime MCP Agent is a public experimental prototype. The current code proves a safe local tool-routing foundation; the live Realtime voice client and real MCP adapters are roadmap work.

## Status Summary

| Layer | Status | Evidence | Notes |
|---|---|---|---|
| TypeScript project foundation | Implemented | `package.json`, `tsconfig.json`, CI | Type checking and demo smoke test are configured. |
| Tool router | Implemented | `src/server/tool-router.ts` | Routes named tools to controlled handlers. |
| Safety policy | Implemented | `src/server/safety-policy.ts` | Produces allow, block, or confirm decisions. |
| Filesystem sandbox | Implemented | `write_sandbox_file` | Writes inside configured sandbox and blocks path traversal. |
| Desktop automation | Mock only | `open_app` handler | Validates allowlist and returns a mock result; does not open real apps. |
| Browser automation | Mock only | `navigate_url` handler | Validates URL policy and returns a mock result; does not drive a real browser. |
| Realtime voice/WebRTC | Roadmap | `docs/roadmap.md` | Target architecture is documented; no live client is bundled. |
| MCP server integrations | Roadmap | `docs/mcp-tools.md` | Adapter contract exists; no real MCP server connection is implemented. |
| Production readiness | Not production-ready | `docs/security.md` | Needs real adapters, confirmation UX, tests, logging, and deployment hardening. |

## What Is Safe To Claim

- The repo implements a TypeScript tool router.
- It implements a safety policy with allow/block/confirm decisions.
- It includes a real sandboxed file-write demo.
- It includes mock desktop and browser adapters.
- It documents a credible path toward Realtime and MCP integrations.

## What Not To Claim

- Do not claim a working voice assistant.
- Do not claim live Realtime API integration.
- Do not claim real MCP server integration.
- Do not claim real desktop or browser automation.
- Do not claim production readiness or enterprise-grade sandboxing.

## Current Verification

Run:

```bash
npm run check
npm run demo:tools
```

The demo exercises:

- allowed desktop request through the mock adapter;
- sandboxed file write;
- blocked path traversal;
- allowlisted browser navigation through the mock adapter;
- confirmation-required external navigation.

## Main Remaining Risks

- No unit test suite beyond the demo script.
- Mock adapters can be mistaken for real automation if docs are vague.
- No Realtime session credential endpoint exists yet.
- No MCP client/server integration exists yet.
- Filesystem sandboxing is a demo guardrail, not a formally verified security boundary.

## Recommended Next Step

Add focused unit tests for `decideToolUse()` and `routeToolCall()`, then implement one real adapter path, preferably browser navigation through Playwright or a minimal MCP-compatible adapter. That would move the project from architecture foundation to stronger technical demo.
