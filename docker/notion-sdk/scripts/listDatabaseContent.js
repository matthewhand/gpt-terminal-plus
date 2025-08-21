const { Client } = require('@notionhq/client');
const notion = new Client({ auth: process.env.NOTION_TOKEN });

(async () => {
  try {
    const databaseId = process.argv[2];
    if (!databaseId) {
      console.error('No database ID provided');
      process.exit(1);
    }
    const response = await notion.databases.query({ database_id: databaseId });
    console.log(JSON.stringify(response, null, 2));
  } catch (error) {
    console.error('Error retrieving database content:', error);
    process.exit(1);
  }
})();
