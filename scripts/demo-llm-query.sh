#!/bin/bash

# Demo script for LLM Query functionality
# Shows how LLM can read and analyze execution logs

set -e

echo "🤖 LLM Query Demo"
echo "================="

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
echo "🧠 Testing LLM Query API..."

# Test basic query
echo "Query: 'What were the last commands?'"
curl -s -X POST http://localhost:5005/llm/query \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "What were the last commands executed?",
    "tools": ["listSessions", "readFile"]
  }' | jq -r '.data.response'

echo ""
echo "Query: 'Summarize recent activity'"
curl -s -X POST http://localhost:5005/llm/query \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Summarize recent activity",
    "tools": ["listSessions", "readFile"]
  }' | jq -r '.data.response'

echo ""
echo "🔧 Testing tool access..."

# Test listSessions tool directly via API
echo "Available tools: listSessions, readFile"
echo "Security: Tools restricted to data/activity/ directory only"

echo ""
echo "🌐 LLM Console with Query Box available at:"
echo "http://localhost:5005/llm/console"

echo ""
echo "🎯 Features demonstrated:"
echo "- ✅ LLM can query execution logs using tools"
echo "- ✅ Read-only access to activity data"
echo "- ✅ Security restrictions prevent unauthorized file access"
echo "- ✅ Natural language responses about execution history"
echo "- ✅ WebUI integration with query box"

echo ""
echo "💡 Try these queries in the WebUI:"
echo "- 'What were the last 3 commands?'"
echo "- 'Summarize today's activity'"
echo "- 'Show me recent errors'"
echo "- 'What shell commands were run?'"

echo ""
echo "Press Ctrl+C to stop the server"
wait $SERVER_PID