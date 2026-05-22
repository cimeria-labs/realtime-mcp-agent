# Roadmap

The roadmap is split by credibility level: what the public code proves today, what can be improved quickly, and what requires deeper implementation.

## Implemented Foundation

- TypeScript project setup.
- Tool router for three named demo tools.
- Zod validation for tool names and arguments.
- Allow/block/confirm safety policy.
- Sandboxed filesystem write.
- Mock desktop adapter.
- Mock browser adapter.
- Demo script for successful, blocked, and confirmation-required paths.
- CI type check and demo smoke test.

## Next 30 Minutes

- Keep README/status language clear that Realtime and real MCP integrations are not yet implemented.
- Add portfolio positioning and accurate resume bullet.
- Keep demo guide aligned with actual behavior.

## Next 2 Hours

- Add unit tests for `decideToolUse()`:
  - allowlisted app allowed;
  - unknown app blocked;
  - sandbox path allowed;
  - path traversal blocked;
  - `file:` URL blocked;
  - unknown domain requires confirmation.
- Add unit tests for `routeToolCall()` result shapes.
- Add a troubleshooting note for environments where `tsx` needs permission to spawn `esbuild`.
- Add a generated demo transcript checked into `examples/`.

## 1 To 2 Day Improvements

- Implement one real adapter path, ideally Playwright-backed browser navigation with strict domain allowlist.
- Add a local server endpoint for tool calls.
- Add a minimal browser UI for text commands before voice.
- Add confirmation UX for `confirm` decisions.
- Add structured logging for tool calls and policy decisions.

## Later

- Add short-lived Realtime session credential endpoint.
- Add WebRTC client flow.
- Route model-emitted tool calls through the existing router.
- Add MCP-compatible adapter layer for browser/filesystem/desktop servers.
- Add screenshots or GIFs after real UI exists.
- Tag a `v0.1.0-demo` release.

## Non-Goals For Current Public Version

- No autonomous purchases.
- No unrestricted shell execution.
- No email sending.
- No production deployment.
- No sensitive system automation.
- No claim of live Realtime or MCP integration until the code exists.
