#!/usr/bin/env node

const mondaySdk = require('monday-sdk-js');
const monday = mondaySdk();
monday.setToken(process.env.MONDAY_TOKEN);

const boardId = 2809374317; // Board ID for Plex

async function createItem(groupId, itemName) {
  try {
    const response = await monday.api(`
      mutation {
        create_item(board_id: ${boardId}, group_id: "${groupId}", item_name: "${itemName}") {
          id
        }
      }
    `);
    console.log(`Item "${itemName}" created successfully with ID: ${response.data.create_item.id}`);
    return response.data.create_item.id;
  } catch (error) {
    console.error(`Error creating item "${itemName}":`, error);
  }
}

const groupId = process.argv[2];
const itemName = process.argv[3];

if (groupId && itemName) {
  createItem(groupId, itemName);
} else {
  console.error('Usage: create_item.js <groupId> <itemName>');
}

