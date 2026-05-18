# Architecture

## Overview

Realtime MCP Agent is designed as a voice-first local automation workbench.

The central idea is to keep the language model away from unrestricted direct system access. Instead, every requested action passes through a tool router and safety policy before reaching a local adapter.

```text
User voice
  ↓
Browser client
  ↓
Realtime session
  ↓
Local server
  ↓
Tool router
  ↓
Safety policy
  ↓
Adapter
  ↓
Local action
```

## Components

### Client

The client is responsible for:

- requesting microphone permission;
- connecting to a Realtime session;
- displaying connection status;
- showing transcript and tool-call events;
- playing the agent response.

### Local server

The local server is responsible for:

- creating short-lived Realtime session credentials;
- keeping API keys out of the browser;
- receiving tool-call requests;
- forwarding safe requests to the tool router;
- returning structured tool results.

### Tool router

The router maps model-requested actions to internal functions.

Example:

```text
open_app       -> desktop adapter
write_file     -> filesystem sandbox adapter
navigate_url   -> browser adapter
```

The model does not call operating-system APIs directly.

### Safety policy

The policy layer decides whether a tool request is allowed, blocked, or requires confirmation.

Examples:

- opening `calculator` may be allowed;
- writing to `sandbox/demo.txt` may be allowed;
- deleting files should be blocked or require confirmation;
- arbitrary shell execution should be blocked by default.

### Adapters

Adapters hide platform-specific implementation details.

Initial adapters:

- desktop adapter;
- filesystem sandbox adapter;
- browser adapter.

Future adapters can wrap MCP servers such as:

- Playwright MCP;
- filesystem MCP;
- Windows MCP.

## Data flow

### Example: open calculator

```text
User says: "Open calculator"
  ↓
Realtime model emits tool call: open_app({ name: "calculator" })
  ↓
Tool router receives request
  ↓
Safety policy validates app allowlist
  ↓
Desktop adapter opens the app
  ↓
Tool result is returned
  ↓
Agent responds: "Calculator opened."
```

### Example: write sandbox file

```text
User says: "Create demo.txt saying MCP is working"
  ↓
Tool call: write_sandbox_file({ path: "demo.txt", content: "MCP is working" })
  ↓
Policy resolves path inside sandbox
  ↓
Filesystem adapter writes file
  ↓
Result is returned
```

## Design principles

1. **Explicit tools over implicit control**
   The agent should call named tools, not arbitrary commands.

2. **Sandbox by default**
   Filesystem operations are limited to a configured sandbox.

3. **Human approval for risky operations**
   Destructive or external actions require confirmation.

4. **Observable execution**
   Tool calls and results should be visible in logs or UI.

5. **Public-safe repo**
   No secrets, private paths, local certificates, or real logs should be included.
