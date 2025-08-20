# Local Installation using npm

## Prerequisites

- Node.js and npm installed on your machine.
- Clone the repository:
  ```sh
  git clone https://github.com/your-repo/project-name.git
  cd project-name
  ```

## Installation

1. Install dependencies:
   ```sh
   npm install
   ```

2. Create a `.env` file in the root directory and add the following:
   ```env
   API_TOKEN=your_unique_api_token_here
   DEBUG=false
   PORT=5004
   ENABLE_FILE_MANAGEMENT=true
   ```

## Running the Application

To start the server, run:
```sh
npm start
```

The server will run on the port specified in the `.env` file.

## Environment Variables

### Required
- `API_TOKEN`: Used to secure `gpt-terminal-plus`.
- `DEBUG`: Set to `true` for detailed logging. Default is `false`.
- `PORT`: The port on which the application will run.
- `ENABLE_FILE_MANAGEMENT`: Enable or disable file management routes.

### Optional
- `NODE_ENV`: Specifies the environment in which the application is running. Default is `development`.
- `NOTION_TOKEN`: Token used for Notion API authentication.
- `OCI_COMPARTMENT_ID`: OCI Service Configuration - Compartment ID.
- `OCI_COMPARTMENT_NAME`: OCI Service Configuration - Compartment Name.
- `AWS_ACCESS_KEY_ID`: AWS Service Configuration - Access Key ID.
- `AWS_SECRET_ACCESS_KEY`: AWS Service Configuration - Secret Access Key.
- `AWS_REGION`: AWS Service Configuration - Region.
- `SUPPRESS_NO_CONFIG_WARNING`: Suppress warnings related to missing configuration.
