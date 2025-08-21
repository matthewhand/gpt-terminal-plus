#!/bin/bash

# Function to delete a specific item from a Monday.com board
function delete_item() {
    ITEM_ID=$1

    echo "Deleting item: $ITEM_ID"

    sleep 5

    curl -X POST https://api.monday.com/v2 \
    -H "Authorization: Bearer $MONDAY_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"query\": \"mutation { delete_item(item_id: $ITEM_ID) { id } }\"}"

    sleep 5
}

