module.exports = {
  // 注意和 package.json 中的 {  "lint": "eslint --ext .ts src test" } 保持一致
  "src/**/*.ts": "eslint",
  "test/**/*.ts": "eslint",
  // 新增暂存区代码的单元测试
  "src/**/*.ts": "jest --bail --findRelatedTests",
};
