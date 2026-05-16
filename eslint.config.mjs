import eslint from "@eslint/js";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";
import promisePlugin from "eslint-plugin-promise";
import { importX } from 'eslint-plugin-import-x'
// eslint-disable-next-line import-x/default
import tsParser from '@typescript-eslint/parser'
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfigPlugin from "eslint-config-prettier";
import globals from "globals";

export default [
  eslint.configs.recommended,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat["jsx-runtime"],
  ...tseslint.configs.recommended,
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  promisePlugin.configs["flat/recommended"],
  {
    files: ["**/*.ts", "**/*.tsx"],
    ignores: ["**/node_modules/", "**/TWPData/"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      "react-hooks": reactHooksPlugin,
      prettier: prettierPlugin
    },
    settings: {
      react: {
        version: "detect",
      },
      // "import/resolver": {
      //   typescript: {
      //     alwaysTryTypes: true,
      //   },
      // },
    },
    rules: {
      ...reactHooksPlugin.configs.recommended.rules,
      ...prettierPlugin.configs.recommended.rules,
      ...prettierConfigPlugin.rules,
      "@typescript-eslint/no-unused-vars": "warn",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "off",
      "react-hooks/immutability": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "promise/always-return": "off",
      "no-console": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "promise/param-names": "off",
      "import-x/no-named-as-default": "off",
      "import-x/extensions": ["error", "ignorePackages", { "fix": true }],
      "import-x/order": [
        "warn",
        {
          "groups": ["builtin", "external", "parent", "sibling", "index", "type"]
        }
      ],
      "prettier/prettier": [
        "warn",
        {
          semi: true,
          trailingComma: "all",
          singleQuote: true,
          tabWidth: 2,
          printWidth: 120,
        },
      ],
    },
  }
];
