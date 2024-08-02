# Project Name

## Description

<!-- Project description goes here -->

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/project-name.git
   cd project-name
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory and add the following:
   ```env
   API_TOKEN=your_unique_api_token_here
   DEBUG=false
   PORT=5004
   ENABLE_FILE_MANAGEMENT=true
   ```

## Usage

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

## API Endpoints

### File Management Routes

These routes are enabled only if `ENABLE_FILE_MANAGEMENT` is set to `true`.

- `POST /files/change-directory`: Change the current directory.
- `POST /files/create-file`: Create or replace a file.
- `POST /files/update-file`: Update a file by replacing a pattern with a replacement.
- `POST /files/amend-file`: Amend a file by appending content to it.
- `GET /files/list-files`: List files in a directory.

## Extending the Software Modularly

To add new routes or features, follow these steps:

1. **Create a New Route File**: Add a new file in the `src/routes` directory, e.g., `newFeatureRoutes.ts`.

2. **Define Routes**: Define your new routes in the new file, similar to `fileRoutes.ts`.

3. **Update Route Setup**: Add the new routes to the `setupRoutes` function in `src/routes/index.ts`.

Example:

```typescript
import { Express } from 'express';
import newFeatureRoutes from './newFeatureRoutes';

export const setupRoutes = (app: Express) => {
  const enableFileManagement = process.env.ENABLE_FILE_MANAGEMENT === 'true';

  if (enableFileManagement) {
    app.use('/files', fileRoutes);
  }

  app.use('/new-feature', newFeatureRoutes); // Add new routes here
};
```

4. **Environment Variables**: Use environment variables to enable or disable features as needed.

## License

<!-- License information goes here -->
