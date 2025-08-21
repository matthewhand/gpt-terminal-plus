#!/usr/bin/env node

const fs = require('fs');
const mondaySdk = require('monday-sdk-js');

// Initialize Monday SDK
const monday = mondaySdk();
monday.setToken(process.env.MONDAY_TOKEN);

// Get inputs dynamically
const [boardId, groupId, genreColumnId, commentColumnId] = process.argv.slice(2);
if (!boardId || !groupId || !genreColumnId || !commentColumnId) {
  console.error('Usage: node assign_genres.js <board_id> <group_id> <genre_column_id> <comment_column_id>');
  process.exit(1);
}

const genreMappings = require('./genre_mappings.json');

const comments = {
  "Our Flag Means Death": "Pirates and laughs—what could go wrong?",
  "Only Murders in the Building": "Whodunit in style!",
  "9-1-1": "Everyday heroes saving the day!",
  "Dirty Jobs": "The grimiest jobs, so you don't have to!",
  "The Simpsons": "Iconic family chaos, forever funny!",
  // Add more mappings for each item as needed...
};

async function assignGenresAndComments() {
  try {
    for (const [itemName, genres] of Object.entries(genreMappings)) {
      const itemQuery = await monday.api(`
        query {
          items_by_column_values(board_id: ${boardId}, column_id: "name", column_value: "${itemName}") {
            id
            name
            group {
              id
            }
          }
        }
      `);

      console.log('API Response:', JSON.stringify(itemQuery, null, 2));

      if (!itemQuery || !itemQuery.data || !itemQuery.data.items_by_column_values) {
        console.error('Invalid API response structure:', itemQuery);
        return;
      }

      const item = itemQuery.data.items_by_column_values.find(i => i.group.id === groupId);
      if (!item) {
        console.error(`Item "${itemName}" not found in the specified group. Skipping.`);
        continue;
      }

      const comment = comments[itemName] || "Enjoy this great show!";

      console.log(`Found item: ${itemName} with ID: ${item.id}`);
      console.log(`Assigning genres: ${genres.join(', ')}`);
      console.log(`Adding comment: ${comment}`);

      const updateResponse = await monday.api(`
        mutation {
          change_multiple_column_values(board_id: ${boardId}, item_id: ${item.id}, column_values: "{\"${genreColumnId}\": {\"labels\": ${JSON.stringify(genres)}}, \"${commentColumnId}\": {\"text\": \"${comment}\"}}") {
            id
          }
        }
      `);

      console.log(`Updated item ${itemName} with genres: ${genres.join(', ')} and comment: ${comment}`);
    }
  } catch (error) {
    console.error('Error during genre and comment assignment:', error);
  }
}

assignGenresAndComments();
