/**
 * @file queryProjectActivities.js
 * @description 
 *   This script queries project activities in a Notion database based on specified filters.
 *   It allows filtering by status, due date range, or other properties as defined in the Notion database.
 * 
 * @author 
 *   [Your Name]
 * 
 * @date 
 *   2024-04-27
 */

const { Client } = require('@notionhq/client');
const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');

// Initialize the Notion client using the NOTION_TOKEN environment variable
const notion = new Client({ auth: process.env.NOTION_TOKEN });

// Default Project Activity Database ID (can be overridden via command-line arguments)
const DEFAULT_DATABASE_ID = '99c51b8e18be4efdaccbb64f49e0b86d';

/**
 * Queries project activities based on provided filters.
 * @param {string} databaseId - The ID of the Notion database.
 * @param {object} filters - The filter object as per Notion API specifications.
 */
async function queryProjectActivities(databaseId, filters) {
    try {
        const response = await notion.databases.query({
            database_id: databaseId,
            filter: filters,
        });

        const activities = response.results.map(page => {
            const title = page.properties['Title']?.title?.[0]?.plain_text || 'No Title';
            const status = page.properties['Status']?.select?.name || 'No Status';
            const dueDate = page.properties['Date']?.date?.start || 'No Due Date';
            return { title, status, dueDate };
        });

        if (activities.length === 0) {
            console.log('No project activities match the provided filters.');
            return;
        }

        console.log('--- Queried Project Activities ---\n');
        activities.forEach((activity, index) => {
            console.log(`Project ${index + 1}:`);
            console.log(`Title    : ${activity.title}`);
            console.log(`Status   : ${activity.status}`);
            console.log(`Due Date : ${activity.dueDate}`);
            console.log('---------------------------\n');
        });
    } catch (error) {
        console.error('Error querying project activities:', error.body?.message || error.message);
    }
}

// Configure command-line arguments using yargs
const argv = yargs(hideBin(process.argv))
    .option('filter', {
        alias: 'f',
        description: 'Filter criteria in JSON format',
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

// Parse the filter JSON if provided
let filters = {};
if (argv.filter) {
    try {
        filters = JSON.parse(argv.filter);
    } catch (e) {
        console.error('Invalid JSON format for filter.');
        process.exit(1);
    }
}

// Execute the query function with provided arguments
queryProjectActivities(argv.databaseId, filters);
