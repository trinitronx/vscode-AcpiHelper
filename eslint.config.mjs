import stylistic from '@stylistic/eslint-plugin';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from "@typescript-eslint/parser";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([globalIgnores(["**/out", "**/dist", "**/*.d.ts"]), {
    plugins: {
        '@stylistic': stylistic,
        '@typescript-eslint': tseslint
    },

    languageOptions: {
        parser: tsParser,
        ecmaVersion: 6,
        sourceType: "module",
    },

    rules: {
        "@typescript-eslint/naming-convention": "warn",
        "@stylistic/semi": "error",
        '@stylistic/indent': ["warn", "tab"],
        curly: "warn",
        eqeqeq: "warn",
        "no-throw-literal": "warn",
    },
}]);
