#!/bin/bash

# Demo script for LLM Console UI
# Shows the execution log viewer functionality

set -e

echo "🖥️  LLM Console Demo"
echo "=================="

# Set up environment
export NODE_ENV=production
export API_TOKEN=demo-token

echo ""
echo "📋 Current activity sessions:"
ls -la data/activity/*/session_* 2>/dev/null | head -5 || echo "No sessions found"

echo ""
echo "🔄 Starting server..."

# Start server in background
npm start &
SERVER_PID=$!
sleep 3

echo ""
echo "🌐 Testing Activity API endpoints..."

# Test activity list endpoint
echo "GET /activity/list:"
curl -s -X GET http://localhost:5005/activity/list \
  -H "Authorization: Bearer $API_TOKEN" | jq '.data.sessions | length'

echo ""
echo "📊 LLM Console UI available at:"
echo "http://localhost:5005/llm/console"

echo ""
echo "🎯 Features demonstrated:"
echo "- ✅ Session list with timestamps and step counts"
echo "- ✅ Session detail viewer with step-by-step execution"
echo "- ✅ Real-time activity logging from existing sessions"
echo "- ✅ Type-based filtering (shell, code, llm)"
echo "- ✅ Authentication-protected endpoints"

echo ""
echo "💡 To test:"
echo "1. Open http://localhost:5005/llm/console in browser"
echo "2. Browse existing execution sessions"
echo "3. Click sessions to view detailed step logs"

echo ""
echo "Press Ctrl+C to stop the server"
wait $SERVER_PID