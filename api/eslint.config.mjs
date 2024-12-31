import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { ignores: ["dist"] },
  { files: ["**/*.{js,ts}"] },
  { languageOptions: { 
    ecmaVersion: 2020, 
    globals: globals.browser 
  } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
