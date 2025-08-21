#!/bin/bash

# Demo script that runs many diffs in a loop against temp files
# Tests performance and stability of diff/patch operations

set -e

echo "🔄 Diff/Patch Loop Demo"
echo "======================"

# Set up environment
export NODE_ENV=test
export API_TOKEN=test-token

# Create test directory
mkdir -p tmp/loop-test
cd tmp/loop-test

echo "📁 Creating test files..."

# Create multiple test files with different content
for i in {1..5}; do
  cat > "test$i.js" << EOF
function test$i() {
  console.log('Initial content $i');
  return $i * 2;
}

const value$i = test$i();
console.log('Result:', value$i);
EOF
done

echo "✅ Created 5 test files"

# Start server in background
cd ../..
npm start &
SERVER_PID=$!
sleep 3

echo ""
echo "🔄 Running diff/patch loop (10 iterations)..."

for iteration in {1..10}; do
  echo "--- Iteration $iteration ---"
  
  for file_num in {1..5}; do
    FILE_PATH="tmp/loop-test/test$file_num.js"
    
    # Generate diff
    DIFF_RESULT=$(curl -s -X POST http://localhost:5004/command/diff \
      -H "Content-Type: application/json" \
      -d "{\"filePath\": \"$FILE_PATH\"}")
    
    if echo "$DIFF_RESULT" | jq -e '.diff' > /dev/null; then
      echo "✅ Diff generated for test$file_num.js"
    else
      echo "❌ Diff failed for test$file_num.js"
    fi
    
    # Apply a patch
    PATCH_RESULT=$(curl -s -X POST http://localhost:5004/command/patch \
      -H "Content-Type: application/json" \
      -d "{
        \"filePath\": \"$FILE_PATH\",
        \"patch\": \"--- a/$FILE_PATH\n+++ b/$FILE_PATH\n@@ -1,3 +1,3 @@\n function test$file_num() {\n-  console.log('Initial content $file_num');\n+  console.log('Modified content $file_num iteration $iteration');\n   return $file_num * 2;\"
      }")
    
    if echo "$PATCH_RESULT" | jq -e '.ok' > /dev/null; then
      echo "✅ Patch applied to test$file_num.js"
    else
      echo "⚠️  Patch result: $PATCH_RESULT"
    fi
  done
  
  echo "Completed iteration $iteration"
  sleep 0.5
done

echo ""
echo "📊 Final file states:"
for i in {1..5}; do
  echo "--- test$i.js ---"
  head -2 "tmp/loop-test/test$i.js"
  echo ""
done

# Clean up
kill $SERVER_PID 2>/dev/null || true
rm -rf tmp/loop-test

echo "🎯 Loop demo completed!"
echo "Tested: $((10 * 5 * 2)) total operations (50 diffs + 50 patches)"