module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "node": true  // Add this line to specify Node.js environment
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
        "no-unused-vars": "off",
        "no-var": "off",
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/ban-types": "off",
        "no-useless-escape": "off",
        "no-console": "off",
        "no-case-declarations": "off",
        "no-undef": "off"  // Add this line to turn off 'no-undef' rule
    }
};

