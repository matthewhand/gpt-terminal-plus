#!/bin/bash
set -e

echo "🚀 Comprehensive Endpoint Test"

# Start server
pkill -f "node.*dist/index.js" 2>/dev/null || true
sleep 1
npm start &
SERVER_PID=$!
sleep 5

export API_TOKEN=$(grep API_TOKEN .env | cut -d= -f2)
BASE="http://localhost:5004"

echo "✅ Server started (PID: $SERVER_PID)"

# Test function
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local expected_status=$4
    local description=$5
    
    echo "🔧 Testing: $description"
    
    if [ -n "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" \
            -H "Authorization: Bearer $API_TOKEN" \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$BASE$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" \
            -H "Authorization: Bearer $API_TOKEN" \
            "$BASE$endpoint")
    fi
    
    status=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n -1)
    
    if [ "$status" = "$expected_status" ]; then
        echo "✅ $description - Status: $status"
        return 0
    else
        echo "❌ $description - Expected: $expected_status, Got: $status"
        echo "   Response: $body"
        return 1
    fi
}

# Public endpoints
echo "📋 Testing Public Endpoints"
test_endpoint "GET" "/health" "" "200" "Health check"
test_endpoint "GET" "/openapi.json" "" "200" "OpenAPI spec"
test_endpoint "GET" "/.well-known/ai-plugin.json" "" "200" "Plugin manifest"

# Server endpoints
echo "📋 Testing Server Endpoints"
test_endpoint "GET" "/server/list" "" "200" "List servers"
test_endpoint "POST" "/server/register" '{"hostname":"test-server","protocol":"local"}' "200" "Register server"
test_endpoint "DELETE" "/server/test-server" "" "200" "Remove server"

# Command endpoints
echo "📋 Testing Command Endpoints"
test_endpoint "POST" "/command/execute-shell" '{"command":"echo test"}' "200" "Execute shell command"
test_endpoint "POST" "/command/execute-code" '{"code":"print(\"test\")","language":"python"}' "200" "Execute Python code"
test_endpoint "POST" "/command/execute-llm" '{"instructions":"echo test","dryRun":true}' "200" "Execute LLM (dry run)"
test_endpoint "POST" "/command/execute-session" '{"command":"echo test"}' "200" "Execute with session"

# File endpoints
echo "📋 Testing File Endpoints"
test_endpoint "POST" "/file/create" '{"filePath":"/tmp/test.txt","content":"test content"}' "200" "Create file"
test_endpoint "POST" "/file/read" '{"filePath":"/tmp/test.txt"}' "200" "Read file"
test_endpoint "POST" "/file/list" '{"directory":"/tmp"}' "200" "List files"
test_endpoint "POST" "/file/patch" '{"filePath":"/tmp/test.txt","search":"test","replace":"updated","dryRun":true}' "200" "Patch file (dry run)"

# Settings endpoints
echo "📋 Testing Settings Endpoints"
test_endpoint "GET" "/settings" "" "200" "Get settings"

echo "🧹 Cleanup"
rm -f /tmp/test.txt
kill $SERVER_PID 2>/dev/null || true

echo "🎉 Endpoint testing complete!"