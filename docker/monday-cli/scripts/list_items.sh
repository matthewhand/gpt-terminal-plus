#!/bin/bash

# Function to list all items from a specified board and group
# Arguments:
#   1: BOARD_ID (Numeric ID of the board)
#   2: GROUP_ID (ID of the group within the board)
function list_items() {
    # Ensure all required arguments are provided
    if [ -z "$1" ] || [ -z "$2" ]; then
        echo "Error: Missing arguments. Usage: list_items BOARD_ID GROUP_ID"
        return 1
    fi

    local BOARD_ID=$1
    local GROUP_ID=$2

    echo "Listing items from group: $GROUP_ID on board: $BOARD_ID"

    # Debug: Print the command to be executed
    echo "Executing curl command to list items..."

    sleep 5

    # Execute the API call to list items
    local RESPONSE=$(curl -X POST https://api.monday.com/v2 \
    -H "Authorization: Bearer $MONDAY_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"query\": \"query { boards(ids: $BOARD_ID) { groups(ids: \\"$GROUP_ID\\") { items_page(limit: 10) { items { id name column_values { id text value } } } } } }\"}")

    # Debug: Print the response from the API call
    echo "Response: $RESPONSE"

    sleep 5
}

