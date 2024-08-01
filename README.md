# gpt-terminal-plus

`gpt-terminal-plus` is a comprehensive tool designed for system administration, coding, and general computer tasks. It extends the functionality of the ChatGPT plugin to work efficiently in local and remote environments. Building upon the foundation of the [gpt-terminal-plugin](https://github.com/etherlegend/gpt-terminal-plugin), it's tailored for developers, system administrators, and power users who seek a versatile tool for managing systems, automating tasks, and enhancing their coding workflow.

[![Join our Discord server](https://img.shields.io/badge/Discord-Join%20Server-7289da.svg)](https://discord.gg/YvEJg5CC3X)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Node.js CI](https://github.com/matthewhand/gpt-terminal-plus/actions/workflows/node.js.yml/badge.svg)
<a href="https://github.com/matthewhand/gpt-terminal-plus" target="_blank">
    <img alt="Static Badge" src="https://img.shields.io/badge/free-pricing?logo=free&color=%23155EEF&label=pricing&labelColor=%23528bff"></a>

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Quick Start Guide](#quick-start-guide)
- [Advanced Usage](#advanced-usage)
- [Installation](#installation)
- [Customizing the Solution Stack](#customizing-the-solution-stack)
- [Contributing](#contributing)
- [FAQ](#faq)
- [License](#license)

## Introduction

`gpt-terminal-plus` is designed to streamline system administration and development workflows, providing a powerful tool for both local and remote environments. Whether you're managing cloud infrastructure or editing code, `gpt-terminal-plus` offers a robust set of features to enhance your productivity.

## Features

- **Comprehensive System Administration**: Manage systems locally or remotely, with support for SSH and AWS SSM.
- **Enhanced Coding Experience**: Integrated with VSCode for seamless code reviews and edits directly from the terminal.
- **Flexible Configuration**: Easily configure settings for different environments.
- **Debug Mode**: Detailed logging for advanced troubleshooting and insights.

## Quick Start Guide

### Prerequisites

- Node.js and npm.
- Access to local, remote, or cloud systems via SSH or AWS SSM.

### Installation

For detailed installation instructions, refer to the following documentation files:

- [Local Installation with npm](docs/INSTALLATION.local-npm.md)
- [Installation on fly.io](docs/INSTALLATION.fly.io.md)
- [Local Installation with Docker](docs/INSTALLATION.local-docker.md)

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/matthewhand/gpt-terminal-plus.git
    cd gpt-terminal-plus
    ```

2. **Install Dependencies**:
    ```bash
    npm install
    ```

3. **Set Up Configuration**:
    - Create a `.env` file with the following content:
      ```plaintext
      API_TOKEN=your_api_token_here
      ```
    - The default configuration file is `config/production.json`.
    - You can override the configuration directory using the `NODE_CONFIG_DIR` environment variable.

    Example `config/production.json`:
    ```json
    {
      "port": 5004,
      "local": {
        "code": true
      },
      "ssh": {
        "hosts": [
          {
            "name": "example-ssh-server",
            "host": "ssh.example.com",
            "port": 22,
            "username": "user",
            "privateKey": "/path/to/private/key"
          }
        ]
      },
      "ssm": {
        "region": "us-east-1",
        "targets": [
          {
            "name": "example-ssm-instance",
            "instanceId": "i-0123456789abcdef0"
          }
        ]
      }
    }
    ```

4. **Running the Application**:
    - For production:
      ```bash
      NODE_ENV=production npm start
      ```
    - For development:
      ```bash
      npm run start:dev
      ```

## Advanced Usage

### System Administration

- **SSH Management**: Connect and manage remote servers using SSH.
- **AWS SSM Integration**: Seamlessly manage AWS instances with SSM.

### Coding and Development

VSCode will automatically detect changes to the filesystem and update the IDE when the software updates the files. Additionally, if the terminal is on the same workstation as VSCode, you can configure the plugin to use the `code` command to open files directly in the IDE by setting the `code` configuration flag to `true` within the `local` configuration.

Example `local` configuration with `code`:
```json
{
  "local": {
    "code": true
  }
}
```

## Customizing the Solution Stack

The `gpt-terminal-plus` solution stack can be customized to fit specific needs. Each service, such as `aws-cli`, `oci-cli`, `ssh-cli`, `joplin`, and `notion-sdk`, is containerized using Docker, and configurations can be adjusted through their respective Docker Compose files.

### Examples of Customization

- **Adding New Services**: You can add new services by creating new directories with their own `Dockerfile` and `docker-compose.yml`.
- **Adjusting Environment Variables**: Modify the `.env` file or directly in the Docker Compose files to change settings such as ports, API tokens, and other configurations.
- **Updating Dockerfiles**: Customize the `Dockerfile` in each service directory to add or remove dependencies, change build steps, or adjust runtime commands.

Refer to the `docs/DESIGN.docker.md` for more detailed instructions on customizing and extending the solution stack.

## Contributing

We welcome contributions, issues, and feature requests. Please follow our guidelines for contributing and ensure all tests pass before submitting a pull request.

## FAQ

Refer to the [FAQ](docs/FAQ.md) for frequently asked questions.

## License

This project is licensed under the MIT License - see the [docs/LICENSE](docs/LICENSE) file for details.
