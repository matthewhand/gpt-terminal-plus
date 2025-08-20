/**
 * @file updateTagsAndProjectId.js
 * @description 
 *   This script iterates through all project activities in the specified Notion database.
 *   It updates each entry by adding 'Tags' and 'ProjectID' if they are not already present.
 *   It prefers using existing tags and project IDs, creating new ones only if necessary.
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
 * Updates tags and project ID for each project activity in the specified Notion database.
 * @param {string} databaseId - The ID of the Notion database.
 */
async function updateTagsAndProjectId(databaseId) {
    try {
        // Fetch the database schema to get existing tags and project IDs
        const databaseSchema = await notion.databases.retrieve({ database_id: databaseId });
        const tagOptions = databaseSchema.properties['Tags']?.multi_select?.options || [];
        const projectIdOptions = databaseSchema.properties['ProjectID']?.rich_text || [];

        // Retrieve all entries from the database
        const response = await notion.databases.query({ database_id: databaseId });
        const entries = response.results;

        for (const entry of entries) {
            const properties = entry.properties;

            // Extract current values for tags and project ID
            const currentTags = properties['Tags']?.multi_select || [];
            const currentProjectId = properties['ProjectID']?.rich_text?.[0]?.plain_text || '';

            // Determine new values for tags
            let newTags = currentTags.length > 0 ? currentTags : [{ name: 'Default Tag' }];
            if (currentTags.length === 0) {
                // Check if a similar tag exists
                const matchingTag = tagOptions.find(option => option.name === 'Default Tag');
                if (matchingTag) {
                    newTags = [matchingTag];
                } else {
                    newTags = [{ name: 'Default Tag' }]; // Add the new tag if no match found
                }
            }

            // Determine new value for project ID
            let newProjectId = currentProjectId || 'DefaultProjectID';
            if (!currentProjectId) {
                // Check if a similar project ID exists
                const matchingProjectId = projectIdOptions.find(option => option.name === 'DefaultProjectID');
                if (matchingProjectId) {
                    newProjectId = matchingProjectId.name;
                } else {
                    newProjectId = 'DefaultProjectID'; // Use the new project ID if no match found
                }
            }

            // Construct the update payload only if changes are needed
            let needsUpdate = false;
            const updatePayload = {};

            if (currentTags.length === 0) {
                updatePayload['Tags'] = { multi_select: newTags };
                needsUpdate = true;
            }

            if (!currentProjectId) {
                updatePayload['ProjectID'] = {
                    rich_text: [
                        {
                            text: { content: newProjectId },
                        },
                    ],
                };
                needsUpdate = true;
            }

            // Update the entry if changes are needed
            if (needsUpdate) {
                await notion.pages.update({
                    page_id: entry.id,
                    properties: updatePayload,
                });
                console.log(`Updated entry with ID: ${entry.id}`);
            }
        }

        console.log('Finished updating entries.');
    } catch (error) {
        console.error('Error updating entries:', error.body?.message || error.message);
    }
}

// Execute the update function
const databaseId = DEFAULT_DATABASE_ID; // Replace with the actual database ID if needed
updateTagsAndProjectId(databaseId);
