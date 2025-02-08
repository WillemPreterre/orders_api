module.exports = {
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest', 
    },
    testEnvironment: 'node',
    moduleFileExtensions: ['js', 'json', 'ts'], 
    rootDir: './',
    testMatch: ['**/*.spec.ts'], 
  };