module.exports = {
  // 共享配置：配置 TypeScript 推荐的校验规则
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],
  // 解析器：将 TypeScript 的 AST 转换成兼容 ESLint 的 AST
  parser: "@typescript-eslint/parser",
  parserOptions: {
    // 项目根目录的绝对路径
    tsconfigRootDir: __dirname,
    // tsconfig.json 的相对路径
    project: ["./tsconfig.json"],
  },
  // 插件：提供 TypeScript 校验规则的实现
  plugins: ["@typescript-eslint"],
  // 层叠配置：停止向上遍历 ESLint 配置文件
  root: true,
  //  覆盖规则（优先级最高）
  rules: {
    '@typescript-eslint/ban-ts-comment': 'error'
  }
};
