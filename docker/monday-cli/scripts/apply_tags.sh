#!/bin/bash

# Set sleep intervals to manage complexity budget
SLEEP_BEFORE=5
SLEEP_AFTER=5

# Function to apply tags
apply_tags() {
    ITEM_ID=$1
    TAG_IDS=$2

    # Convert space-separated tag IDs into a JSON array
    TAG_ARRAY=$(echo $TAG_IDS | sed 's/ /, /g' | sed 's/^/[/' | sed 's/$/]/')

    sleep $SLEEP_BEFORE

    curl -X POST https://api.monday.com/v2 \
    -H "Authorization: Bearer $MONDAY_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"query\": \"mutation { change_column_value(board_id: 2809374317, item_id: $ITEM_ID, column_id: \\\"genre6__1\\\", value: \\\"{\\\\\\\"tag_ids\\\\\\\": $TAG_ARRAY}\\\") { id } }\"}"

    sleep $SLEEP_AFTER
}

# Apply tags to items with a 5-second delay between each command
#apply_tags 3649110719 "23718055"
#apply_tags 5455650922 "23718057 23718052"
#apply_tags 3649109026 "23718059 23718053"
#apply_tags 2809514853 "23718059 23718062 23718052 23718060"
#apply_tags 3412715564 "23718053 23718056"
#apply_tags 3732763674 "23718052 23718053"
#apply_tags 2809441654 "23718052 23718059"

