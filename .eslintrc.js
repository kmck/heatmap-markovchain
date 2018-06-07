module.exports = {
  extends: [
    'airbnb-base'
  ],
  parser: 'babel-eslint',
  env: {
    es6: true
  },
  rules: {
    'import/extensions': ['error', 'always', {
      js: 'never',
      mjs: 'never',
    }],
  },
};
