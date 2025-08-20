# AI Delegation with execute-llm

The `execute-llm` feature enables ChatGPT to delegate specialized tasks to other AI models with domain expertise, tools, or database access.

## Core Concept

Instead of ChatGPT trying to handle every task directly, it can route specific operations to specialized LLMs:

```
ChatGPT (general conversation) 
  ↓ delegates via execute-llm
GPT Terminal Plus (routing & execution)
  ↓ routes to appropriate LLM
Specialized LLM (domain expert with tools)
```

## Configuration

### Supported LLM Providers
- **Ollama** (local models): `gpt-oss:20b`, `llama3`, `codellama`
- **LM Studio** (local OpenAI-compatible): Custom models
- **OpenAI** (cloud): `gpt-4`, `gpt-3.5-turbo`

### Provider Configuration
```json
{
  "llm": {
    "providers": {
      "ollama": {
        "baseUrl": "http://localhost:11434",
        "defaultModel": "gpt-oss:20b"
      },
      "lmstudio": {
        "baseUrl": "http://localhost:1234",
        "defaultModel": "local-model"
      },
      "openai": {
        "baseUrl": "https://api.openai.com/v1",
        "defaultModel": "gpt-4"
      }
    }
  }
}
```

## Use Cases

### 1. Database Operations
**Scenario**: ChatGPT needs to query/update a database but doesn't have direct access.

```json
POST /command/execute-llm
{
  "instructions": "Update user preferences in the database for user ID 12345 to enable notifications",
  "provider": "database-llm"
}
```

The database LLM has:
- SQL knowledge and best practices
- Database connection credentials
- Schema understanding
- Query optimization expertise

### 2. Code Refactoring
**Scenario**: ChatGPT wants to refactor code files but needs specialized programming knowledge.

```json
POST /command/execute-llm
{
  "instructions": "Refactor the Python authentication module to use JWT tokens instead of sessions",
  "provider": "code-llm"
}
```

The code LLM has:
- Deep programming language knowledge
- Access to file operations
- Code analysis tools
- Testing frameworks

### 3. DevOps Operations
**Scenario**: ChatGPT needs to manage Kubernetes deployments.

```json
POST /command/execute-llm
{
  "instructions": "Scale the web service to handle increased traffic and update the load balancer configuration",
  "provider": "devops-llm"
}
```

The DevOps LLM has:
- Kubernetes CLI access (`kubectl`)
- Infrastructure knowledge
- Monitoring tools access
- Deployment best practices

### 4. Content Management
**Scenario**: ChatGPT needs to update documentation or content files.

```json
POST /command/execute-llm
{
  "instructions": "Update the API documentation to reflect the new authentication endpoints",
  "provider": "docs-llm"
}
```

The documentation LLM has:
- Technical writing expertise
- File system access
- Markdown/documentation tools
- Style guide knowledge

## Implementation Examples

### Database LLM Setup
```bash
# Run specialized database model
ollama run sqlcoder:7b

# Configure in GPT Terminal Plus
{
  "hostname": "database-server",
  "llm": {
    "provider": "ollama",
    "model": "sqlcoder:7b",
    "baseUrl": "http://localhost:11434"
  }
}
```

### Code Analysis LLM
```bash
# Run code-specialized model
ollama run codellama:13b

# Configure for code operations
{
  "hostname": "code-server", 
  "llm": {
    "provider": "ollama",
    "model": "codellama:13b"
  }
}
```

## Execution Flow

1. **ChatGPT** receives user request requiring specialized knowledge
2. **ChatGPT** calls `/command/execute-llm` with task description
3. **GPT Terminal Plus** routes to appropriate specialized LLM
4. **Specialized LLM** executes task using its tools/knowledge
5. **Results** flow back through GPT Terminal Plus to ChatGPT
6. **ChatGPT** presents results to user in conversational format

## Security Considerations

- **Isolation**: Each LLM operates in its own environment
- **Permissions**: LLMs only have access to their designated tools/data
- **Audit logging**: All LLM operations are logged for security
- **Authentication**: Same bearer token security as other endpoints

## Benefits

1. **Specialization**: Each LLM optimized for specific domains
2. **Tool Access**: LLMs can have specialized CLI tools or database access
3. **Scalability**: Add new specialized LLMs without changing core system
4. **Security**: Compartmentalized access and permissions
5. **Performance**: Smaller, focused models can be faster than general-purpose ones

## Configuration Examples

### Multi-LLM Setup
```json
{
  "servers": {
    "database-ops": {
      "protocol": "local",
      "llm": {
        "provider": "ollama",
        "model": "sqlcoder:7b"
      }
    },
    "code-ops": {
      "protocol": "local", 
      "llm": {
        "provider": "ollama",
        "model": "codellama:13b"
      }
    },
    "devops": {
      "protocol": "ssh",
      "host": "k8s-master",
      "llm": {
        "provider": "lmstudio",
        "model": "devops-specialist"
      }
    }
  }
}
```

This enables ChatGPT to intelligently route tasks to the most appropriate AI specialist, creating a powerful multi-AI system for complex operations.