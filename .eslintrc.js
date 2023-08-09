module.exports = {
  extends: require.resolve('@umijs/lint/dist/config/eslint'),
};
// "lint-staged": {
//   "*.{md,json}": [
//     "prettier --write --no-error-on-unmatched-pattern"
//   ],
//   "*.{css,less}": [
//     "stylelint --fix",
//     "prettier --write"
//   ],
//   "*.{js,jsx}": [
//     "eslint --fix",
//     "prettier --write"
//   ],
//   "*.{ts,tsx}": [
//     "eslint --fix",
//     "prettier --parser=typescript --write"
//   ]
// },