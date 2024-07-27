# Installing `gpt-terminal-plus` Locally with npm

## Prerequisites

1. **Install Node.js and npm**:
    - Follow the instructions at [Node.js Installation](https://nodejs.org/).

## Steps

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/matthewhand/gpt-terminal-plus.git
    cd gpt-terminal-plus
    ```

2. **Copy and Configure `.env` File**:
    ```bash
    cp .env.sample .env
    # Edit .env to set your configuration values
    ```

3. **Install Dependencies**:
    ```bash
    npm install
    ```

4. **Run the Application**:
    - For production:
      ```bash
      npm start
      ```
    - For development:
      ```bash
      npm run start:dev
      ```

5. **Check the Status and Logs**:
    ```bash
    npm run logs
    ```

## Configuration

- **Update the `.env` File**:
    - Ensure the `.env` file contains all necessary configuration values, especially `API_TOKEN`.

## Troubleshooting

- Ensure Node.js and npm are installed properly.
- Check npm logs for errors.

## Additional Resources

- [Node.js Documentation](https://nodejs.org/)
