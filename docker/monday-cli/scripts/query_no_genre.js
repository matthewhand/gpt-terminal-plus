#!/usr/bin/env node

const fs = require("fs");
const mondaySdk = require("monday-sdk-js");

// Initialize Monday SDK
const monday = mondaySdk();
monday.setToken(process.env.MONDAY_TOKEN);

// Define the query to list items without a genre
const query = `
{
  boards(ids: 2809374317) {
    groups(ids: "new_group81872") {
      items_page(limit: 100) {
        items {
          id
          name
          column_values(ids: "genre6__1") {
            id
            text
          }
        }
      }
    }
  }
}`;

// Execute the query
monday.api(query)
  .then(res => {
    const items = res.data.boards[0].groups[0].items_page.items;
    const genreLessItems = items.filter(item => !item.column_values[0].text);
    console.log(JSON.stringify(genreLessItems, null, 2));
  })
  .catch(err => {
    console.error("API Error:", err);
  });
