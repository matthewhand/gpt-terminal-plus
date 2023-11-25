
# gpt-terminal-plus

`gpt-terminal-plus` is a powerful tool designed to facilitate system administration, coding, and general computer tasks through a ChatGPT plugin running locally on a workstation or similar setup. Inspired by and originally based on the [gpt-terminal-plugin](https://github.com/etherlegend/gpt-terminal-plugin), it's an ideal solution for developers and system administrators who require a robust and flexible environment to manage local and remote systems, automate tasks, and enhance their coding workflow.

[![Join our Discord server](https://img.shields.io/badge/Discord-Join%20Server-7289da.svg)](https://discord.gg/YvEJg5CC3X)
[![Donate with Stripe](https://img.shields.io/badge/Donate%20with-Stripe-blue.svg)](https://buy.stripe.com/00g14peASeEd7xCcMM)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) 
![Node.js CI](https://github.com/matthewhand/gpt-terminal-plus/actions/workflows/node.js.yml/badge.svg)

## Features

- **Local and Remote System Administration**: Manage your systems with ease, whether they're next door or across the globe.
- **Coding with VSCode Integration**: Review and edit code with the convenience of launching VSCode directly from the app.
- **Multi-Environment Configuration**: Tailor the app's settings for different environments with custom configuration files.
- **Debug Mode**: Activate detailed logging for in-depth troubleshooting and development.

## Example Use Cases

- Perform system administration tasks on local and remote hosts via SSH.
- Edit and review code changes by launching VSCode directly from the terminal.
- Run applications and automate workflows on your local machine.
- Develop and test plugins or software components in a local environment.

## Configuration

The application can be configured for various environments using the `config/*.json` files. For enabling debug mode and other specific settings, the `.env` file is used.

## Getting Started

To get started with `gpt-terminal-plus`, clone the repository and follow the setup instructions for your environment.

### Prerequisites

- Node.js and npm installed.
- Access to local or remote systems via SSH (for system administration features).

### Installation

1. Clone the repository.
2. Navigate to the cloned directory and run `npm install` to install dependencies.
3. Configure your environment settings in the `config/default.json` or create a specific environment file like `config/production.json`.
4. If necessary, create a `.env` file for additional settings like enabling debug mode.

### Running the Application

- Start the application with `npm start`.
- For development purposes, you can use `npm run start:dev` to start the application with nodemon, which will watch for file changes.

## Contributing

Contributions are welcome! We use Jest for test-driven development, so please ensure that new features come with adequate test coverage. Feel free to open issues or submit pull requests to improve the application.

## TODO

- [x] Publish code to github
- [ ] Add AWS SSM remote handler
- [ ] Add some examples of usage like chatgpt logs and/or screenshots

## Donation

If you find this project useful, you can support its development by making a donation. Think of it as buying me a coffee. Click on the button below to make a donation. 

<img src="https://github.com/matthewhand/stripe-payment/raw/main/qr_00g14peASeEd7xCcMM.png" width="150" />

Or send to my Ethereum (ETH) wallet
`0xDf994CeA5a0a11397C938cd903259E8496DA15f5`

<img src="https://github.com/matthewhand/stripe-payment/raw/main/etherium-qrcode-receive.png" width="150" />

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
