#!/usr/bin/env node

const mondaySdk = require('monday-sdk-js');
const monday = mondaySdk();
monday.setToken(process.env.MONDAY_TOKEN);

const boardId = 2809374317; // Board ID for Plex

async function updateColumns(itemId, personId, statusLabel) {
  try {
    await monday.api(`
      mutation {
        change_multiple_column_values(
          board_id: ${boardId},
          item_id: ${itemId},
          column_values: "{\"person\": {\"personsAndTeams\": [{\"id\": ${personId}, \"kind\": \"person\"}]}, \"status\": {\"label\": \"${statusLabel}\"}}"
        ) {
          id
        }
      }
    `);
    console.log(`Item ID: ${itemId} updated successfully.`);
  } catch (error) {
    console.error(`Error updating item ID: ${itemId}:`, error);
  }
}

const itemId = process.argv[2];
const personId = process.argv[3];
const statusLabel = process.argv[4];

if (itemId && personId && statusLabel) {
  updateColumns(itemId, personId, statusLabel);
} else {
  console.error('Usage: update_columns.js <itemId> <personId> <statusLabel>');
}

