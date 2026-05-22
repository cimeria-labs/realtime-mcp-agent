# Architecture

Realtime MCP Agent is designed around one core rule: model output should not receive unrestricted local system access. Every action must pass through a schema, a router, a policy decision, and a narrow adapter.

## Current Public Architecture

```text
demo-tools.ts
  |
  v
routeToolCall(toolName, args)
  |
  v
ToolNameSchema + argument schemas
  |
  v
decideToolUse()
  |
  +-- block    -> return blocked result
  +-- confirm  -> return confirmation-required result
  +-- allow    -> call internal handler
                    |
                    +-- mock desktop adapter
                    +-- sandbox filesystem adapter
                    +-- mock browser adapter
```

## Target Architecture

The intended future architecture adds a voice or text client, a local server, and MCP-compatible adapters:

```text
Voice/text command
  |
  v
Realtime session client
  |
  v
Local Node.js server
  |
  v
Tool router
  |
  v
Safety policy
  |
  v
MCP-style adapter
  |
  v
Local action
```

The target architecture is documented for direction. It is not fully implemented in this public repo.

## Components

| Component | File | Current status |
|---|---|---|
| Demo runner | `src/server/demo-tools.ts` | Implemented smoke test for tool decisions. |
| Tool router | `src/server/tool-router.ts` | Implemented. |
| Safety policy | `src/server/safety-policy.ts` | Implemented. |
| Desktop adapter | `openApp()` in `tool-router.ts` | Mock result only. |
| Filesystem adapter | `writeSandboxFile()` in `tool-router.ts` | Real sandboxed write. |
| Browser adapter | `navigateUrl()` in `tool-router.ts` | Mock result only. |
| Realtime client | Not present | Roadmap. |
| MCP server adapter | Not present | Roadmap. |

## Tool Contract

Tool results use one normalized shape:

```ts
interface ToolResult {
  ok: boolean;
  tool: string;
  message: string;
  data?: Record<string, unknown>;
}
```

Implemented public tools:

```text
open_app({ name })
write_sandbox_file({ path, content })
navigate_url({ url })
```

## Policy Decisions

The policy layer returns exactly one of:

```text
allow   -> execute the handler
block   -> refuse and return the reason
confirm -> pause and return requiresConfirmation=true
```

Current examples:

- `open_app` allows only configured desktop app names.
- `write_sandbox_file` blocks absolute paths and path traversal.
- `navigate_url` blocks non-HTTP schemes and requires confirmation for unknown domains.

## Security Boundary

The current sandbox protects the demo write path by resolving the requested path under `SANDBOX_DIR` and rejecting escapes. This is useful for portfolio demonstration, but it is not a full OS sandbox or a formal security proof.

## Implementation Gaps

- No live browser UI.
- No Realtime WebRTC session flow.
- No server-side Realtime credential endpoint.
- No real MCP client/server connection.
- No real desktop automation bridge.
- No real Playwright navigation.
- No unit tests beyond the executable demo path.
