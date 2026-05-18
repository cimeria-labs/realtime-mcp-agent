# Project Status

## Summary

Realtime MCP Agent is currently a **portfolio-grade experimental prototype**.

The public repository intentionally focuses on a safe, reproducible foundation before connecting live voice automation and real MCP servers.

## Current status by layer

| Layer | Status | Evidence |
|---|---|---|
| Repository foundation | Done | README, docs, license, CI, examples and guardrails exist. |
| Safety policy | Done | `src/server/safety-policy.ts` implements allow/block/confirm decisions. |
| Tool router | Done | `src/server/tool-router.ts` routes named tools to internal handlers. |
| Filesystem sandbox | Done | Demo writes inside `./sandbox` and blocks path traversal. |
| Desktop automation | Partial | Mock adapter validates allowlisted app requests. Real Windows/MCP execution is planned. |
| Browser automation | Partial | Mock adapter validates URL policy. Real Playwright/MCP execution is planned. |
| Realtime voice | Architected | Public repo documents the target WebRTC/Realtimesession flow. Live integration is roadmap. |
| MCP integrations | Roadmap | Planned adapters include Playwright MCP, filesystem MCP and Windows desktop bridge. |

## What is done

- Public-safe repository structure.
- TypeScript project setup.
- CI smoke test.
- Safety policy module.
- Tool router module.
- Sandboxed filesystem write demo.
- Mock desktop adapter.
- Mock browser adapter.
- Documentation for architecture, security, roadmap and demo flow.

## What is partial

- Desktop automation is represented by a mock adapter.
- Browser navigation is represented by a mock adapter.
- The public repo does not yet execute real Windows or Playwright MCP actions.

## What is architected

- Voice command to Realtime session.
- Realtime model tool call to local router.
- Router to policy layer.
- Policy layer to MCP-style adapters.
- Human confirmation for risky actions.

## What is roadmap

- Browser UI skeleton.
- Realtime WebRTC session flow.
- Real MCP adapters.
- Screenshots/GIFs and demo video.
- Release tag `v0.1.0-demo`.

## Public repository safety note

This repository must remain sanitized. Do not commit:

- `.env` files;
- API keys;
- service accounts;
- certificates;
- personal filesystem paths;
- raw logs;
- screenshots with private information;
- real customer or business data.

## Portfolio wording

Safe wording:

> Experimental Realtime + MCP agent workbench demonstrating voice-first local automation architecture, safety policy, sandboxed tool routing and MCP-ready adapters.

Avoid wording:

> Fully autonomous production agent that controls the computer.

This distinction keeps the project accurate, credible and safe for public portfolio use.
