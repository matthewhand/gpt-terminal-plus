const mondaySdk = require('monday-sdk-js');
const monday = mondaySdk();
monday.setToken(process.env.MONDAY_TOKEN);

async function updateItemGenres(itemId, genreIds) {
    try {
        const boardId = 2809374317; // Replace with your actual board ID
        const genreValue = genreIds.map(id => `"${id}"`).join(',');

        // Mutation to update the genres
        const mutation = `
            mutation {
                change_column_value(board_id: ${boardId}, item_id: ${itemId}, column_id: "genre", value: "[${genreValue}]") {
                    id
                }
            }
        `;
        await monday.api(mutation);
        console.log(`Updated item ID: ${itemId} with genres: [${genreIds.join(', ')}]`);

        // Query to validate the update
        const query = `
            query {
                items(ids: [${itemId}]) {
                    name
                    column_values(ids: ["genre"]) {
                        text
                    }
                }
            }
        `;
        const response = await monday.api(query);
        const item = response.data.items[0];
        console.log(`Validation - Item: ${item.name}, Genres: ${item.column_values[0].text}`);

    } catch (error) {
        console.error('Failed to update or validate item:', error);
    }
}

// Example usage with argument names:
const args = process.argv.slice(2);
const itemId = args.find(arg => arg.startsWith('--item_id=')).split('=')[1];
const genreIds = args.filter(arg => arg.startsWith('--genre_id=')).map(arg => arg.split('=')[1]);

updateItemGenres(itemId, genreIds);
