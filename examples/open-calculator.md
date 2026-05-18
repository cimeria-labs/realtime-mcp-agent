# Example — Open Calculator

## Goal

Validate the desktop action path with a low-risk allowlisted app.

## Voice command

```text
Open the calculator.
```

## Expected tool call

```json
{
  "tool": "open_app",
  "args": {
    "name": "calculator"
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
  "tool": "open_app",
  "message": "Demo adapter accepted request to open 'calculator'."
}
```

## Notes

The first version uses a mock desktop adapter. A later version can connect this to a Windows MCP server or equivalent local desktop bridge.
