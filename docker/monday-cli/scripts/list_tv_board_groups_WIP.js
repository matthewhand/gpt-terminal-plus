const mondaySdk = require("monday-sdk-js");
const monday = mondaySdk();
monday.setToken(process.env.MONDAY_TOKEN);

// Query to fetch all groups and their IDs on the board
const query = `
  query {
    boards (ids: [2809374317]) {
      groups {
        id
        title
      }
    }
  }
`;

monday.api(query)
  .then(res => {
    if (!res || !res.data || !res.data.boards) {
      throw new Error("Invalid response structure");
    }
    const groups = res.data.boards[0].groups;

    console.log("Groups on the board:");
    groups.forEach(group => {
      console.log(`Group: ${group.title} (ID: ${group.id})`);
    });
  })
  .catch(err => {
    console.error("Failed to fetch groups:", err);
  });
