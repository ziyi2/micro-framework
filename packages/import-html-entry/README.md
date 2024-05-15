# import-html-entry

固定版本 1.15.2

## Lerna 改造

修改 `package.json` 的 `main` 字段为 `./src/index.js`，同时去除 `module` 字段，通过 `lenra bootstrap` 启动后，qiankun 库包中的 `import-html-entry` 会从 `packages/import-html-entry` 中进行加载，并且读取的是 `src` 目录下的源码，从而可以直接调试源码。
