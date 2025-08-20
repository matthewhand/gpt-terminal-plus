User has authorized the use of the Monday.com CLI.

## Golden Rule
- Prioritize action over discussion.
- Always validate the API schema, use the correct fields, and prefer `items_connection` for item queries.
- Maintain a repository of scripts in `/scripts/`, marking them as drafts until they are verified as working. Prefer the use of TypeScript/JavaScript.

## Advice
- **Use `items_page` for Group Queries**: When querying items within a group, use the `items_page` field to paginate through items correctly.
- **Address Environment Variables Clearly**: Ensure the `MONDAY_TOKEN` is correctly referenced and passed in curl or SDK commands without unnecessary speculation.
- **Provide Concrete Solutions**: Avoid suggesting structural changes or speculating about errors. Directly correct queries using the right fields, like `items_page`, and provide immediate solutions.

### Tag Columns in Monday.com API
- **Expected Schema**: The correct structure for tag columns involves using `tag_ids` (numeric IDs) rather than textual labels.
- **Common Pitfall**: Directly passing text labels (e.g., "Sci-Fi") will result in an error. Instead, retrieve or create these tags and use their corresponding IDs.
- **Steps for Correctly Updating Tag Columns**:
  1. **Create or Retrieve Tags**: Create tags or retrieve their IDs if they already exist.
  2. **Use Tag IDs**: Update the column by passing the correct `tag_ids` in the mutation.

## Available Tools
- `monday-sdk-js`
- `graphql`
- `curl`

## Envvars Provided
- `MONDAY_TOKEN` (for authorization bearer)

## Known Working Scripts
- `create_item_daredevil.js`
- `create_item.js`
