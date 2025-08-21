#!/usr/bin/env node

const mondaySdk = require('monday-sdk-js');
const monday = mondaySdk();
monday.setToken(process.env.MONDAY_TOKEN);

const boardId = 2815497635;
const genreColumnId = 'genre6__1';

const genreMappings = {
  "The Simpsons": ["Comedy", "Animated"],
  "Only Murders in the Building": ["Comedy", "Mystery"]
};

async function updateGenres() {
  try {
    const itemQuery = await monday.api(`
      query {
        boards(ids: ${boardId}) {
          items_connection(limit: 100) {
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

    const items = itemQuery.data.boards[0].items_connection.items;

    for (const item of items) {
      const genres = genreMappings[item.name];

      if (genres) {
        console.log(`Assigning genres to ${item.name}: ${genres.join(', ')}`);
        await monday.api(`
          mutation {
            change_multiple_column_values(board_id: ${boardId}, item_id: ${item.id}, column_values: "{\"${genreColumnId}\": {\"labels\": ${JSON.stringify(genres)}}}") {
              id
            }
          }
        `);
      }
    }
  } catch (error) {
    console.error('Error updating genres:', error);
  }
}

updateGenres();
