#!/bin/bash

# Demo script for config-based server registration
# Shows servers loaded from config at startup

set -e

echo "🚀 Config-Based Server Registration Demo"
echo "========================================"

# Set up environment
export NODE_ENV=production
export API_TOKEN=demo-token

echo ""
echo "📋 Current config servers:"
echo "- localhost (local)"
echo "- worker1, worker2 (SSH)"  
echo "- Multiple SSM targets"

echo ""
echo "🔄 Starting server with config-based registration..."

# Start server in background
npm start &
SERVER_PID=$!
sleep 3

echo ""
echo "📡 Testing /server/list endpoint..."

# Test server list endpoint
curl -s -X GET http://localhost:5005/server/list \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" | jq '.servers[] | {hostname, protocol, modes}'

echo ""
echo "✅ Servers automatically loaded from config!"

# Clean up
kill $SERVER_PID 2>/dev/null || true

echo ""
echo "🎯 Benefits:"
echo "- No manual /server/register calls needed"
echo "- Servers persist across restarts"
echo "- Config-driven server management"
echo "- In-memory registry for fast access"