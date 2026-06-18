# Archived / Legacy Documentation

This directory contains historical material that is no longer representative of the current architecture or state of GPT Terminal Plus.

## What is here
- Old development session notes and dated test run reports (2025 era)
- Previous IMPLEMENTATION notes that describe superseded designs (e.g. heavy emphasis on containers, different engines structure, WebSocket sessions, .sessions.json)
- Patch files and incremental change logs from earlier experiments
- PR analysis and other one-off retrospectives

## Why keep them?
They document how the project evolved. Useful for:
- Understanding why certain decisions were made (e.g. move from top-level side effects to explicit `bootstrap()`)
- Historical context on test bloat → quality focus, engine → handler refactoring, etc.
- Avoiding repeating old mistakes

## Current state
See the root [README.md](../README.md) and especially [VISION.md](../VISION.md) for the current vision and honest assessment.

Key modern documents (outside this folder):
- docs/VISION.md
- docs/ROADMAP.md
- docs/DEVELOPMENT.md
- docs/DESIGN_*.md (current principles)
- AGENTS.md (contribution / coding rules)
- TODO.md

Do not treat archived material as current implementation guidance.
