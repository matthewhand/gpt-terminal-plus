# Shell Execution Guide for ChatGPT

## ✅ **Recommended Patterns**

### **1. Literal Mode (Safest)**
```json
{
  "command": "cat",
  "args": ["/path/to/file"]
}
```

### **2. Raw Command Mode**
```json
{
  "command": "echo 'Hello World' > /tmp/test.txt"
}
```

### **3. Heredoc for File Creation**
```json
{
  "command": "cat > /tmp/script.sh << 'EOF'\n#!/bin/bash\necho \"Hello from script\"\nEOF"
}
```

## ❌ **Avoid These Patterns**

- **Double quotes with backticks**: `"echo \`date\`"` 
- **Complex escaping**: `"echo \"nested \\\"quotes\\\"\""`
- **Shell variables in strings**: `"echo $HOME/file"`

## 🔧 **For File Operations**

Use dedicated endpoints instead:
- `POST /file/create` - Create files
- `POST /file/read` - Read files  
- `POST /file/patch` - Update files

## 🎯 **ChatGPT Prompt Addition**

"When using execute-shell, prefer literal mode with command+args array, or use raw commands without complex escaping. For file operations, use dedicated /file/ endpoints instead of shell heredocs."