module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:promise/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
    'plugin:jest/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint', 'react-hooks', 'promise', 'import', 'prettier', 'jest'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'off',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'promise/always-return': 'off',
    'no-console': 'off',
    "@typescript-eslint/no-explicit-any": "warn",
    "promise/param-names": "off",
    "prettier/prettier": [
      "warn",
      {
        "semi": true,
        "trailingComma": "all",
        "singleQuote": true,
        "tabWidth": 2,
        "printWidth": 140
      }
    ]
  },
  settings: {
    react: {
      version: 'detect',
    },
    jest: {
      version: 29,
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
};
