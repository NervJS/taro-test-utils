module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["import",],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  },
  
  rules: {
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-this-alias': 0,
    'no-constant-condition': 0,
    'no-inner-declarations': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/no-namespace': 0,
    '@typescript-eslint/no-empty-function': 0,
    '@typescript-eslint/ban-ts-comment': 0,
    'prefer-rest-params': 0
  }
}
