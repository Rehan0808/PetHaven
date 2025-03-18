// jest.setup.js
// This will suppress all console.error output during test runs.
jest.spyOn(console, 'error').mockImplementation(() => {});
