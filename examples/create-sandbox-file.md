# Example — Create Sandbox File

## Goal

Validate safe filesystem writes inside a sandbox directory.

## Voice command

```text
Create a file called demo.txt saying MCP is working.
```

## Expected tool call

```json
{
  "tool": "write_sandbox_file",
  "args": {
    "path": "demo.txt",
    "content": "MCP is working.\n"
  }
}
```

## Expected policy decision

```text
allow
```

## Expected result

```json
{
  "ok": true,
  "tool": "write_sandbox_file",
  "message": "Wrote file inside sandbox: sandbox/demo.txt"
}
```

## Blocked example

```json
{
  "tool": "write_sandbox_file",
  "args": {
    "path": "../escape.txt",
    "content": "should not write"
  }
}
```

Expected result:

```text
Blocked by safety policy: Path escapes sandbox directory
```
