# Contribution Guide

We welcome contributions, issues, and feature requests. Please follow our guidelines for contributing and ensure all tests pass before submitting a pull request.

## Guidelines

1. **Fork the Repository**: Create a fork of the repository on GitHub.
2. **Clone Your Fork**: Clone your fork to your local machine.
    ```sh
    git clone https://github.com/your-username/gpt-terminal-plus.git
    cd gpt-terminal-plus
    ```
3. **Create a Branch**: Create a new branch for your feature or bugfix.
    ```sh
    git checkout -b feature-or-bugfix-name
    ```
4. **Make Your Changes**: Make your changes to the codebase.
5. **Run Tests and Linting**: Ensure that all tests and linting pass.
6. **Commit Your Changes**: Commit your changes with a descriptive commit message.
    ```sh
    git commit -m "Description of the feature or bugfix"
    ```
7. **Push Your Branch**: Push your branch to your fork on GitHub.
    ```sh
    git push origin feature-or-bugfix-name
    ```
8. **Create a Pull Request**: Create a pull request from your fork to the main repository.

## Running Tests and Linting

Before submitting a pull request, please ensure that the following npm commands work:

- **Lint**:
    ```sh
    npm run lint
    ```

- **Test**:
    ```sh
    npm test
    ```

- **Build**:
    ```sh
    npm run build
    ```

These commands will help maintain code quality and consistency across the project.

## Makefile Commands

The Makefile includes the following commands:

- **lint**: Run ESLint to check the code for potential issues.
- **test**: Run the test suite.
- **build**: Compile the TypeScript code.
- **launch-terminal**: Launch the terminal service using Docker Compose.

## Documentation

Ensure that any new features or changes are documented. Update the relevant `docs/` files and include examples if necessary.

## Code Style

- Follow the existing code style and conventions.
- Use TypeScript and ensure all types are explicitly defined.
- Add comments to explain complex logic or decisions.

## Issue Reporting

If you encounter any issues, please report them using the GitHub issue tracker. Provide as much detail as possible to help us resolve the issue quickly.

## Code of Conduct

Please adhere to the [Code of Conduct](CODE_OF_CONDUCT.md) to ensure a welcoming and inclusive environment for all contributors.

