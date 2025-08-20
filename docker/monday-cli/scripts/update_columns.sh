#!/bin/bash

# Function to update multiple columns for a specific item on a Monday.com board
# Arguments:
#   1: ITEM_ID (Numeric ID of the item)
#   2: BOARD_ID (Numeric ID of the board)
#   3: COLUMN_VALUES (JSON string of column values to update)
function update_columns() {
    # Ensure all required arguments are provided
    if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ]; then
        echo "Error: Missing arguments. Usage: update_columns ITEM_ID BOARD_ID COLUMN_VALUES"
        return 1
    fi

    local ITEM_ID=$1
    local BOARD_ID=$2
    local COLUMN_VALUES="$3"

    echo "Updating columns for item: $ITEM_ID on board: $BOARD_ID"

    # Debug: Print the command to be executed
    echo "Executing curl command to update columns..."

    sleep 5

    # Execute the API call to update the columns
    local RESPONSE=$(curl -X POST https://api.monday.com/v2 \
    -H "Authorization: Bearer $MONDAY_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"query\": \"mutation { change_multiple_column_values(item_id: $ITEM_ID, board_id: $BOARD_ID, column_values: \\"$COLUMN_VALUES\\") { id } }\"}")

    # Debug: Print the response from the API call
    echo "Response: $RESPONSE"

    sleep 5
}

