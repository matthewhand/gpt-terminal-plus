const { Client } = require('@notionhq/client');
const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');

// Initialize Notion client
const notion = new Client({ auth: process.env.NOTION_TOKEN });

// Define the database ID
const databaseId = '99c51b8e-18be-4efd-accb-b64f49e0b86d';

// Function to fetch project ID options from the database
async function fetchProjectIDOptions() {
  try {
    const response = await notion.databases.retrieve({ database_id: databaseId });
    const projectIDProperty = response.properties['ProjectID'];
    if (projectIDProperty && projectIDProperty.multi_select) {
      return projectIDProperty.multi_select.options.map(option => option.name);
    }
    return [];
  } catch (error) {
    console.error('Error fetching project ID options:', error.body?.message || error.message);
    return [];
  }
}

// Function to validate date format
function isValidDate(date) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

// Function to create a new project activity
async function createProjectActivity(title, notes, status, dueDate, projectID) {
  // Fetch project ID options and validate
  const validProjectIDs = await fetchProjectIDOptions();
  if (projectID && !validProjectIDs.includes(projectID)) {
    console.error(`Invalid ProjectID. Please use one of the following: ${validProjectIDs.join(', ')}`);
    return;
  }

  // Validate date format
  if (!isValidDate(dueDate)) {
    console.error('Invalid date format. Please use YYYY-MM-DD.');
    return;
  }

  try {
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Title: {
          title: [
            {
              type: 'text',
              text: { content: title },
            },
          ],
        },
        Notes: {
          rich_text: [
            {
              type: 'text',
              text: { content: notes },
            },
          ],
        },
        Status: {
          status: { name: status },
        },
        Date: {
          date: { start: dueDate },
        },
        ProjectID: projectID ? {
          multi_select: [{ name: projectID }],
        } : undefined,
      },
    });
    console.log('Project activity created successfully:', response);
  } catch (error) {
    console.error('Error creating project activity:', error.body?.message || error.message);
  }
}

// Collect command-line arguments
const args = yargs(hideBin(process.argv))
  .option('title', {
    alias: 't',
    type: 'string',
    demandOption: true,
    description: 'Title of the project activity',
  })
  .option('notes', {
    alias: 'n',
    type: 'string',
    demandOption: true,
    description: 'Notes for the project activity',
  })
  .option('status', {
    alias: 's',
    type: 'string',
    default: 'Not started',
    description: 'Status of the project activity',
  })
  .option('date', {
    alias: 'd',
    type: 'string',
    demandOption: true,
    description: 'Due date of the project activity (YYYY-MM-DD)',
  })
  .option('projectID', {
    alias: 'p',
    type: 'string',
    description: 'ProjectID of the project activity',
  })
  .help()
  .argv;

// Call the function to create a new project activity
createProjectActivity(args.title, args.notes, args.status, args.date, args.projectID);
