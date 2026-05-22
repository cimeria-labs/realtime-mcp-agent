# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project identity

This repository is a professional portfolio project for a **Realtime Voice-Controlled MCP Agent Workbench**.

The project must stay honest about its status:

- describe implemented behavior as implemented;
- describe planned behavior as planned;
- do not claim production readiness;
- do not commit private keys, `.env`, certificates, tokens, service accounts, personal paths, raw logs, or real customer data.

## Engineering goals

1. Keep the demo reproducible.
2. Prefer small, reviewable changes.
3. Preserve the safety-first architecture.
4. Keep tool execution explicit and auditable.
5. Use fake/sample data in public examples.

## Core architecture

```text
client voice UI
  -> local server
  -> realtime session
  -> tool router
  -> safety policy
  -> MCP-style adapters
```

## Guardrails

Do not add unrestricted shell execution.

Do not add code that writes outside the sandbox folder.

Do not add credentials or real local machine paths.

Do not silently perform risky operations such as:

- sending emails;
- deleting files;
- submitting forms;
- making purchases;
- changing system settings;
- executing arbitrary commands.

Risky operations must require explicit human confirmation.

## Coding style

- TypeScript-first.
- Keep modules small.
- Prefer dependency-light code until the demo is stable.
- Include clear errors and safe fallbacks.
- Keep demo commands cross-platform where possible.

## Suggested task order

1. Validate static repo structure.
2. Add mock tool router and safety policy.
3. Add demo CLI for safe tools.
4. Add browser UI skeleton.
5. Add Realtime session creation.
6. Add MCP adapters.
7. Add tests and CI.

## Definition of done

A change is done when:

- it does not introduce secrets;
- it preserves guardrails;
- it is documented;
- it can be explained in the README or docs;
- it keeps the repo suitable for public portfolio review.
