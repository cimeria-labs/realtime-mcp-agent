# Demo Guide

This demo validates the current public implementation: TypeScript tool routing, safety-policy decisions, a real sandboxed file write, and mock desktop/browser adapters. It does not demonstrate live voice, WebRTC, or real MCP server integrations yet.

## Prerequisites

- Node.js 20+
- npm, or pnpm if available

## Install

```bash
npm install
```

## Run static checks

```bash
npm run check
```

## Run the safe tools demo

```bash
npm run demo:tools
```

Expected behavior:

1. `open_app` accepts `calculator` through the mock desktop adapter.
2. `write_sandbox_file` writes `sandbox/demo.txt`.
3. Path traversal outside the sandbox is blocked.
4. `navigate_url` accepts `https://example.com`.
5. A non-allowlisted domain requires confirmation.

## Demo script for video

```text
This is a local AI tool-routing safety demo.
The current v0.1 foundation focuses on policy-controlled tools before enabling live voice or real MCP automation.

First, the policy allows a low-risk desktop action.
Then, the filesystem tool writes only inside a sandbox.
Next, a path traversal attempt is blocked.
Finally, browser navigation is either allowed or routed to human confirmation depending on the domain.
```

## Next demo target

The next milestone is:

```text
text command -> local server -> tool router -> policy decision -> safe local action -> visible result
```

After that is implemented, the voice milestone is:

```text
voice command -> Realtime session -> tool call -> router -> safe local action -> voice response
```

## Troubleshooting

`npm run demo:tools` uses `tsx`, which may spawn an `esbuild` helper process. In restrictive sandboxes this can fail with `spawn EPERM`. Run the same command in a normal local terminal when verifying outside this environment.
