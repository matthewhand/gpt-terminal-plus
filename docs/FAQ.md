## FAQ

### How do I set up SSH connections?

- **Ensure your SSH keys are properly configured and accessible**:
  - Place your private SSH key in the `~/.ssh` directory.
  - Ensure the permissions for the key file are set correctly:
    ```sh
    chmod 600 ~/.ssh/id_rsa
    ```
  - Add the SSH key to the SSH agent:
    ```sh
    ssh-add ~/.ssh/id_rsa
    ```

### How do I enable debug mode?

- **Update the `.env` file**:
  - Set `DEBUG=true` in your `.env` file:
    ```ini
    DEBUG=true
    ```

### How do I deploy the application to Fly.io?

- **Follow the instructions in the [Fly.io Deployment Guide](FLY_IO_DEPLOYMENT.md)**.

### How do I set environment variables?

- **Update the `.env` file**:
  - Refer to the [Configuration Details](CONFIGURATION.md) for detailed information on setting environment variables.

### How do I build and run the Docker container?

- **Follow the instructions in the [Docker Setup Guide](DOCKER_SETUP.md)**.

### How do I contribute to the project?

- **Refer to the [Contribution Guide](CONTRIBUTION.md)** for detailed instructions on how to contribute.

### How do I run tests and linting?

- **Run the following npm commands**:
  - Lint:
    ```sh
    npm run lint
    ```
  - Test:
    ```sh
    npm test
    ```
  - Build:
    ```sh
    npm run build
    ```

### How do I customize the Docker image?

- **Refer to the examples in the `docker/` directory** for guidance on creating custom Docker images.

### How do I configure the application?

- **Refer to the [Configuration Details](CONFIGURATION.md)** for detailed information on configuring the application.

### How do I get help or support?

- **Open an issue on the GitHub repository** if you encounter any issues or need help.
  - Provide as much detail as possible to help us resolve the issue quickly.

