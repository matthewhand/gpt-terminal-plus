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
    for (const [itemName, genres] of Object.entries(genreMappings)) {
      const itemQuery = await monday.api(`
        query {
          items_by_column_values(board_id: ${boardId}, column_id: "name", column_value: "${itemName}") {
            id
            name
          }
        }
      `);

      if (!itemQuery || !itemQuery.data || !itemQuery.data.items_by_column_values) {
        console.error('Invalid API response structure:', JSON.stringify(itemQuery, null, 2));
        return;
      }

      const item = itemQuery.data.items_by_column_values[0];

      if (item) {
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
