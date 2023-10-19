# 如何使用该仓库

## :tada: 克隆项目

克隆项目后根据课程内容切换到相应的学习分支

``` bash
git clone https://github.com/ziyi2/micro-framework.git
```

## :heavy_plus_sign: 安装依赖

``` bash
npm install
```

## :rotating_light: 运行 ESLint

``` bash
npm run lint
```

## :rotating_light: 运行 Prettier

``` bash
npm run prettier
```

## :white_check_mark: 执行单元测试

会在 `coverage` 目录下生成测试覆盖率报告

``` bash
npm test
```

## 📝 执行 cz

使用 Angular 规范进行代码提交

``` bash
npm run cz
```

## :loud_sound: 生成日志

会在项目 `docs` 目录下生成 `CHANGELOG.md` 日志文件

``` bash
npm run changelog
```

## :package: 构建库包

会在`build`目录下生成平级目录结构的[API](/algorithms/api/_comparator)使用包

``` bash
npm run build
```

## :package: 发布版本

``` bash
npm run release
```

## :construction: 预览文档

启动静态网站

``` bash
npm run docs:dev
```

## :bookmark: 生成文档静态资源

会在 `.vuepress/dist` 目录下生成静态资源包

``` bash
npm run docs:build
```

## :rocket: 部署

生成静态HTML文件并更新到远程的`gh-pages`分支上

``` bash
npm run deploy
```
