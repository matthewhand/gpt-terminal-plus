const mondaySdk = require('monday-sdk-js');
const monday = mondaySdk();
monday.setToken(process.env.MONDAY_TOKEN);

const boardId = 2809374317;
const itemId = 7222050417; // ID for Marvels Daredevil
const personId = 12498264; // Matt's ID

async function updateItem() {
  try {
    const columnValues = {
      person: { personsAndTeams: [{ id: personId, kind: 'person' }] },
      status: { label: 'In Progress' },
      text: 'A gritty, action-packed series that explores the moral complexities of being a vigilante superhero. Praised for its intense fight choreography and deep character development.'
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
    console.log('Marvels Daredevil updated successfully.');
  } catch (error) {
    console.error('Error updating Marvels Daredevil:', error);
  }
}

updateItem();
