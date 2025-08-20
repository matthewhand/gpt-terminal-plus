# AdminJS Security Guide

## Secure Credential Generation

**GPT Terminal Plus automatically generates secure admin credentials on first startup.**

### First-Time Setup

1. **Start the server**: `npm start`
2. **Check console output** for generated credentials:
   ```
   🔐 ADMIN CREDENTIALS GENERATED:
   📧 Email: admin-a1b2c3d4@gpt-terminal-plus.local
   🔑 Password: XyZ9mN4pQ7sR2vT8
   🌐 Admin URL: http://localhost:5004/admin
   💾 Credentials saved to: data/admin-credentials.json
   ⚠️  Save these credentials securely!
   ```
3. **Save credentials** in your password manager
4. **Access admin panel** at `/admin`

### Security Features

- **Random email**: `admin-{random}@gpt-terminal-plus.local`
- **Strong password**: 20-character base64 string
- **Secure storage**: Credentials saved to `data/admin-credentials.json`
- **Session security**: Cryptographically secure session cookies
- **No hardcoded passwords**: Zero default credentials in code

### Production Deployment

**Environment Variables:**
```bash
SESSION_SECRET=your-32-byte-random-secret-here
```

**Network Security:**
- AdminJS binds to all interfaces by default
- Use reverse proxy (nginx) to restrict access
- Enable HTTPS in production
- Consider IP whitelisting for `/admin` routes

**File Permissions:**
```bash
chmod 600 data/admin-credentials.json  # Owner read/write only
```

### Credential Management

**View current credentials:**
```bash
cat data/admin-credentials.json
```

**Reset credentials:**
```bash
rm data/admin-credentials.json
npm start  # New credentials generated
```

**Manual credential override:**
```json
{
  "email": "your-admin@example.com",
  "password": "your-secure-password"
}
```

### Security Best Practices

1. **Change default session secret** in production
2. **Use HTTPS** for admin access
3. **Restrict network access** to admin panel
4. **Regular credential rotation**
5. **Monitor admin access logs**
6. **Backup credential file securely**

### Network Binding

AdminJS is **NOT** restricted to localhost by default. It binds to all interfaces (`0.0.0.0`).

**For localhost-only access:**
```javascript
// In production, use reverse proxy or firewall rules
app.listen(port, '127.0.0.1', () => {
  console.log('Server bound to localhost only');
});
```

**Recommended production setup:**
- Use nginx reverse proxy
- Enable HTTPS with Let's Encrypt
- Restrict `/admin` to specific IP ranges
- Use fail2ban for brute force protection