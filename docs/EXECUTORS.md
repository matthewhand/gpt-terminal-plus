# Executors & Platform‑Aware Starter Config

This document explains how command/code execution is exposed, configured, discovered, and controlled at runtime.

## Goals
- Offer a simple default (“generic” execute) that works on most systems.
- Enable per‑executor endpoints when needed (e.g. `execute-bash`, `execute-python`).
- Provide a starter configuration that adapts to the host platform (detects available shells/interpreters).
- Allow toggling executors on/off and updating their command/path/args at runtime.

## Platform‑Aware Starter Config
On startup (except when `NODE_ENV=test`), the server auto‑detects popular executables:

- Shells: `bash`, `zsh`, `pwsh`/`powershell`
- Interpreters: `python3`/`python`, `node`, `deno` (detection only)

Detection logic lives in `src/utils/executorDetect.ts` and integrates during config bootstrap in `src/config/convictConfig.ts`.

Rules:
- If a candidate is found and its `EXEC_<NAME>_ENABLED` env var is not set, the executor is enabled automatically (shells) or its `cmd` is set (interpreters).
- Python prefers `python3` when available. PowerShell prefers `pwsh` over `powershell`.
- Detection is best‑effort and never throws — it will log a warning if it fails.

You can override any default with environment variables, or at runtime via the API (see below).

## Configuration Schema
In `src/config/convictConfig.ts` under `executors`:

- `exposureMode`: `generic` | `specific` | `both` | `none` (controls OpenAPI exposure)
- Per executor (example: `bash`, `zsh`, `powershell`, `python`, `typescript`):
  - `enabled`: boolean
  - `cmd`: string (name or full path)
  - `args`: string[] (used by code paths today; shell args are reserved for future spawn‑based execution)

Environment overrides follow the pattern:

- `EXEC_BASH_ENABLED=true|false`
- `EXEC_BASH_CMD=/usr/local/bin/bash`
- `EXEC_BASH_ARGS=["-l"]` (JSON or comma‑list depending on your process manager)

## API Surface

- Generic execution (advertised when `exposureMode` includes `generic`):
  - `POST /command/execute-shell` — body `{ command, args?, shell? }`.

- Specific per‑executor execution (advertised when `exposureMode` includes `specific`):
  - Auto‑generated endpoints: `POST /command/execute-<name>` for each configured executor.
  - Shell executors expect `{ command, args? }`.
  - Code executors expect `{ code, timeoutMs? }`.

- Capabilities & Toggles:
  - `GET /command/executors` — lists `{ name, enabled, cmd, args, kind }`.
  - `POST /command/executors/:name/toggle` body `{ enabled }`.
  - `POST /command/executors/:name/update` body `{ cmd?, args? }`.

## Execution Behavior

- Shell execution uses the unified path in `src/routes/command/executeShell.ts` which normalizes results and enforces limits.
  - If a `shell` is explicitly requested, it must be enabled in `executors` (and optionally allowed via `SHELL_ALLOWED`).
  - Future work: support shell‑specific arguments by switching to a spawn‑based runner when args are set.

- Code execution uses `src/routes/command/executeCode.ts` which writes source to a temp file and invokes the interpreter.
  - TypeScript uses `npx ts-node` for portability when enabled.

## UI/UX Recommendations

- Use `exposureMode` to decide which tiles to show: Generic “Execute Command” vs. per‑executor tiles.
- Populate executors from `GET /command/executors` so users can toggle availability and edit paths inline.
- Surface simple validation (e.g. show a warning when an interpreter is disabled or missing).

## Future Enhancements

- Shell args support with `spawn` for true `bash -l`, `zsh -i`, `pwsh -NoProfile` flows.
- OS‑specific hints in the UI when a preferred executable is missing (e.g. brew/apt install suggestions).
- Optional persistence of runtime updates to a user config file.
- Dynamic test matrix to validate each enabled executor on CI across platforms.

