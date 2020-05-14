module.exports = {
    extends: ['airbnb-typescript/base'],
    parserOptions: {
      project: './tsconfig.json',
    },
    rules: {
        'no-underscore-dangle': 'off',
        'import/prefer-default-export': 'off',
        'import/no-default-export': 'error',
        'class-methods-use-this': 'off'
    },
    overrides: [{
        files: ['*.test.ts'],
        parserOptions: {
            createDefaultProgram: true,
        }
    }]
};