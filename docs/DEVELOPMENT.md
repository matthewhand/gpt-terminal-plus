
### Mode Logging

For development purposes, incoming requests log their mode:

- `/command/executeShell` → `mode=executeShell`
- `/file/read` → `mode=file:read`
- `/command/executeLlm` → `mode=executeLlm`

This appears in the console with a `[TODO]` prefix, reminding maintainers that structured
logging can be added here in the future.
