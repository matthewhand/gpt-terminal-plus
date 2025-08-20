const { Client } = require('@notionhq/client');

// Initialize Notion client
const notion = new Client({ auth: process.env.NOTION_TOKEN });

// Define the database ID (update this to your database's ID)
const databaseId = '99c51b8e-18be-4efd-accb-b64f49e0b86d';

// Function to fetch and list status options
async function listStatusOptions() {
  try {
    const response = await notion.databases.retrieve({ database_id: databaseId });
    const statusProperty = response.properties['Status'];
    if (statusProperty && statusProperty.status) {
      console.log('Available status options:');
      statusProperty.status.options.forEach(option => console.log(option.name));
    } else {
      console.log('No status options found in the database.');
    }
  } catch (error) {
    console.error('Error retrieving status options:', error.body?.message || error.message);
  }
}

// Run the function to list status options
listStatusOptions();
