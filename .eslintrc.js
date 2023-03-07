module.exports = {
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  // 将 TypeScript 的 AST 转换成兼容 ESLint 的 AST
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  root: true,
};
