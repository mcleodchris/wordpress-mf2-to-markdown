import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    languageOptions: { 
      globals: {
        ...globals.node,
        ...globals.mocha
      }
    },
    rules: {
      "no-var": "error",
      "prefer-const": "error",
      "prefer-destructuring": "error",
      "prefer-template": "error",
      "prefer-spread": "error",
      "one-var": ["error", "never"],
    }
  },
  pluginJs.configs.recommended,
];