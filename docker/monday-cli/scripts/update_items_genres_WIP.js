#!/usr/bin/env node

const mondaySdk = require('monday-sdk-js');
const monday = mondaySdk();
monday.setToken(process.env.MONDAY_TOKEN);

const boardId = 2815497635;
const groupId = 'gpt_terminal_plus__1';
const genreColumnId = 'genre6__1';
const commentColumnId = 'text';

const genreMappings = {
  "The Simpsons": ["Comedy", "Animated"],
  "Only Murders in the Building": ["Comedy", "Mystery"]
};

const comments = {
  "The Simpsons": "Iconic family chaos, forever funny!",
  "Only Murders in the Building": "Whodunit in style!"
};

async function updateItems() {
  try {
    const itemQuery = await monday.api(`
      query {
        boards(ids: ${boardId}) {
          groups(ids: "${groupId}") {
            items {
              id
              name
            }
          }
        }
      }
    `);

    if (!itemQuery || !itemQuery.data || !itemQuery.data.boards) {
      console.error('Invalid API response structure:', JSON.stringify(itemQuery, null, 2));
      return;
    }

    const items = itemQuery.data.boards[0].groups[0].items;

    for (const item of items) {
      const genres = genreMappings[item.name];
      const comment = comments[item.name];

      if (genres) {
        console.log(`Assigning genres to ${item.name}: ${genres.join(', ')}`);
        await monday.api(`
          mutation {
            change_multiple_column_values(board_id: ${boardId}, item_id: ${item.id}, column_values: "{\"${genreColumnId}\": {\"labels\": ${JSON.stringify(genres)}}}") {
              id
            }
          }
        `);
      } else if (comment) {
        console.log(`Adding comment to ${item.name}: ${comment}`);
        await monday.api(`
          mutation {
            change_multiple_column_values(board_id: ${boardId}, item_id: ${item.id}, column_values: "{\"${commentColumnId}\": {\"text\": \"${comment}\"}}") {
              id
            }
          }
        `);
      }
    }
  } catch (error) {
    console.error('Error updating items:', error);
  }
}

updateItems();
