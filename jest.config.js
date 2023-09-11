/** @type {import('ts-jest').JestConfigWithTsJest} */
// 更多关于 Jest 配置查看：https://jestjs.io/zh-Hans/docs/configuration
module.exports = {
  // https://jestjs.io/zh-Hans/docs/configuration#preset-string
  preset: "ts-jest",
  // 测试的运行环境，可以是 node 或者 jsdom
  // https://jestjs.io/zh-Hans/docs/configuration#testenvironment-string
  testEnvironment: "node",
  // Jest 测试存在测试失败时立即停止测试（bail 也可以是数字，在 N 个测试案例失败后停止运行）
  // 类似于 ESLint 中的 max-warnings，设置为 true 则表明一旦发现单元测试用例错误则停止运行其余测试用例，从而可以防止运行用例过多时需要一直等待用例全部运行完毕的情况
  // https://jestjs.io/zh-Hans/docs/configuration#bail-number--boolean
  // bail: true,
  // 将测试代码和源代码分离，在 test 目录下进行单元测试
  // 需要注意有些项目会使用 Jest 默认的匹配规则建立测试目录，例如在 src 中使用 __tests__ 目录进行单元测试，并且文件需要命名成 xxx.spec.js 或者 xxx.test.js
  // https://jestjs.io/zh-Hans/docs/configuration#testregex-string--arraystring
  testRegex: ["/test/"],
  // 在当前根目录下生成 coverage 代码的测试覆盖率报告，该报告还可以上传 coveralls 进行 Github 项目的 Badges 显示
  // https://jestjs.io/zh-Hans/docs/configuration#collectcoverage-boolean
  collectCoverage: true,
  // 输出覆盖信息文件的目录
  // https://jestjs.io/zh-Hans/docs/configuration#coveragedirectory-string
  // coverageDirectory: "./coverage/",
  // 如果测试覆盖率未达到 90%（可以根据实际业务情况进行数值调整），则测试失败
  // 这里可用于 CI / CD 检测
  // https://jestjs.io/zh-Hans/docs/configuration#coveragethreshold-object
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },

  // 路径映射配置
  // https://kulshekhar.github.io/ts-jest/docs/getting-started/paths-mapping
  // 需要配合 TypeScript 路径映射，和 tsconfig.json 中的 compilerOptions.paths 需要一一映射
  // https://www.tslang.cn/docs/handbook/module-resolution.html
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
