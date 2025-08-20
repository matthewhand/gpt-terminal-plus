const { Client } = require('@notionhq/client');

// Initialize Notion client
const notion = new Client({ auth: process.env.NOTION_TOKEN });

// Define the database ID
const databaseId = '99c51b8e-18be-4efd-accb-b64f49e0b86d';

// Function to fetch and list unique Tags
async function listTags() {
  try {
    const response = await notion.databases.retrieve({ database_id: databaseId });
    const tagsProperty = response.properties['Tags'];
    if (tagsProperty && tagsProperty.multi_select) {
      console.log('Unique Tags:');
      tagsProperty.multi_select.options.forEach(option => console.log(option.name));
    } else {
      console.log('No Tags found in the database.');
    }
  } catch (error) {
    console.error('Error retrieving Tags:', error.body?.message || error.message);
  }
}

// Run the function to list Tags
listTags();
