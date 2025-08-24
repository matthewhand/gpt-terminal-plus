# Environment Variables Reference

## 🔧 Server Configuration

### Core Server Settings
```bash
PORT=5004                    # Server port
HOST=0.0.0.0                # Server host binding
PUBLIC_BASE_URL=https://...  # Public URL for OpenAPI specs
NODE_ENV=production          # Environment mode
```

### Security & Authentication
```bash
API_TOKEN=your-secure-token  # API authentication token
CORS_ORIGINS=https://chatgpt.com,https://chat.openai.com  # Allowed CORS origins
```

## ⚡ Execution Features

### Shell Execution
```bash
EXECUTE_SHELL_ENABLED=true           # Enable shell execution
EXECUTE_SHELL_TIMEOUT_MS=120000      # Shell command timeout (2 minutes)
SHELL_ALLOWED=bash,sh,powershell     # Allowed shells
```

### Code Execution  
```bash
EXECUTE_CODE_ENABLED=true            # Enable code interpreters
EXECUTE_CODE_TIMEOUT_MS=120000       # Code execution timeout
CODE_LANGUAGES=python,node          # Supported languages
```

### LLM Delegation
```bash
EXECUTE_LLM_ENABLED=false            # Enable LLM delegation
EXECUTE_LLM_TIMEOUT_MS=120000        # LLM execution timeout
# ⚠️ DEPENDENCY: Requires EXECUTE_SHELL_ENABLED=true
```

### Global Timeout Override
```bash
EXECUTE_TIMEOUT_MS=120000            # Override all execution timeouts
```

## 🔄 Session Management

### Session Configuration
```bash
SESSIONS_ENABLED=false               # Enable persistent sessions
SESSIONS_MAX_COUNT=10                # Maximum concurrent sessions
SESSIONS_TIMEOUT_MS=1800000          # Session idle timeout (30 minutes)
```

## 📁 File Operations

### File System Access
```bash
FILES_ENABLED=true                   # Enable file operations
FILES_MAX_SIZE=10485760             # Maximum file size (10MB)
FILES_ALLOWED_EXTENSIONS=.txt,.md,.json,.js,.ts,.py  # Allowed file types
```

## 🤖 LLM Providers

### OpenAI Configuration
```bash
LLM_PROVIDER=openai                  # Set LLM provider
OPENAI_API_KEY=sk-...               # OpenAI API key
OPENAI_BASE_URL=https://api.openai.com/v1  # OpenAI base URL
OPENAI_MODEL=gpt-4                  # Default model
```

### Ollama Configuration
```bash
LLM_PROVIDER=ollama                  # Set LLM provider
OLLAMA_BASE_URL=http://localhost:11434  # Ollama server URL
OLLAMA_MODEL=llama3.1:8b            # Default model
```

## 🔗 Feature Dependencies

### Critical Dependencies
- **LLM Delegation** → **Shell Execution** (LLM uses shell commands internally)
- **Sessions** → **Shell/Code Execution** (sessions need execution capabilities)

### Validation Rules
```bash
# ❌ Invalid configuration
EXECUTE_SHELL_ENABLED=false
EXECUTE_LLM_ENABLED=true    # Will fail validation

# ✅ Valid configuration  
EXECUTE_SHELL_ENABLED=true
EXECUTE_LLM_ENABLED=true    # LLM can use shell commands
```

## 🎯 Common Configurations

### Development Setup
```bash
NODE_ENV=development
PORT=5004
EXECUTE_SHELL_ENABLED=true
EXECUTE_CODE_ENABLED=true
EXECUTE_LLM_ENABLED=false
SESSIONS_ENABLED=true
FILES_ENABLED=true
```

### Production Setup
```bash
NODE_ENV=production
PORT=5004
PUBLIC_BASE_URL=https://your-domain.com
API_TOKEN=your-secure-production-token
CORS_ORIGINS=https://chatgpt.com,https://chat.openai.com
EXECUTE_SHELL_ENABLED=true
EXECUTE_CODE_ENABLED=true
EXECUTE_LLM_ENABLED=true
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-your-key
SESSIONS_ENABLED=false
FILES_ENABLED=true
```

### Security-First Setup
```bash
NODE_ENV=production
EXECUTE_SHELL_ENABLED=false
EXECUTE_CODE_ENABLED=false
EXECUTE_LLM_ENABLED=false
SESSIONS_ENABLED=false
FILES_ENABLED=false
# Only basic health checks and settings management
```

## 📋 Environment Variable Priority

1. **Environment Variables** (highest priority)
2. **Configuration Files** (`config/*.json`)
3. **Schema Defaults** (lowest priority)

## ⚠️ Security Notes

- **Never commit API keys** to version control
- **Use strong API tokens** in production
- **Restrict CORS origins** to trusted domains
- **Disable unused features** to reduce attack surface
- **Set appropriate timeouts** to prevent resource exhaustion