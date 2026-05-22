# Example — Browser Navigation

## Goal

Validate URL policy checks before browser automation.

## Voice command

```text
Open example.com.
```

## Expected tool call

```json
{
  "tool": "navigate_url",
  "args": {
    "url": "https://example.com"
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
  "tool": "navigate_url",
  "message": "Demo adapter accepted navigation to 'https://example.com'."
}
```

## Confirmation example

```json
{
  "tool": "navigate_url",
  "args": {
    "url": "https://openai.com"
  }
}
```

Expected result:

```text
Confirmation required: Domain 'openai.com' is not explicitly allowlisted
```

## Notes

A later version can connect this adapter to Playwright MCP for real browser navigation and DOM-level actions.
