module.exports = {
  extends: [
    "next/core-web-vitals",
    "plugin:import/recommended",
    "plugin:import/typescript",
  ],
  plugins: ["import"],
  rules: {
    "semi": ["warn", "always"],
    "import/order": [
      "error",
      {
        "groups": [
          "builtin", // Node "builtin" modules
          "external", // "external" modules (npm packages)
          "internal", // internal imports (custom libraries)
          ["sibling", "parent"], // sibling and parent imports
          "index", // index imports
          "object", // object imports
          "type" // types imports
        ],
        "pathGroups": [
          {
            "pattern": "@/components/**",
            "group": "internal",
            "position": "before"
          },
          {
            "pattern": "@/server/**",
            "group": "internal",
            "position": "after"
          }
        ],
        "pathGroupsExcludedImportTypes": ["builtin", "external"],
        "newlines-between": "always"
      }
    ]
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"]
      },
      typescript: {}
    }
  }
};
