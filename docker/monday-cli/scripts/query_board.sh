#!/bin/bash

# Function to query various details from a board
function query_board() {
    BOARD_ID=$1

    echo "Querying details from board: $BOARD_ID"

    sleep 5

    curl -X POST https://api.monday.com/v2 \
    -H "Authorization: Bearer $MONDAY_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"query\": \"query { boards(ids: $BOARD_ID) { groups { id title items_page(limit: 10) { items { id name column_values { id text value } } } } } }\"}"

    sleep 5
}

