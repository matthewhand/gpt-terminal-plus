# File API Documentation

Complete reference for all `/file/*` endpoints with standardized response format.

## Response Format

All file API endpoints return responses in this standardized format:

```json
{
  "status": "success" | "error",
  "message": "Human readable message",
  "data": { /* endpoint-specific data */ } | null
}
```

## Endpoints

### POST /file/create

Create or replace a file with content.

**Request:**
```bash
curl -X POST http://localhost:5005/file/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "filePath": "/path/to/file.txt",
    "content": "Hello World",
    "backup": true
  }'
```

**Response:**
```json
{
  "status": "success",
  "message": "File created successfully",
  "data": {
    "filePath": "/path/to/file.txt",
    "backup": true
  }
}
```

### POST /file/read

Read file content, optionally with line range constraints.

**Request:**
```bash
curl -X POST http://localhost:5005/file/read \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "filePath": "/path/to/file.txt",
    "startLine": 1,
    "endLine": 10,
    "encoding": "utf8",
    "maxBytes": 1048576
  }'
```

**Response:**
```json
{
  "status": "success",
  "message": "File read successfully",
  "data": {
    "filePath": "/absolute/path/to/file.txt",
    "encoding": "utf8",
    "startLine": 1,
    "endLine": 10,
    "truncated": false,
    "content": "File content here..."
  }
}
```

### POST /file/update

Update file content using pattern replacement.

**Request:**
```bash
curl -X POST http://localhost:5005/file/update \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "filePath": "/path/to/file.txt",
    "pattern": "old text",
    "replacement": "new text",
    "backup": true,
    "multiline": false
  }'
```

### POST /file/patch

Apply a structured patch to a file.

**Request:**
```bash
curl -X POST http://localhost:5005/file/patch \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "filePath": "/path/to/file.txt",
    "search": "function old()",
    "replace": "function new()",
    "startLine": 5,
    "endLine": 10,
    "dryRun": false
  }'
```

### POST /file/diff

Apply a unified diff using git apply.

**Request:**
```bash
curl -X POST http://localhost:5005/file/diff \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "diff": "--- a/file.txt\n+++ b/file.txt\n@@ -1,3 +1,3 @@\n line1\n-old content\n+new content\n line3",
    "dryRun": false,
    "whitespaceNowarn": true
  }'
```

### POST /file/list

List files in a directory.

**Request:**
```bash
curl -X POST http://localhost:5005/file/list \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "directory": "/path/to/directory"
  }'
```

**Alternative GET:**
```bash
curl -X GET "http://localhost:5005/file/list?directory=/path/to/directory" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### POST /file/amend

Append content to an existing file.

**Request:**
```bash
curl -X POST http://localhost:5005/file/amend \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "filePath": "/path/to/file.txt",
    "content": "\nAppended content",
    "backup": true
  }'
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "status": "error",
  "message": "Detailed error description",
  "data": null
}
```

Common HTTP status codes:
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (missing/invalid token)
- `404` - Not Found (file doesn't exist)
- `500` - Internal Server Error

## WebUI Integration

The WebUI maps to these endpoints as follows:

- **File Editor** → `/file/read` + `/file/patch`
- **File Browser** → `/file/list`
- **Diff Viewer** → `/file/diff` (preview mode)
- **Create File** → `/file/create`
- **Append Content** → `/file/amend`

## Security Notes

- All file operations require Bearer token authentication
- File paths are resolved to absolute paths for security
- Backup files are created by default for destructive operations
- Content length limits apply to prevent memory exhaustion
- Shell commands are never used for file modification