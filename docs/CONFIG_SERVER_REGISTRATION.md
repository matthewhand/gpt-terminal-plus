# Config-Based Server Registration

Automatic loading of server definitions from configuration files, eliminating the need for manual `/server/register` calls.

## Overview

Servers are now automatically registered at application startup from the configuration files:
- `config/production.json` 
- `config/development.json`
- `config/test.json`

## Implementation

### 1. In-Memory Registry (`src/managers/serverRegistry.ts`)

```typescript
const registeredServers: Record<string, ServerInfo> = {};

export function registerServerInMemory(server: ServerInfo): void
export function listRegisteredServers(): ServerInfo[]
export function getRegisteredServer(hostname: string): ServerInfo | undefined
export function unregisterServer(hostname: string): boolean
```

### 2. Bootstrap Loader (`src/bootstrap/serverLoader.ts`)

```typescript
export function registerServersFromConfig(): void {
  // Loads from config.local, config.ssh.hosts, config.ssm.targets
  // Registers each server with protocol, hostname, modes, registeredAt
}
```

### 3. Updated Server Routes (`src/routes/serverRoutes.ts`)

```typescript
// GET /server/list now returns from in-memory registry
const servers = listRegisteredServers().map(s => ({
  hostname: s.hostname,
  protocol: s.protocol, 
  modes: s.modes || [],
  registeredAt: s.registeredAt
}));
```

### 4. Application Bootstrap (`src/index.ts`)

```typescript
import { registerServersFromConfig } from './bootstrap/serverLoader';

const main = async (): Promise<void> => {
  // Load servers from config into memory registry
  registerServersFromConfig();
  // ... rest of startup
}
```

## Configuration Format

### Local Server
```json
{
  "local": {
    "hostname": "localhost",
    "protocol": "local"
  }
}
```

### SSH Servers
```json
{
  "ssh": {
    "hosts": [
      {
        "hostname": "worker1",
        "port": 22,
        "username": "chatgpt",
        "privateKeyPath": "/home/chatgpt/.ssh/id_rsa"
      }
    ]
  }
}
```

### SSM Targets
```json
{
  "ssm": {
    "targets": [
      {
        "hostname": "GAMINGPC.WORKGROUP", 
        "instanceId": "i-1234567890abcdef0",
        "platform": "Windows 11"
      }
    ]
  }
}
```

## Benefits

✅ **No Manual Registration** - Servers load automatically at startup  
✅ **Persistent Configuration** - Survives application restarts  
✅ **Fast Access** - In-memory registry for quick lookups  
✅ **Config-Driven** - Centralized server management  
✅ **Backward Compatible** - Existing `/server/register` still works  

## API Changes

### Before
```bash
# Manual registration required after each restart
POST /server/register
{
  "hostname": "worker1",
  "protocol": "ssh", 
  "port": 22
}
```

### After
```bash
# Servers automatically available
GET /server/list
# Returns all configured servers with registeredAt timestamps
```

## Testing

```bash
# Run bootstrap tests
npm test -- tests/bootstrap/serverLoader.test.ts

# Run server routes tests  
npm test -- tests/routes/serverRoutes.registry.test.ts

# Demo script
./scripts/demo-server-registry.sh
```

## Migration Guide

1. **Add servers to config files** instead of calling `/server/register`
2. **Remove manual registration calls** from setup scripts
3. **Update WebUI** to read from `/server/list` (already works)
4. **Optional**: Remove `/server/register` endpoint if no longer needed

## Future Enhancements

- **Config Hot Reload** - Watch config files for changes
- **Server Health Checks** - Validate connectivity at startup
- **Dynamic Registration** - Combine config + runtime registration
- **Server Groups** - Organize servers by environment/purpose