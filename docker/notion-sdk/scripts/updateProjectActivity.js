/**
 * @file updateProjectActivity.js
 * @description 
 *   This script updates an existing project activity in a specified Notion database.
 *   It allows updating the project's title, status, and due date based on the provided Page ID.
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

/**
 * Updates an existing project activity in the specified Notion database.
 * @param {string} pageId - The Page ID of the project activity to update.
 * @param {string} title - (Optional) The new title of the project.
 * @param {string} status - (Optional) The new status of the project.
 * @param {string} dueDate - (Optional) The new due date of the project (YYYY-MM-DD).
 */
async function updateProjectActivity(pageId, title, status, dueDate) {
    try {
        const properties = {};

        if (title) {
            properties['Name'] = {
                title: [
                    {
                        text: { content: title },
                    },
                ],
            };
        }

        if (status) {
            properties['Status'] = {
                select: { name: status },
            };
        }

        if (dueDate) {
            properties['Due Date'] = {
                date: { start: dueDate },
            };
        }

        if (Object.keys(properties).length === 0) {
            console.log('No updates provided. Exiting.');
            return;
        }

        const response = await notion.pages.update({
            page_id: pageId,
            properties: properties,
        });

        console.log(`Project activity updated successfully for Page ID: ${response.id}`);
    } catch (error) {
        console.error('Error updating project activity:', error.body?.message || error.message);
    }
}

// Configure command-line arguments using yargs
const argv = yargs(hideBin(process.argv))
    .option('pageId', {
        alias: 'p',
        description: 'Page ID of the project activity to update',
        type: 'string',
        demandOption: true,
    })
    .option('title', {
        alias: 't',
        description: 'New title of the project activity',
        type: 'string',
    })
    .option('status', {
        alias: 's',
        description: 'New status of the project activity',
        type: 'string',
    })
    .option('dueDate', {
        alias: 'd',
        description: 'New due date of the project activity (YYYY-MM-DD)',
        type: 'string',
    })
    .help()
    .alias('help', 'h')
    .argv;

// Execute the update function with provided arguments
updateProjectActivity(argv.pageId, argv.title, argv.status, argv.dueDate);
