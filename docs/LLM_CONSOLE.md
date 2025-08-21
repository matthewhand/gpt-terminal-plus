# LLM Console - Execution Log Viewer

A WebUI for viewing and exploring execution session logs with real-time activity tracking.

## Overview

The LLM Console provides a read-only interface to browse historical execution sessions stored in the `data/activity/` directory. It displays session metadata, step-by-step execution logs, and provides filtering capabilities.

## Features

✅ **Session List Sidebar** - Shows all execution sessions with timestamps and step counts  
✅ **Session Detail Viewer** - Displays step-by-step execution logs with syntax highlighting  
✅ **Type-based Filtering** - Filter sessions by execution type (shell, code, llm)  
✅ **Real-time Updates** - Auto-refreshes session list every 30 seconds  
✅ **Authentication Protected** - Requires Bearer token for API access  
✅ **LLM-gated Access** - Only available when LLM execution is enabled  

## Access

### WebUI
- **URL**: `http://localhost:5005/llm/console`
- **Requirement**: LLM execution must be enabled in configuration
- **Authentication**: Uses browser session (no additional auth required for UI)

### API Endpoints

#### GET /activity/list
Lists execution sessions with metadata.

**Parameters:**
- `date` (optional) - Filter by specific date (YYYY-MM-DD)
- `limit` (optional) - Limit number of sessions (default: 50)
- `type` (optional) - Filter by execution type

**Response:**
```json
{
  "status": "success",
  "message": "Sessions retrieved successfully",
  "data": {
    "sessions": [
      {
        "sessionId": "session_1755737188691",
        "date": "2025-08-21",
        "timestamp": "2025-08-21T00:46:28.692Z",
        "user": "gpt-bot",
        "label": "Session",
        "stepCount": 2,
        "types": ["executeShell"]
      }
    ]
  }
}
```

#### GET /activity/session/:date/:id
Retrieves detailed session information including all steps.

**Response:**
```json
{
  "status": "success",
  "message": "Session retrieved successfully",
  "data": {
    "meta": {
      "sessionId": "session_1755737188691",
      "startedAt": "2025-08-21T00:46:28.692Z",
      "user": "gpt-bot",
      "label": "Session"
    },
    "steps": [
      {
        "filename": "01-executeShell-input.json",
        "timestamp": "2025-08-21T00:46:28.692Z",
        "type": "executeShell-input",
        "command": "echo",
        "args": ["ok"]
      }
    ]
  }
}
```

## File Structure

The activity logging system stores sessions in the following structure:

```
data/activity/
├── 2025-08-21/
│   ├── session_1755737188691/
│   │   ├── meta.json              # Session metadata
│   │   ├── 01-executeShell-input.json   # Step 1 input
│   │   └── 02-executeShell-output.json  # Step 1 output
│   └── session_1755737188938/
│       ├── meta.json
│       └── 01-executeShell-input.json
└── 2025-08-22/
    └── ...
```

## UI Components

### SessionListSidebar
- Displays sessions in reverse chronological order
- Shows session ID, timestamp, step count, and execution types
- Supports click-to-select functionality
- Auto-refreshes every 30 seconds

### SessionDetailViewer
- Shows session metadata (ID, user, start time)
- Displays steps with color-coded types:
  - 🟢 **Input steps** - Green border (user inputs)
  - 🔵 **Output steps** - Blue border (execution results)
  - 🔴 **Error steps** - Red border (failures)
- JSON syntax highlighting for step content
- Scrollable content area

## Configuration

The LLM Console is only available when LLM execution is enabled:

```json
{
  "execution": {
    "llm": {
      "enabled": true
    }
  }
}
```

## Security

- **API Authentication**: All `/activity/*` endpoints require Bearer token
- **UI Access**: LLM Console UI is only served when LLM is enabled
- **Read-only**: No modification capabilities - purely for viewing logs
- **File System**: Direct file system access for performance

## Usage Examples

### Browse Recent Sessions
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5005/activity/list?limit=10
```

### Filter by Date
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5005/activity/list?date=2025-08-21
```

### Filter by Type
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5005/activity/list?type=executeShell
```

### Get Session Details
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5005/activity/session/2025-08-21/session_1755737188691
```

## Demo

Run the demo script to see the LLM Console in action:

```bash
./scripts/demo-llm-console.sh
```

This will:
1. Start the server
2. Show available API endpoints
3. Display the LLM Console URL
4. List current activity sessions

## Future Enhancements

- **Live Updates**: WebSocket support for real-time session updates
- **Search**: Full-text search across session content
- **Export**: Download sessions as JSON or CSV
- **Filtering**: Advanced filtering by user, date range, success/failure
- **Visualization**: Charts and graphs for execution patterns