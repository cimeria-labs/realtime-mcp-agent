# Roadmap

## Phase 0 — Repository foundation

- [x] Public-safe README
- [x] Architecture documentation
- [x] Security model
- [x] Agent operating guide
- [ ] Project skeleton
- [ ] CI workflow

## Phase 1 — Safe local tool demo

Goal: prove the tool routing and safety model without requiring live voice.

- [ ] Add TypeScript project setup
- [ ] Add safety policy module
- [ ] Add tool router module
- [ ] Add mock desktop adapter
- [ ] Add sandbox filesystem adapter
- [ ] Add demo script: `pnpm demo:tools`

Success criteria:

```text
pnpm demo:tools
  -> open_app calculator is allowed
  -> write_sandbox_file demo.txt is allowed
  -> write outside sandbox is blocked
```

## Phase 2 — Browser UI skeleton

Goal: create a simple local UI for agent interaction.

- [ ] Add client HTML/CSS/TS
- [ ] Add status indicators
- [ ] Add event log
- [ ] Add manual text command mode

Success criteria:

```text
User enters command in UI
  -> server receives request
  -> router executes safe tool
  -> UI displays result
```

## Phase 3 — Realtime voice integration

Goal: connect voice input and voice response.

- [ ] Add session endpoint for short-lived Realtime credentials
- [ ] Add WebRTC connection flow
- [ ] Display transcript and tool-call events
- [ ] Route model tool calls to local tool router

Success criteria:

```text
voice command -> tool call -> local action -> voice response
```

## Phase 4 — MCP adapters

Goal: replace mock adapters with MCP-compatible integrations.

- [ ] Playwright/browser adapter
- [ ] Filesystem MCP adapter
- [ ] Windows desktop adapter
- [ ] Adapter capability discovery
- [ ] Tool result normalization

## Phase 5 — Portfolio polish

- [ ] Record short demo video
- [ ] Add screenshots/GIFs
- [ ] Add architecture diagram
- [ ] Add troubleshooting guide
- [ ] Add limitations section
- [ ] Add release tag `v0.1.0-demo`

## Non-goals for v0.1

- No autonomous purchases
- No unrestricted shell execution
- No email sending
- No production deployment
- No sensitive system automation
- No real credentials in repo
