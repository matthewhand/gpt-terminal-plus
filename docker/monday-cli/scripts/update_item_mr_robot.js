const mondaySdk = require('monday-sdk-js');
const monday = mondaySdk();
monday.setToken(process.env.MONDAY_TOKEN);

const boardId = 2809374317;
const itemId = 7222052162; // ID for Mr Robot
const personId = 12498264; // Matt's ID

async function updateItem() {
  try {
    const columnValues = {
      person: { personsAndTeams: [{ id: personId, kind: 'person' }] },
      status: { label: 'In Progress' },
      text: 'An award-winning psychological thriller that dives deep into the world of hacking, mental illness, and corporate corruption. Known for its innovative storytelling and complex, unreliable protagonist.'
    };

    await monday.api(`
      mutation {
        change_multiple_column_values(
          board_id: ${boardId},
          item_id: ${itemId},
          column_values: ${JSON.stringify(columnValues).replace(/"([^(")]*)":/g, '$1:')}
        ) {
          id
        }
      }
    `);
    console.log('Mr Robot updated successfully.');
  } catch (error) {
    console.error('Error updating Mr Robot:', error);
  }
}

updateItem();
