# Deployment Guide

GPT Terminal Plus can be deployed in multiple environments to serve as a backend for ChatGPT Custom GPT Actions.

## Quick Start Options

### 1. Local Desktop (Development)
```bash
git clone https://github.com/your-username/gpt-terminal-plus.git
cd gpt-terminal-plus
npm ci
npm run build
npm start
```
Access at: `http://localhost:5004`

### 2. Cloud Server (VPS/Dedicated)
```bash
# On your server
git clone https://github.com/your-username/gpt-terminal-plus.git
cd gpt-terminal-plus
npm ci
npm run build

# Set environment variables
export API_TOKEN="your-secure-token-here"
export PUBLIC_BASE_URL="https://your-domain.com"
export CORS_ORIGIN="https://chat.openai.com,https://chatgpt.com"

# Run with process manager
pm2 start dist/index.js --name gpt-terminal-plus
```

### 3. Fly.io (Serverless)
```bash
# Install Fly CLI and login
flyctl auth login

# Deploy
flyctl deploy

# Set secrets
flyctl secrets set API_TOKEN="your-secure-token-here"
flyctl secrets set PUBLIC_BASE_URL="https://your-app.fly.dev"
```

### 4. Vercel (Serverless)
```bash
# Install Vercel CLI and login
vercel login

# Deploy
vercel

# Set environment variables
vercel env add API_TOKEN production
vercel env add PUBLIC_BASE_URL production
vercel env add USE_SERVERLESS production # set to "true"
```

## Environment Configuration

### Required Variables
```bash
API_TOKEN=your-secure-random-token-here
```

### Optional Variables
```bash
# Deployment
PUBLIC_BASE_URL=https://your-domain.com
CORS_ORIGIN=https://chat.openai.com,https://chatgpt.com
PORT=5004

# Features
FILES_ENABLED=true
SHELL_ENABLED=true
CODE_ENABLED=true

# Security
DISABLE_HEALTH_LOG=true
```

## Multi-Server Setup

### SSH Servers
Configure SSH access in `config/production.json`:
```json
{
  "ssh": {
    "hosts": [
      {
        "hostname": "worker1",
        "host": "192.168.1.100",
        "username": "admin",
        "port": 22,
        "privateKeyPath": "/path/to/private/key"
      }
    ]
  }
}
```

### AWS SSM
Configure SSM targets:
```json
{
  "ssm": {
    "targets": [
      {
        "hostname": "prod-server",
        "instanceId": "i-1234567890abcdef0",
        "region": "us-west-2"
      }
    ]
  }
}
```

## Security Setup

### 1. Generate Secure API Token
```bash
# Generate a secure random token
openssl rand -hex 32
```

### 2. Configure HTTPS (Production)
```bash
# Using Let's Encrypt with nginx
sudo certbot --nginx -d your-domain.com
```

### 3. Firewall Configuration
```bash
# Allow only necessary ports
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

## Health Monitoring

### Check Service Status
```bash
curl https://your-domain.com/health
```

### View Logs
```bash
# PM2
pm2 logs gpt-terminal-plus

# Fly.io
flyctl logs

# Vercel
vercel logs
```

### Smoke Tests
```bash
# Run included smoke tests
npm run smoke:hosting -- --base https://your-domain.com --token "YOUR_API_TOKEN"
```

## Scaling Considerations

### Horizontal Scaling
- Use load balancer (nginx, Cloudflare)
- Deploy multiple instances
- Share configuration via external store

### Vertical Scaling
- Increase memory limits
- Optimize Node.js heap size
- Use clustering for CPU-bound tasks

## Backup and Recovery

### Configuration Backup
```bash
# Backup server configurations
tar -czf config-backup.tar.gz config/
```

### Database Backup (if using persistent storage)
```bash
# Backup any persistent data
rsync -av data/ backup/data-$(date +%Y%m%d)/
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   sudo lsof -i :5004
   sudo kill -9 <PID>
   ```

2. **SSH Connection Failures**
   ```bash
   ssh-keygen -R hostname  # Remove old host key
   ssh-add ~/.ssh/id_rsa   # Add SSH key to agent
   ```

3. **Permission Denied**
   ```bash
   chmod 600 ~/.ssh/id_rsa
   chown $USER:$USER ~/.ssh/id_rsa
   ```

### Debug Mode
```bash
DEBUG=app:* npm start
```

## Production Checklist

- [ ] Secure API token generated and set
- [ ] HTTPS configured with valid certificate
- [ ] CORS origins restricted to ChatGPT domains
- [ ] SSH keys properly configured and secured
- [ ] Firewall rules configured
- [ ] Health monitoring setup
- [ ] Backup procedures in place
- [ ] Log rotation configured
- [ ] Process manager (PM2) configured for auto-restart