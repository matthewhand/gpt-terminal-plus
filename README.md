# gpt-terminal-plus

`gpt-terminal-plus` is a comprehensive tool designed for system administration, coding, and general computer tasks. It extends the functionality of the ChatGPT plugin to work efficiently in local and remote environments. Building upon the foundation of the [gpt-terminal-plugin](https://github.com/etherlegend/gpt-terminal-plugin), it's tailored for developers, system administrators, and power users who seek a versatile tool for managing systems, automating tasks, and enhancing their coding workflow.

[![Join our Discord server](https://img.shields.io/badge/Discord-Join%20Server-7289da.svg)](https://discord.gg/YvEJg5CC3X)
[![Donate with Stripe](https://img.shields.io/badge/Donate%20with-Stripe-blue.svg)](https://buy.stripe.com/00g14peASeEd7xCcMM)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) 
![Node.js CI](https://github.com/matthewhand/gpt-terminal-plus/actions/workflows/node.js.yml/badge.svg)
    <a href="https://github.com/matthewhand/gpt-terminal-plus" target="_blank">
        <img alt="Static Badge" src="https://img.shields.io/badge/free-pricing?logo=free&color=%20%23155EEF&label=pricing&labelColor=%20%23528bff"></a>

## Features

- **Comprehensive System Administration**: Local and remote system management capabilities, now including AWS SSM support for seamless cloud infrastructure integration.
- **Enhanced Coding Experience**: Leverage VSCode integration for convenient code reviews and edits directly from the terminal.
- **Flexible Configuration**: Customize settings for different environments with easy-to-use configuration files.
- **Debug Mode**: Detailed logging for advanced troubleshooting and development insights.

## Example Use Cases

- Administer systems locally or remotely, including cloud instances via SSH and AWS SSM.
- Edit and review code changes using the integrated VSCode functionality.
- Automate workflows and run applications on local and remote machines.
- Develop, test, and deploy software components in diverse environments.

## Configuration

Configure the application using the `config/*.json` files. Use the `.env` file for specific settings like debug mode.

## Getting Started

### Prerequisites

- Node.js and npm.
- Access to local, remote, or cloud systems via SSH or AWS SSM.

### Installation

1. Clone the repository.
2. Run `npm install` in the cloned directory.
3. Set up environment settings in `config/default.json` or environment-specific files.
4. Optionally, create a `.env` file for debug mode and other settings.

### Running the Application

- Use `npm start` for production.
- For development, `npm run start:dev` starts the app with nodemon.

## Contributing

Contributions, issues, and feature requests are welcome. We follow test-driven development with Jest.

## TODO

- [x] AWS SSM remote handler integration and testing.
- [ ] Update usage examples with logs/screenshots.
- [ ] Further enhancements and feature additions.

## Donation

If you find this project useful, you can support its development by making a donation. Think of it as buying me a coffee. Click on the button below to make a donation. 

<img src="https://github.com/matthewhand/stripe-payment/raw/main/qr_00g14peASeEd7xCcMM.png" width="150" />

Or send to my Ethereum (ETH) wallet
`0xDf994CeA5a0a11397C938cd903259E8496DA15f5`

<img src="https://github.com/matthewhand/stripe-payment/raw/main/etherium-qrcode-receive.png" width="150" />

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
