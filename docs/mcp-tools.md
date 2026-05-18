# MCP Tools Plan

## Current status

The first implementation uses mock adapters to validate routing and policy before connecting real MCP servers.

## Target adapters

### Desktop adapter

Purpose:

- open allowlisted desktop applications;
- later integrate with Windows MCP or an equivalent desktop bridge.

Initial safe tools:

```text
open_app({ name })
```

### Filesystem sandbox adapter

Purpose:

- create files only inside the configured sandbox;
- prevent path traversal;
- avoid exposing the user's real filesystem.

Initial safe tools:

```text
write_sandbox_file({ path, content })
```

Potential future tools:

```text
read_sandbox_file({ path })
list_sandbox_files({ path })
```

### Browser adapter

Purpose:

- navigate to allowlisted URLs;
- later integrate with Playwright MCP for DOM-level browser automation.

Initial safe tools:

```text
navigate_url({ url })
```

Future tools requiring additional policy:

```text
click_element({ selector })
type_text({ selector, text })
take_screenshot()
```

## Risk classification

| Tool | Risk | Default |
|---|---|---|
| `open_app` | low when app is allowlisted | allow |
| `write_sandbox_file` | low inside sandbox | allow |
| `navigate_url` | medium for unknown domains | allow/confirm |
| `click_element` | medium/high | confirm |
| `type_text` | medium/high | confirm |
| `send_email` | high | not implemented |
| `run_shell_command` | high | blocked |
| `delete_file` | high | blocked |

## Adapter contract

All adapters should return normalized results:

```ts
interface ToolResult {
  ok: boolean;
  tool: string;
  message: string;
  data?: Record<string, unknown>;
}
```

## Principle

MCP gives the agent capabilities, but this project should expose only the smallest safe set of tools needed for each demo milestone.
