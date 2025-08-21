const { MondayClient } = require("monday-sdk-js");
const mondaySdk = require("monday-sdk-js");
const monday = mondaySdk();

monday.setToken(process.env.MONDAY_TOKEN);

// Query to fetch items in the "Plex" group without comments
const query = `
  query {
    boards (ids: [2809374317]) {
      groups (ids: ["new_group81872"]) {
        items {
          id
          name
          column_values(ids: ["comments"]) {
            text
          }
        }
      }
    }
  }
`;

monday.api(query)
  .then(res => {
    const items = res.data.boards[0].groups[0].items;

    // Filter items without comments
    const itemsToUpdate = items.filter(item => !item.column_values[0].text);

    if (itemsToUpdate.length === 0) {
      console.log("No items to update.");
      return;
    }

    // Mutation to update the comments column
    itemsToUpdate.forEach(item => {
      const mutation = `
        mutation {
          change_column_value (board_id: 2809374317, item_id: ${item.id}, column_id: "comments", value: "Your Comment Here") {
            id
          }
        }
      `;

      monday.api(mutation)
        .then(response => {
          console.log(`Successfully updated item ${item.name} with ID ${item.id}`);
        })
        .catch(err => {
          console.error(`Failed to update item ${item.name} with ID ${item.id}: ${err}`);
        });
    });
  })
  .catch(err => {
    console.error(`Failed to fetch items: ${err}`);
  });
