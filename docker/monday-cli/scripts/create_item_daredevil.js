const mondaySdk = require('monday-sdk-js');
const monday = mondaySdk();
monday.setToken(process.env.MONDAY_TOKEN);

const boardId = 2809374317;
const groupId = 'new_group81872';

async function createItem() {
  try {
    const response = await monday.api(`
      mutation {
        create_item(board_id: ${boardId}, group_id: "${groupId}", item_name: "Marvels Daredevil") {
          id
        }
      }
    `);
    console.log('Item created with ID:', response.data.create_item.id);
  } catch (error) {
    console.error('Error creating item:', error);
  }
}

createItem();
