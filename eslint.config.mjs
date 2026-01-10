import eslint from "@eslint/js";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
// eslint-disable-next-line import/no-unresolved
import tseslint from "typescript-eslint";
import promisePlugin from "eslint-plugin-promise";
import importPlugin from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfigPlugin from "eslint-config-prettier";
import jestPlugin from "eslint-plugin-jest";
import globals from "globals";

export default [
  eslint.configs.recommended,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat["jsx-runtime"],
  ...tseslint.configs.recommended,
  promisePlugin.configs["flat/recommended"],
  importPlugin.flatConfigs.recommended,
  jestPlugin.configs["flat/recommended"],
  {
    files: ["**/*.ts", "**/*.tsx"],
    ignores: ["**/node_modules/", "**/TWPData/"],
    languageOptions: {
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
      jest: {
        version: 29,
      },
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
        },
      },
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
      "import/extensions": ['error', 'ignorePackages'],
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
