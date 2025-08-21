#!/usr/bin/env node

const fs = require('fs');
const mondaySdk = require('monday-sdk-js');

// Load the GraphQL query from the file
const queryContent = fs.readFileSync('/scripts/fetch_columns_group_plex.gql', 'utf-8');

// Initialize Monday SDK
const monday = mondaySdk();
monday.setToken(process.env.MONDAY_TOKEN);

// Execute the query
monday.api(queryContent)
  .then(res => {
    console.log('Query Result:', JSON.stringify(res, null, 2));
  })
  .catch(err => {
    console.error('API Error:', err);
  });

