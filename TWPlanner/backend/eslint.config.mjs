import myConfig from '../../eslint.config.mjs';

export default [
  ...myConfig,
  {
    ignores: ["dist/", "public/"],
    rules: {
      "import/extensions": "off",
    }
  }
]
