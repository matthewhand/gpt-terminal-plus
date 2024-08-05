#!/bin/bash

# Step 1: Ensure @typescript-eslint/parser is in package.json
if ! grep -q '"@typescript-eslint/parser"' package.json; then
  npm install --save-dev @typescript-eslint/parser
fi

# Step 2: Reinstall dependencies
npm install

# Step 3: Run ESLint
npx eslint src/

# Step 4: Commit changes
git add .
git commit -m "Fixed ESLint configuration and dependencies"
