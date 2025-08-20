## Additional Steps
- Install Vercel CLI and login.
- Configure secrets via web or CLI, e.g.:
  - `vercel env add API_TOKEN production`
  - `vercel env add PUBLIC_BASE_URL production` (e.g., https://$VERCEL_DOMAIN)
- In your Vercel project settings, adjust Deployment Protection as needed (e.g., disable "Vercel Authentication" if you rely on API_TOKEN for auth). Do not share your actual project URLs; refer to env vars like `$VERCEL_DOMAIN`.
