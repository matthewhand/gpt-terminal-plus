# LLM Console Feature Toggle

Administrative control for enabling/disabling the LLM Console UI through configuration settings.

## Overview

The LLM Console feature toggle provides administrators with granular control over UI access to the execution log viewer and query interface. This allows separation between LLM execution capabilities and the console UI.

## Configuration

### Settings Schema

The feature toggle is controlled by the `features.llmConsole` setting:

```json
{
  "features": {
    "llmConsole": false
  }
}
```

### Access Logic

The LLM Console UI (`/llm/console`) requires **BOTH** conditions to be true:

1. **LLM Execution Enabled**: `execution.llm.enabled = true`
2. **LLM Console Feature Enabled**: `features.llmConsole = true`

```javascript
const canAccessConsole = llmEnabled && llmConsoleEnabled;
```

### API Independence

The LLM Query API (`/llm/query`) only requires LLM execution to be enabled, regardless of the console UI toggle:

```javascript
const canQueryLLM = llmEnabled; // Independent of console toggle
```

## UI Integration

### Settings Panel Enhancement

The settings UI (`/settings.html`) automatically shows:

- **When Disabled**: Standard boolean value display
- **When Enabled**: Value + "→ Open Console" link

```html
<!-- Auto-generated when features.llmConsole = true -->
<td>true <a href="/llm/console" style="color: var(--accent);">→ Open Console</a></td>
```

### Dashboard Feature Card

The dashboard (`/dashboard.html`) displays a feature card that:

- **Shows Status**: Enabled/disabled state with requirements
- **Provides Access**: Direct link when both conditions are met
- **Guides Setup**: Instructions when requirements aren't met

```html
<div class="feature-card ${canUseLLMConsole ? '' : 'disabled'}">
  <h3>LLM Execution Console</h3>
  <p>Query your execution history using AI...</p>
  <a href="/llm/console" class="cta ${canUseLLMConsole ? '' : 'disabled'}">
    ${canUseLLMConsole ? 'Launch Console →' : 'Enable in Settings'}
  </a>
</div>
```

## Security & Permissions

### Access Control

- **Authentication Required**: All LLM endpoints require Bearer token
- **Feature Gating**: Console UI returns 404 when feature is disabled
- **Read-only Environment**: Feature toggle respects `READONLY_ENV` settings

### Error Messages

Clear error messages guide administrators:

```json
{
  "status": "error",
  "message": "LLM Console is not available - LLM execution or LLM Console feature is disabled",
  "data": null
}
```

## Configuration Examples

### Enable LLM Console

```json
{
  "execution": {
    "llm": {
      "enabled": true
    }
  },
  "features": {
    "llmConsole": true
  }
}
```

### LLM API Only (No Console UI)

```json
{
  "execution": {
    "llm": {
      "enabled": true
    }
  },
  "features": {
    "llmConsole": false
  }
}
```

### Completely Disabled

```json
{
  "execution": {
    "llm": {
      "enabled": false
    }
  },
  "features": {
    "llmConsole": false
  }
}
```

## Testing

### Feature Toggle Tests

```bash
# Test feature toggle behavior
npm test -- tests/routes/llmConsoleToggle.test.ts

# Demo feature toggle functionality
./scripts/demo-llm-console-toggle.sh
```

### Test Scenarios

1. **Both Disabled**: No LLM access, console returns 404
2. **LLM Only**: Query API works, console returns 404
3. **Both Enabled**: Full access to console and query API
4. **Console Only**: Invalid state, console returns 404

## Implementation Details

### Route Protection

```typescript
// LLM Console route checks both conditions
const llmEnabled = cfg.get('execution.llm.enabled');
const llmConsoleEnabled = cfg.get('features.llmConsole');

if (!llmEnabled || !llmConsoleEnabled) {
  return res.status(404).json({
    status: 'error',
    message: 'LLM Console is not available - LLM execution or LLM Console feature is disabled'
  });
}
```

### Settings Schema

```typescript
export const SettingsSchema = z.object({
  features: z.object({
    llmConsole: z.boolean().default(false),
  }).default({}),
});
```

## Benefits

✅ **Granular Control** - Separate LLM execution from UI access  
✅ **Security** - Disable UI while keeping API functionality  
✅ **Self-Documenting** - Clear status in settings and dashboard  
✅ **User-Friendly** - Automatic links and guidance when enabled  
✅ **Flexible Deployment** - Different configurations for different environments  

## Use Cases

### Production Environment
- Enable LLM API for automation
- Disable console UI for security
- Provide API-only access

### Development Environment
- Enable both for full debugging capabilities
- Use console UI for interactive exploration
- Test query functionality

### Restricted Environment
- Disable both features completely
- Remove LLM capabilities entirely
- Maintain core execution functionality

## Migration Guide

### Existing Installations

1. **Add Feature Toggle**: Update configuration to include `features.llmConsole`
2. **Default Behavior**: Feature defaults to `false` (disabled)
3. **Enable Access**: Set to `true` to restore console access
4. **Verify Setup**: Check dashboard for feature status

### New Installations

1. **Configure During Setup**: Include feature toggle in initial config
2. **Use Dashboard**: Visual confirmation of feature status
3. **Test Access**: Verify both API and UI work as expected