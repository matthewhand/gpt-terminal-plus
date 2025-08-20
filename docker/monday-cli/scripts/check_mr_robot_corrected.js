const mondaySdk = require('monday-sdk-js');
const monday = mondaySdk();
monday.setToken(process.env.MONDAY_TOKEN);

const boardId = 2809374317;
const groupId = 'new_group81872';
const itemId = 7222052162;

async function checkItem() {
  try {
    const response = await monday.api(`
      query {
        boards(ids: ${boardId}) {
          groups(ids: \"${groupId}\") {
            items(ids: ${itemId}) {
              name
              column_values { id text }
            }
          }
        }
      }
    `);
    console.log('Query Result:', JSON.stringify(response, null, 2));
  } catch (error) {
    console.error('Error querying item:', error);
  }
}

checkItem();
