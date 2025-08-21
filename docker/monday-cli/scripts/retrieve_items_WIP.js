#!/usr/bin/env node

const mondaySdk = require('monday-sdk-js');
const monday = mondaySdk();
monday.setToken(process.env.MONDAY_TOKEN);

const boardId = 2815497635;

async function retrieveItems() {
  try {
    const itemQuery = await monday.api(`
      query {
        boards(ids: ${boardId}) {
          items(limit: 10) {
            id
            name
          }
        }
      }
    `);

    if (!itemQuery || !itemQuery.data || !itemQuery.data.boards) {
      console.error('Invalid API response structure:', JSON.stringify(itemQuery, null, 2));
      return;
    }

    const items = itemQuery.data.boards[0].items;
    console.log('Retrieved Items:', items);
  } catch (error) {
    console.error('Error retrieving items:', error);
  }
}

retrieveItems();
