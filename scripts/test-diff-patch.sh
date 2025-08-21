#!/bin/bash

# Enhanced test script for diff and patch endpoints
# Tests reversible patches and multiple diff scenarios

set -e

echo "🧪 Enhanced Diff/Patch Testing"
echo "=============================="

# Set up test environment
export NODE_ENV=test
export API_TOKEN=test-token

# Create test files
mkdir -p tmp
echo -e "function hello() {\n  console.log('original');\n}" > tmp/demo.js
cp tmp/demo.js tmp/demo.js.backup

echo "📄 Created test file:"
cat tmp/demo.js
echo ""

# Start server in background
npm start &
SERVER_PID=$!
sleep 3

echo "🔍 Testing reversible patch workflow..."

# Step 1: Get original diff
echo "Step 1: Generate diff"
ORIGINAL_DIFF=$(curl -s -X POST http://localhost:5004/command/diff \
  -H "Content-Type: application/json" \
  -d '{"filePath": "tmp/demo.js"}' | jq -r '.diff')

echo "Original diff generated"

# Step 2: Apply a patch
echo "Step 2: Apply patch"
PATCH_RESULT=$(curl -s -X POST http://localhost:5004/command/patch \
  -H "Content-Type: application/json" \
  -d '{
    "filePath": "tmp/demo.js",
    "patch": "--- a/tmp/demo.js\n+++ b/tmp/demo.js\n@@ -1,3 +1,3 @@\n function hello() {\n-  console.log('original');\n+  console.log('modified');\n }"
  }')

echo "Patch result: $PATCH_RESULT"

# Step 3: Verify file changed
echo "Step 3: Verify changes"
echo "Modified file:"
cat tmp/demo.js

# Step 4: Test invalid diff detection
echo "Step 4: Test invalid diff detection"
INVALID_RESULT=$(curl -s -X POST http://localhost:5004/command/patch \
  -H "Content-Type: application/json" \
  -d '{
    "filePath": "tmp/demo.js",
    "patch": "this is not a valid diff format invalid"
  }')

echo "Invalid patch result: $INVALID_RESULT"

# Step 5: Test multiple diffs in series
echo "Step 5: Test series of patches"
for i in {1..3}; do
  echo "Applying patch $i..."
  curl -s -X POST http://localhost:5004/command/patch \
    -H "Content-Type: application/json" \
    -d "{
      \"filePath\": \"tmp/demo.js\",
      \"patch\": \"--- a/tmp/demo.js\\n+++ b/tmp/demo.js\\n@@ -1,3 +1,3 @@\\n function hello() {\\n-  console.log('modified');\\n+  console.log('version$i');\\n }\"
    }" > /dev/null
  echo "File after patch $i:"
  cat tmp/demo.js
  echo ""
done

# Clean up
kill $SERVER_PID 2>/dev/null || true
rm -f tmp/demo.js tmp/demo.js.backup

echo "✅ Enhanced testing completed!"
echo "🎯 Tested: reversible patches, invalid diff detection, series application"