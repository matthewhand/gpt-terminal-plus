const { Client } = require('@notionhq/client');

// Initialize Notion client
const notion = new Client({ auth: process.env.NOTION_TOKEN });

// Define the database ID
const databaseId = '99c51b8e-18be-4efd-accb-b64f49e0b86d';

// Function to fetch and list unique Project IDs
async function listProjectIDs() {
  try {
    const response = await notion.databases.retrieve({ database_id: databaseId });
    const projectIDProperty = response.properties['ProjectID'];
    if (projectIDProperty && projectIDProperty.multi_select) {
      console.log('Unique Project IDs:');
      projectIDProperty.multi_select.options.forEach(option => console.log(option.name));
    } else {
      console.log('No Project IDs found in the database.');
    }
  } catch (error) {
    console.error('Error retrieving Project IDs:', error.body?.message || error.message);
  }
}

// Run the function to list Project IDs
listProjectIDs();
