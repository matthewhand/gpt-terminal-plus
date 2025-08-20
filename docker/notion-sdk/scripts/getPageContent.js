const { Client } = require('@notionhq/client');
const notion = new Client({ auth: process.env.NOTION_TOKEN });

(async () => {
  try {
    const pageId = process.argv[2];
    if (!pageId) {
      console.error('No page ID provided');
      process.exit(1);
    }
    const response = await notion.pages.retrieve({ page_id: pageId });
    console.log(JSON.stringify(response, null, 2));
  } catch (error) {
    console.error('Error retrieving page:', error);
    process.exit(1);
  }
})();
