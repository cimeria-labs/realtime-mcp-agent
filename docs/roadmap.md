# Roadmap

## Phase 0 — Repository foundation

Status: **done**.

- [x] Public-safe README
- [x] Architecture documentation
- [x] Security model
- [x] Agent operating guide
- [x] TypeScript project skeleton
- [x] CI workflow
- [x] License
- [x] `.gitignore` for secrets, logs, certificates and local artifacts

## Phase 1 — Safe local tool demo

Status: **implemented as a safe demo foundation**.

Goal: prove tool routing and safety policy before enabling live voice automation.

- [x] TypeScript project setup
- [x] Safety policy module
- [x] Tool router module
- [x] Mock desktop adapter
- [x] Sandboxed filesystem adapter
- [x] Mock browser adapter
- [x] Demo script: `pnpm demo:tools`

Success criteria:

```text
pnpm demo:tools
  -> open_app calculator is allowed
  -> write_sandbox_file demo.txt is allowed
  -> write outside sandbox is blocked
  -> example.com navigation is allowed
  -> unknown domains require confirmation
```

## Phase 2 — Browser UI skeleton

Status: **roadmap**.

Goal: create a simple local UI for agent interaction.

- [ ] Add client HTML/CSS/TS
- [ ] Add status indicators
- [ ] Add event log
- [ ] Add manual text command mode
- [ ] Display tool-call decisions and results

Success criteria:

```text
User enters command in UI
  -> server receives request
  -> router executes or blocks safe tool
  -> UI displays result
```

## Phase 3 — Realtime voice integration

Status: **architected / roadmap for this public repo**.

Goal: connect voice input and voice response.

- [ ] Add session endpoint for short-lived Realtime credentials
- [ ] Add WebRTC connection flow
- [ ] Display transcript and tool-call events
- [ ] Route model tool calls to local tool router
- [ ] Keep API keys server-side only

Success criteria:

```text
voice command -> Realtime session -> tool call -> router -> safe local action -> voice response
```

## Phase 4 — MCP adapters

Status: **roadmap**.

Goal: replace mock adapters with MCP-compatible integrations.

- [ ] Playwright/browser adapter
- [ ] Filesystem MCP adapter
- [ ] Windows desktop adapter
- [ ] Adapter capability discovery
- [ ] Tool result normalization
- [ ] Confirmation gates for click/type/form actions

## Phase 5 — Portfolio polish

Status: **roadmap**.

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
