# gpt-terminal-plus

`gpt-terminal-plus` is a comprehensive tool designed for system administration, coding, and general computer tasks. It extends the functionality of the ChatGPT plugin to work efficiently in local and remote environments. Building upon the foundation of the [gpt-terminal-plugin](https://github.com/etherlegend/gpt-terminal-plugin), it's tailored for developers, system administrators, and power users who seek a versatile tool for managing systems, automating tasks, and enhancing their coding workflow.

[![Join our Discord server](https://img.shields.io/badge/Discord-Join%20Server-7289da.svg)](https://discord.gg/YvEJg5CC3X)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Node.js CI](https://github.com/matthewhand/gpt-terminal-plus/actions/workflows/node.js.yml/badge.svg)
<a href="https://github.com/matthewhand/gpt-terminal-plus" target="_blank">
    <img alt="Static Badge" src="https://img.shields.io/badge/free-pricing?logo=free&color=%20%23155EEF&label=pricing&labelColor=%20%23528bff"></a>

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Quick Start Guide](#quick-start-guide)
- [Advanced Usage](#advanced-usage)
- [Configuration](#configuration)
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
    - Edit `config/default.json` or create environment-specific files.
    - Optionally, create a `.env` file for debug mode and other settings.

4. **Running the Application**:
    - For production:
      ```bash
      npm start
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

- **VSCode Integration**: Edit and review code directly from the terminal.

## Configuration

- Configure the application using `config/*.json` files.
- Use the `.env` file for specific settings like debug mode.

## Contributing

We welcome contributions, issues, and feature requests. Please follow our guidelines for contributing and ensure all tests pass before submitting a pull request.

## FAQ

### How do I set up SSH connections?

- Ensure your SSH keys are properly configured and accessible.

### How do I enable debug mode?

- Create a `.env` file with `DEBUG=true`.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
