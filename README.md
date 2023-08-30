# changelog

``` bash
# 安装依赖
npm i
# 修改代码后执行 cz
npm run cz
```

如果想更改 types，例如想进行汉化，通过阅读源码可以进行如下配置：

- 删除 `package.json` 中的 config.commitizen 配置信息
- 新增 `.cz.json` 或者 `.czrc` 文件，修改 types 信息

> 温馨提示： 通过读取源码可以发现 commitizen 优先读取 `package.json` 中的配置，因此为了让自定义配置可以生效，需要先删除 `package.json` 中相关的配置信息。

``` json
{
    "path": "./node_modules/cz-conventional-changelog",
    "types": {
        "feat": {
            "description": "一个新功能",
            "title": "功能"
        },
        "fix": {
            "description": "A bug fix",
            "title": "Bug Fixes"
        },
        "docs": {
            "description": "Documentation only changes",
            "title": "Documentation"
        },
        "style": {
            "description": "Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)",
            "title": "Styles"
        },
        "refactor": {
            "description": "A code change that neither fixes a bug nor adds a feature",
            "title": "Code Refactoring"
        },
        "perf": {
            "description": "A code change that improves performance",
            "title": "Performance Improvements"
        },
        "test": {
            "description": "Adding missing tests or correcting existing tests",
            "title": "Tests"
        },
        "build": {
            "description": "Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)",
            "title": "Builds"
        },
        "ci": {
            "description": "Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)",
            "title": "Continuous Integrations"
        },
        "chore": {
            "description": "Other changes that don't modify src or test files",
            "title": "Chores"
        },
        "revert": {
            "description": "Reverts a previous commit",
            "title": "Reverts"
        }
    }
}
```

执行 `npm run cz` 进行测试，看下 feat 的描述是否变更为中文。