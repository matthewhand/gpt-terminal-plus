### Instructions for Testing Updated `serverRoutes.ts`

#### Steps to Test Locally

1. \**Set Up Environment Variables**
    - Ensure the environment variables are set up correctly as per your `.env` file.
    - Example `.env` file content:
    ````plaintext
    API_TOKEN=euwSwBXH2oq9tTyRvh51iE2XqKis2NvNdkEsUcHXq9TBW44NqTwOshtg47Aef29t
    DEBUG=app:*
    NODE_ENV=prod
    OCI_COMPARTMENT_ID=ocid1.tenancy.oc1..aaaaaaaakubkmj7bno7ornnckvqwwslrr6sycum7do5cm3fuhrtenasapdga
    OCI_COMPARTMENT_NAME=matthewhand
    ````

2. **Start the Development Server**
    - Run the following commands to start the development server:
    ````bash
    cd /home/chatgpt/gpt-terminal-plus
    npm install
    npm run dev
    ````

3. **Test the API Endpoints**
    - Use a tool like `curl` or Postman to test the updated endpoints.
    - Example requests:
    - List Servers:
    ````bash
    curl -X GET http://localhost:5004/list-servers
    ````
    - Set Server:
    ````bash
    curl -X POST http://localhost:5004/set-server -H "Content-Type: application/json" -d '{"server": "teamstinky", "getSystemInfo": true}'
    ````

4. **Verify the Changes**
    - Ensure the responses contain the filtered commands based on the tasks for each server.

5. **Commit Changes to GitHub**
    - Once verified, commit the changes to GitHub.
    - Example commands:
    ````bash
    git add .
    git commit -m "Updated serverRoutes.ts to filter commands based on tasks"
    ````

