/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    // preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ['**/?(*.)+(test).[jt]s?(x)'],
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"]
    // transform: {
    //   "^.+\\.tsx?$": "ts-jest"
    // },
    // extensionsToTreatAsEsm: [".ts", ".tsx"],
    // globals: {
    //   "ts-jest": {
    //     useESM: true
    //   }
    // },
  //   moduleNameMapper: {
  //     "\\.(css|less|scss|sass)$": "identity-obj-proxy"
  //   }
   };
  