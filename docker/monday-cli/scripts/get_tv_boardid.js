const mondaySdk = require("monday-sdk-js");
const monday = mondaySdk();
monday.setToken(process.env.MONDAY_TOKEN);

// This script retrieves the board ID for the "TV Together Plan 2024" board

const boardName = "TV Together Plan 2024";

async function getBoardId() {
  try {
    const response = await monday.api(`
      query {
        boards (limit: 10) {
          id
          name
        }
      }
    `);
    const boards = response.data.boards;
    const targetBoard = boards.find(board => board.name === boardName);
    if (targetBoard) {
      console.log(`Board ID for ${boardName} is: ${targetBoard.id}`);
    } else {
      console.log(`Board named ${boardName} not found.`);
    }
  } catch (error) {
    console.error("Error fetching board ID:", error);
  }
}

getBoardId();
