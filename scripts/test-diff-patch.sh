#!/bin/bash
set -e

echo "🧪 Testing Diff/Patch Functionality"

# Start server
pkill -f "node.*dist/index.js" 2>/dev/null || true
sleep 1
npm start &
SERVER_PID=$!
sleep 5

export API_TOKEN=$(grep API_TOKEN .env | cut -d= -f2)
BASE="http://localhost:5004"

echo "✅ Server started (PID: $SERVER_PID)"

# Create test file
echo "📝 Creating test file"
curl -s -H "Authorization: Bearer $API_TOKEN" -H "Content-Type: application/json" \
  -d '{"filePath":"/tmp/diff-test.txt","content":"line 1\nold content\nline 3"}' \
  "$BASE/file/create" | jq .

# Test patch operation
echo "🔧 Testing patch operation"
curl -s -H "Authorization: Bearer $API_TOKEN" -H "Content-Type: application/json" \
  -d '{"filePath":"/tmp/diff-test.txt","search":"old content","replace":"new content"}' \
  "$BASE/file/patch" | jq .

# Verify patch was applied
echo "✅ Verifying patch result"
curl -s -H "Authorization: Bearer $API_TOKEN" -H "Content-Type: application/json" \
  -d '{"filePath":"/tmp/diff-test.txt"}' \
  "$BASE/file/read" | jq .

# Test diff dry run
echo "🔧 Testing diff dry run"
DIFF='--- a/diff-test.txt
+++ b/diff-test.txt
@@ -1,3 +1,3 @@
 line 1
-new content
+diff updated content
 line 3'

curl -s -H "Authorization: Bearer $API_TOKEN" -H "Content-Type: application/json" \
  -d "{\"diff\":\"$DIFF\",\"dryRun\":true}" \
  "$BASE/file/diff" | jq .

# Test SSH diff/patch if worker1 is available
if ssh -o ConnectTimeout=5 -o BatchMode=yes worker1 'echo "SSH available"' 2>/dev/null; then
  echo "🌐 Testing SSH diff/patch on worker1"
  
  # Register worker1
  curl -s -H "Authorization: Bearer $API_TOKEN" -H "Content-Type: application/json" \
    -d '{"hostname":"worker1-test","protocol":"ssh","config":{"host":"worker1","username":"'${USER:-chatgpt}'","port":22}}' \
    "$BASE/server/register" | jq .
  
  # Create file on worker1
  curl -s -H "Authorization: Bearer $API_TOKEN" -H "Content-Type: application/json" \
    -H "X-Selected-Server: worker1-test" \
    -d '{"filePath":"/tmp/ssh-diff-test.txt","content":"SSH line 1\nSSH old content\nSSH line 3"}' \
    "$BASE/file/create" | jq .
  
  # Patch file on worker1
  curl -s -H "Authorization: Bearer $API_TOKEN" -H "Content-Type: application/json" \
    -H "X-Selected-Server: worker1-test" \
    -d '{"filePath":"/tmp/ssh-diff-test.txt","search":"SSH old content","replace":"SSH new content"}' \
    "$BASE/file/patch" | jq .
  
  # Verify SSH patch
  curl -s -H "Authorization: Bearer $API_TOKEN" -H "Content-Type: application/json" \
    -H "X-Selected-Server: worker1-test" \
    -d '{"filePath":"/tmp/ssh-diff-test.txt"}' \
    "$BASE/file/read" | jq .
  
  echo "✅ SSH diff/patch testing complete"
else
  echo "⚠️  Skipping SSH tests - worker1 not available"
fi

# Cleanup
echo "🧹 Cleanup"
rm -f /tmp/diff-test.txt
kill $SERVER_PID 2>/dev/null || true

echo "🎉 Diff/Patch testing complete!"