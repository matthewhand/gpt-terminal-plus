# Installing `gpt-terminal-plus` on Fly.io

## Prerequisites

1. **Install the Fly.io CLI**:
    - Follow the instructions at [Fly.io CLI Installation](https://fly.io/docs/hands-on/install-flyctl/).

2. **Authenticate the Fly.io CLI**:
    ```bash
    flyctl auth login
    ```

3. **Ensure Docker is Installed and Running**:
    - Follow the instructions at [Docker Installation](https://docs.docker.com/get-docker/).

## Steps

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/matthewhand/gpt-terminal-plus.git
    cd gpt-terminal-plus
    ```

2. **Create a New Fly.io App**:
    ```bash
    flyctl apps create gpt-terminal-plus
    ```

3. **Initialize Fly.io Configuration**:
    ```bash
    flyctl launch
    ```

4. **Deploy the App to Fly.io**:
    ```bash
    flyctl deploy
    ```

5. **Check Status and Logs**:
    ```bash
    flyctl status
    flyctl logs
    ```

## Configuration

- **Update the `fly.toml` File**:
    - Customize as necessary for your deployment needs.
  
- **Set Environment Variables**:
    - Configure environment variables in the Fly.io dashboard for your app.

## Verification

After deploying the app, confirm the installation by checking the following:

1. **Check Application Status**:
    ```bash
    flyctl status -a gpt-terminal-plus
    ```
    Example output (your hostname will differ; avoid publishing real FQDNs):
    ```plaintext
    App
      Name     = gpt-terminal-plus
      Owner    = personal
      Hostname = <your-app>.fly.dev  # e.g., ${FLY_DOMAIN}

    Machines
    PROCESS ID              VERSION REGION  STATE   CHECKS               LAST UPDATED
    app     17811eddb69948  59      syd     started 1 total, 1 warning   2024-07-28T00:40:56Z
    ```

2. **Check Logs**:
    ```bash
    flyctl logs -a gpt-terminal-plus
    ```
    Example output:
    ```plaintext
    2024-07-28T00:40:56.000 app[gpt-terminal-plus] syd [info] Starting app...
    2024-07-28T00:41:00.000 app[gpt-terminal-plus] syd [info] App started successfully
    ```

3. **Verify Application Directory**:
    - List the contents of the expected application directory (e.g., `/app`):
    ```bash
    flyctl ssh console -a gpt-terminal-plus -C "ls -la /app"
    ```
    Example output:
    ```plaintext
    total 172
    drwxr-xr-x   5 root root   4096 Jul 28 00:39 .
    drwxr-xr-x   3 root root   4096 Jul 27 20:03 ..
    drwxr-xr-x   2 root root   4096 Jul 27 19:48 config
    drwxr-xr-x  10 root root   4096 Jul 28 00:39 dist
    drwxr-xr-x 128 root root   4096 Jul 28 00:39 node_modules
    -rw-rw-r--   1 root root 150621 Jul 28 00:39 package-lock.json
    -rw-rw-r--   1 root root   1760 Jul 28 00:10 package.json
    ```

4. **Check Node.js Process**:
    ```bash
    flyctl ssh console -a gpt-terminal-plus -C "ps aux | grep node"
    ```
    Example output:
    ```plaintext
    root         1  0.0  0.1   4508   804 ?        Ss   00:40   0:00 /bin/sh -c node /app/dist/index.js
    root        10  0.1  0.3 123456  6789 ?        Sl   00:40   0:00 node /app/dist/index.js
    ```

## Troubleshooting

### Common Errors

1. **Deployment Fails**:
    - Check the build logs for detailed error messages.

2. **Missing Environment Variables**:
    - Ensure all required environment variables are set in the Fly.io dashboard.

3. **Docker Issues**:
    - Ensure Docker is installed and running properly.

### Additional Resources

- [Fly.io Documentation](https://fly.io/docs/)
- [Docker Documentation](https://docs.docker.com/)
