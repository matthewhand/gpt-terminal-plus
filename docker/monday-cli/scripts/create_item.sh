#!/bin/bash

# Function to create an item on a Monday.com board
# Arguments:
#   1: BOARD_ID (Numeric ID of the board)
#   2: GROUP_ID (ID of the group within the board)
#   3: ITEM_NAME (Name of the item to create)
function create_item() {
    # Ensure all required arguments are provided
    if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ]; then
        echo "Error: Missing arguments. Usage: create_item BOARD_ID GROUP_ID ITEM_NAME"
        return 1
    fi

    local BOARD_ID=$1
    local GROUP_ID=$2
    local ITEM_NAME="$3"

    echo "Creating item: $ITEM_NAME in group: $GROUP_ID on board: $BOARD_ID"

    # Debug: Print the command to be executed
    echo "Executing curl command to create item..."

    sleep 5

    # Execute the API call to create the item
    local RESPONSE=$(curl -X POST https://api.monday.com/v2 \
    -H "Authorization: Bearer $MONDAY_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"query\": \"mutation { create_item(board_id: $BOARD_ID, group_id: \\"$GROUP_ID\\", item_name: \\"$ITEM_NAME\\") { id } }\"}")

    # Debug: Print the response from the API call
    echo "Response: $RESPONSE"

    sleep 5
}

