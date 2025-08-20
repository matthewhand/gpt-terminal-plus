# User Stories

This document captures the intended functionality of the system in plain language, with evidence from the codebase, gaps, and next steps.

## User Story: Execute Shell Commands

**As a user,** I want to run shell commands on my Linux, macOS, or Windows machine, so that I can control my environment remotely.

### Evidence
- abstractServerHandler.ts defines `executeCommand`.
- `LocalServerHandler.ts` implements it using `child_process.exec`.
- `commandRoutes.ts` exists and exposes `/command/execute-shell`.
- `openapi.ts` defines `/command/execute` with `x-openai-isConsequential: true`.
- `convictConfig.ts` includes `execution.shell.enabled` (with env override).
- `SettingsSchema.ts` exposes `features.executeShell`.

### Gaps 
- `commandRoutes.ts` currently mocks shell execution instead of calling the real handler.

### Next Steps 
- Wire `/command/execute-shell` to `LocalServerHandler.executeCommand`.
 - Add tests to verify real command execution across platforms.
  - Ensure OpenAPI spec reflects config toggle and consequential flag.
