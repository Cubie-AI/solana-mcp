module.exports = {
  preset: "ts-jest",
  collectCoverage: true,
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.ts"], // Only test files inside `tests/` folder
  verbose: true,
};
