# Demo Guide

## Prerequisites

- Node.js 20+
- pnpm

## Install

```bash
pnpm install
```

## Run static checks

```bash
pnpm check
```

## Run the safe tools demo

```bash
pnpm demo:tools
```

Expected behavior:

1. `open_app` accepts `calculator` through the mock desktop adapter.
2. `write_sandbox_file` writes `sandbox/demo.txt`.
3. Path traversal outside the sandbox is blocked.
4. `navigate_url` accepts `https://example.com`.
5. A non-allowlisted domain requires confirmation.

## Demo script for video

```text
This is a voice-first agent workbench.
The current v0.1 foundation focuses on safe tool routing before enabling live voice automation.

First, the policy allows a low-risk desktop action.
Then, the filesystem tool writes only inside a sandbox.
Next, a path traversal attempt is blocked.
Finally, browser navigation is either allowed or routed to human confirmation depending on the domain.
```

## Next demo target

The next milestone is:

```text
voice command -> Realtime session -> tool call -> router -> safe local action -> voice response
```
