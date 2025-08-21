#!/bin/bash

# Demo script for LLM Console Feature Toggle
# Shows how the feature can be enabled/disabled in settings

set -e

echo "🎛️  LLM Console Feature Toggle Demo"
echo "=================================="

# Set up environment
export NODE_ENV=production
export API_TOKEN=demo-token

echo ""
echo "🔄 Starting server..."

# Start server in background
npm start &
SERVER_PID=$!
sleep 3

echo ""
echo "🧪 Testing feature toggle behavior..."

echo "1. Testing LLM Console access (should be disabled by default):"
curl -s -X GET http://localhost:5005/llm/console \
  -H "Authorization: Bearer $API_TOKEN" | jq -r '.message' || echo "Access denied (expected)"

echo ""
echo "2. Testing LLM Query (should work regardless of console toggle):"
curl -s -X POST http://localhost:5005/llm/query \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Test query",
    "tools": ["listSessions"]
  }' | jq -r '.status'

echo ""
echo "🌐 Available interfaces:"
echo "- Dashboard: http://localhost:5005/dashboard.html"
echo "- Settings: http://localhost:5005/settings.html"
echo "- LLM Console: http://localhost:5005/llm/console (requires feature toggle)"

echo ""
echo "🎯 Feature Toggle Logic:"
echo "- LLM Console UI requires BOTH:"
echo "  ✓ settings.llm.enabled = true"
echo "  ✓ settings.features.llmConsole = true"
echo "- LLM Query API only requires:"
echo "  ✓ settings.llm.enabled = true"

echo ""
echo "📋 To enable LLM Console:"
echo "1. Set execution.llm.enabled = true in config"
echo "2. Set features.llmConsole = true in config"
echo "3. Restart server"
echo "4. Visit /llm/console"

echo ""
echo "💡 Settings UI enhancements:"
echo "- Shows 'Open Console →' link when feature is enabled"
echo "- Dashboard shows feature card with enable/disable status"
echo "- Feature is self-documenting in settings panel"

echo ""
echo "Press Ctrl+C to stop the server"
wait $SERVER_PID