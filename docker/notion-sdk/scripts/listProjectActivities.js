/**
 * @file listProjectActivities.js
 * @description 
 *   This script retrieves and lists all project activities from a specified Notion database.
 *   It displays the project title, status, and due date in a formatted manner.
 * 
 * @author 
 *   [Your Name]
 * 
 * @date 
 *   2024-04-27
 */

const { Client } = require('@notionhq/client');

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

// Retrieve the database ID from command-line arguments or use the default
const databaseId = process.argv[2] || DEFAULT_DATABASE_ID;

// Execute the listing function
listProjectActivities(databaseId);
