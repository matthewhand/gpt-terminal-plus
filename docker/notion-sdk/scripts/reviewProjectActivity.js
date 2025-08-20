/**
 * @file reviewProjectActivity.js
 * @description 
 *   This script reviews and manages project activities within a Notion database.
 *   It supports listing all activities and creating new ones based on command-line inputs.
 * 
 *   Usage Modes:
 *     - List Mode: Lists all project activities.
 *     - Create Mode: Creates a new project activity.
 * 
 *   Example Commands:
 *     - List: node reviewProjectActivity.js --mode list
 *     - Create: node reviewProjectActivity.js --mode create --title "New Project" --status "In Progress" --dueDate "2024-12-31"
 * 
 * @author 
 *   [Your Name]
 * 
 * @date 
 *   2024-04-27
 */

const { Client } = require('@notionhq/client');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

// Initialize the Notion client using the NOTION_TOKEN environment variable
const notion = new Client({ auth: process.env.NOTION_TOKEN });

// Default Project Activity Database ID (can be overridden via command-line arguments)
const DEFAULT_DATABASE_ID = '99c51b8e18be4efdaccbb64f49e0b86d';

/**
 * Lists all project activities from the specified Notion database.
 * @param {string} databaseId - The ID of the Notion database.
 */
async function listProjectActivities(databaseId) {
    try {
        const response = await notion.databases.query({
            database_id: databaseId,
        });

        const activities = response.results.map(page => {
            const title = page.properties['Title']?.title?.[0]?.plain_text || 'No Title';
            const status = page.properties['Status']?.select?.name || 'No Status';
            const dueDate = page.properties['Date']?.date?.start || 'No Due Date';
            return { title, status, dueDate };
        });

        if (activities.length === 0) {
            console.log('No project activities found.');
            return;
        }

        console.log('--- Project Activity List ---\n');
        activities.forEach((activity, index) => {
            console.log(`Project ${index + 1}:`);
            console.log(`Title    : ${activity.title}`);
            console.log(`Status   : ${activity.status}`);
            console.log(`Due Date : ${activity.dueDate}`);
            console.log('---------------------------\n');
        });
    } catch (error) {
        console.error('Error fetching project activities:', error.body?.message || error.message);
    }
}

/**
 * Creates a new project activity in the specified Notion database.
 * @param {string} databaseId - The ID of the Notion database.
 * @param {string} title - The title of the project.
 * @param {string} status - The current status of the project.
 * @param {string} dueDate - The due date of the project (YYYY-MM-DD).
 */
async function createProjectActivity(databaseId, title, status, dueDate) {
    try {
        const response = await notion.pages.create({
            parent: { database_id: databaseId },
            properties: {
                'Title': {
                    title: [
                        {
                            text: { content: title },
                        },
                    ],
                },
                'Status': {
                    select: { name: status },
                },
                'Date': {
                    date: { start: dueDate },
                },
            },
        });
        console.log(`Project activity created successfully with ID: ${response.id}`);
    } catch (error) {
        console.error('Error creating project activity:', error.body?.message || error.message);
    }
}

// Configure command-line arguments using yargs
const argv = yargs(hideBin(process.argv))
    .option('mode', {
        alias: 'm',
        description: 'Mode of operation: list or create',
        type: 'string',
        choices: ['list', 'create'],
        demandOption: true,
    })
    .option('title', {
        alias: 't',
        description: 'Title of the project activity (required for create mode)',
        type: 'string',
    })
    .option('status', {
        alias: 's',
        description: 'Status of the project activity (optional, default: Pending)',
        type: 'string',
        default: 'Pending',
    })
    .option('dueDate', {
        alias: 'd',
        description: 'Due date of the project activity (YYYY-MM-DD, required for create mode)',
        type: 'string',
    })
    .option('databaseId', {
        alias: 'db',
        description: 'Notion Database ID',
        type: 'string',
        default: DEFAULT_DATABASE_ID,
    })
    .help()
    .alias('help', 'h')
    .argv;

// Main execution based on mode
(async () => {
    const { mode, title, status, dueDate, databaseId } = argv;

    if (mode === 'list') {
        await listProjectActivities(databaseId);
    } else if (mode === 'create') {
        if (!title || !dueDate) {
            console.error('Error: Both --title and --dueDate are required for create mode.');
            console.error('Usage for create mode:');
            console.error('  node reviewProjectActivity.js --mode create --title "Project Title" --status "In Progress" --dueDate "2024-12-31"');
            process.exit(1);
        }
        await createProjectActivity(databaseId, title, status, dueDate);
    }
})();
