#!/bin/bash
set -e

echo "🚀 Starting Real SSH Integration Test"

# Start server in background
npm start &
SERVER_PID=$!
sleep 5

export API_TOKEN=$(grep API_TOKEN .env | cut -d= -f2)

echo "✅ Server started (PID: $SERVER_PID)"

# Test 1: Register worker1
echo "📝 Registering worker1..."
curl -s -X POST http://localhost:5004/server/register \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "hostname": "worker1",
    "protocol": "ssh", 
    "config": {
      "host": "worker1",
      "username": "'${USER:-chatgpt}'",
      "port": 22
    }
  }' | jq .

# Test 2: Execute command on worker1
echo "🔧 Executing command on worker1..."
curl -s -X POST http://localhost:5004/command/execute-shell \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Selected-Server: worker1" \
  -d '{"command": "hostname && echo SSH Integration Success"}' | jq .

# Test 3: Register and test worker2
echo "📝 Registering worker2..."
curl -s -X POST http://localhost:5004/server/register \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "hostname": "worker2",
    "protocol": "ssh",
    "config": {
      "host": "worker2", 
      "username": "'${USER:-chatgpt}'",
      "port": 22
    }
  }' | jq .

echo "🔧 Executing command on worker2..."
curl -s -X POST http://localhost:5004/command/execute-shell \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Selected-Server: worker2" \
  -d '{"command": "hostname && uptime"}' | jq .

# Cleanup
kill $SERVER_PID 2>/dev/null || true
echo "🎉 Integration test complete!"
