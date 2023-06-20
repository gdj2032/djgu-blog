module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    "react-app",
    "react-app/jest"
  ],
  plugins: [
    '@typescript-eslint',
    "react-hooks"
  ],
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 2019,
    sourceType: "module",
  },
  rules: {
    "semi": 0,
    "@typescript-eslint/semi": [0],
    "react/button-has-type": [0],
    "import/prefer-default-export": [0],
    "react/jsx-props-no-spreading": [0],
    "@typescript-eslint/comma-dangle": [0],
    "global-require": [0],
    "import/no-mutable-exports": [0],
    "prefer-promise-reject-errors": [0],
    "consistent-return": [0],
    "no-plusplus": [0],
    "react/static-property-placement": [0],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "no-param-reassign": [0],
    "jsx-a11y/alt-text": [0],
    "react/state-in-constructor": [0],
    "jsx-a11y/no-static-element-interactions": [0],
    "jsx-a11y/click-events-have-key-events": [0],
    "linebreak-style": [0],
    "jsx-a11y/anchor-is-valid": "off",
    "@typescript-eslint/no-unused-expressions": [0],
    "react/require-default-props": [0],
    "max-len": [0],
    "object-curly-newline": [0],
    "react-hooks/exhaustive-deps": [0]
  }
};
