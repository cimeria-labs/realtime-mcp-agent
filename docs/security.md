# Security Model

## Security posture

This project is intentionally conservative. It explores voice-controlled local automation, but it should never provide unrestricted machine control by default.

## Public repository policy

Never commit:

- `.env` files;
- API keys;
- OAuth tokens;
- service account JSON files;
- private certificates or local TLS keys;
- personal filesystem paths;
- raw execution logs with sensitive data;
- screenshots containing private information;
- customer, business, or personal data.

Use `.env.example` for configuration examples.

## Tool execution policy

All tools should be classified as one of:

| Class | Meaning | Example | Default |
|---|---|---|---|
| Safe | Low-risk local demo action | open calculator | allow |
| Sandboxed | Allowed only in controlled folder | write demo file | allow inside sandbox |
| Confirmation required | External or potentially sensitive action | submit form, send email | ask user |
| Blocked | Destructive or broad machine access | arbitrary shell, delete system file | block |

## Filesystem guardrails

- Writes must be restricted to a configured sandbox directory.
- Path traversal must be blocked.
- Absolute paths should not be accepted from the model.
- Public examples must use fake paths such as `./sandbox`.

## Desktop guardrails

- Applications must be allowlisted.
- No arbitrary command execution by default.
- System settings changes are blocked.
- Destructive OS actions are blocked.

## Browser guardrails

- URLs should be validated.
- Dangerous schemes such as `file:`, `javascript:`, and `data:` should be blocked.
- Form submission requires confirmation.
- Purchases, login actions, account changes, and email sending require confirmation.

## Suggested allowlist for demos

```json
{
  "desktopApps": ["calculator", "notepad"],
  "browserDomains": ["example.com"],
  "filesystemRoot": "./sandbox"
}
```

## Suggested denylist

```json
{
  "commands": ["rm", "del", "format", "shutdown", "reg", "powershell -encodedcommand"],
  "urlSchemes": ["file", "javascript", "data"]
}
```

## Human-in-the-loop rules

Require confirmation before:

- deleting files;
- overwriting existing files;
- sending messages or emails;
- submitting forms;
- downloading files from unknown domains;
- making purchases;
- running shell commands;
- accessing folders outside the sandbox.

## Threat model

Main risks:

1. Prompt injection causing unintended tool use.
2. Browser automation acting on malicious pages.
3. Filesystem writes outside intended scope.
4. Secret leakage through logs or screenshots.
5. Overclaiming autonomy in public documentation.

## Mitigations

- Tool allowlists.
- Sandbox filesystem root.
- Confirmation gates.
- Structured tool schemas.
- Minimal logs.
- Public demo data only.
- CI checks for common secret file names.

## Status

This is a portfolio-grade experimental security model. It is not a formally verified sandbox and should not be used to control sensitive systems without additional review.
