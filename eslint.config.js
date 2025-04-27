const nodePlugin = require("eslint-plugin-node");

module.exports = [
    {
        files: ["**/*.js"],
    },
    {
        languageOptions: {
            ecmaVersion: 12,
            sourceType: "commonjs",
            globals: {
                process: "readonly",
            },
        },
        plugins: {
            node: nodePlugin,
            prettier: "eslint-plugin-prettier",
        },
        rules: {
            "no-unused-vars": "warn",
            "no-mixed-spaces-and-tabs": "error",
            semi: ["error", "always"],
            quotes: ["error", "double"],
        },
    },
];