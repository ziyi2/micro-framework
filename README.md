# Github Actions

ci 的流程和解释如下所示：

``` yml
# 当前的 yml（.yaml） 文件是一个 workflow，必须放置在项目的 .github/workflow 目录下

# name: 当前 workflow 的名称
name: ci

# on:  指定 workflow 触发的 event
#
#      event 有以下几种类型
#         - webhook
#         - scheduled
#         - manual
on:
  # push: 一个 webhook event，用于提交代码时触发 workflow，也可以是触发列表，例如 [push, pull_request]

  #        workflows 触发的 event 大部分是基于 webhook 配置，以下列举几个常见的 webhook:
  #           - delete:  删除一个 branch 或 tag 时触发
  #           - fork / watch:  某人 fork / watch 项目时触发（你问有什么用，发送邮件通知不香吗？）
  #           - pull_request:  提交 PR 时触发
  #           - page_build:  提交 Github Pages-enabled 分支代码时触发
  #           - push:  提交代码到特定分支时触发
  #           - registry_package:  发布或跟新 package 时触发

  #           更多 webhook 可查看 https://docs.github.com/zh/actions/using-workflows/events-that-trigger-workflows

  #           从这里可以看出 Git Actions 的一大特点就是 Gihub 官方提供的一系列 webhook
  push:
    # branches: 指定 push 触发的特定分支，这里你可以通过列表的形式指定多个分支
    branches:
      - demo/**
      - feat/**
      - fix/**
    #
    # branches 的指定可以是通配符类型，例如以下配置可以匹配 refs/heads/releases/10
    # - 'releases/**'
    #
    # branches 也可以使用反向匹配，例如以下不会匹配 refs/heads/releases/10
    # - '!releases/**'
    #
    # branches-ignore:  用于指定当前 webhook 不触发的分支
    #
    # tags:  用于指定当前 webhook 触发的 tag
    #
    # tags:
    #   - v1             # Push events to v1 tag
    #   - v1.*           # Push events to v1.0, v1.1, and v1.9 tags
    #
    # tags-ignore:  类似于 branches-ignore
    #
    # paths、paths-ignore...
    #
    # 更多关于特定过滤模式可查看 https://docs.github.com/zh/actions/using-workflows/workflow-syntax-for-github-actions#filter-pattern-cheat-sheet
    #
    # 其他的 webhook 控制项还包括 types（不是所有的 webhook 都有 types），例如已 issues 为例，可以在 issues 被 open、reopened、closed 等情况下触发 workflow
    # 更多 webhook 的 types 可查看 https: //docs.github.com/en/actions/reference/events-that-trigger-workflows#webhook-events
    #
    # on:
    #   issues:
    #     types:  [opened, edited, closed]

  # 除此之外如果对于每个分支有不同的 webhook 触发，则可以通过以下形式进行多个 webhook 配置
  #
  # push:
  #   branches:
  #     - master
  # pull_request:
  #   branches:
  #     - dev
  #
  # 除了以上所说的 webhook event，还有 scheduled event 和 manual event
  # scheduled event:  用于定时构建，例如最小的时间间隔是 5 min 构建一次
  # 具体可查看 https: //docs.github.com/en/actions/reference/events-that-trigger-workflows#scheduled-events

# env: 指定所有 job 和 step 通用的环境变量（在 job 中或者 steps 中也可以通过 env 配置自己的环境变量）
#
# defaults: 当前所有 job 的默认配置

# jobs: 一个 workflow 由一个或多个 job 组成
jobs:
  # job id: 是 job 的唯一标识，可以通过 _ 进行连接，例如:  my_first_job，例如这里的 test 就是一个 job id
  test:
    # name: 在 Github 中显示的 job 名称
    name: CI 执行流程
    #
    # needs: 用于继发执行 job，例如当前 job build 必须在 job1 和 job2 都执行成功的基础上执行

    # jobs:
    #   job1:
    #   job2:
    #     needs: job1
    #   job3:
    #     needs: [job1, job2]
    #
    # runs-on: job 运行的环境配置，包括:
    #   - windows-latest
    #   - windows-2019
    #   - ubuntu-20.04
    #   - ubuntu-latest
    #   - ubuntu-18.04
    #   - ubuntu-16.04
    #   - macos-latest
    #   - macos-10.15
    #   - self-hosted（本地机器，具体可查看 https://docs.github.com/zh/actions/hosting-your-own-runners/managing-self-hosted-runners/using-self-hosted-runners-in-a-workflow）

    runs-on: ubuntu-latest

    #
    # outputs:  用于输出信息
    #
    # env:  用于设置当前 job 的环境变量
    #
    # defaults:  当前所有 step 的默认配置

    # if: 满足条件执行当前 job

    # steps:  一个 job 由多个 step 组成，step 可以
    #   - 执行一系列 tasks
    #   - 执行命令
    #   - 执行 action
    #   - 执行公共的 repository
    #   - 在 Docker registry 中的 action
    steps:
      #
      # id: 类似于 job id
      #
      # if:  类似于 job if
      #
      # name:  当前 step 的名字
      - name: 下载 Github 仓库
        #
        # uses: 用于执行 action
        #
        #       action: 可以重复使用的单元代码
        #          - 为了 workflow 的安全和稳定建议指定 action 的发布版本或 commit SHA
        #          - 使用指定 action 的 major 版本，这样可以允许你接收 fixs 以及 安全补丁并同时保持兼容性
        #          - 尽量不建议使用 master 版本，因为 master 很有可能会被发布新的 major 版本从而破坏了 action 的兼容性
        #          - action 可能是 JavaScript 文件或 Docker 容器，如果是 Docker 容器，那么 runs-on 必须指定 Linux 环境
        #
        #         指定固定 commit SHA
        #         uses:  actions/setup-node@74bc508
        #         指定一个 major 发布版本
        #         uses:  actions/setup-node@v1
        #         指定一个 minor 发布版本
        #         uses:  actions/setup-node@v1.2
        #         指定一个分支
        #         uses:  actions/setup-node@master
        #         指定一个 Github 仓库子目录的特定分支、ref 或 SHA
        #         uses:  actions/aws/ec2@master
        #         指定当前仓库所在 workflows 的目录地址
        #         uses:  ./.github/actions/my-action
        #         指定在 Dock Hub 发布的 Docker 镜像地址
        #         uses:  docker://alpine: 3.8
        #         A Docker image in a public registry
        #         uses:  docker:/gcr.io/cloud-builders/gradle

        # checkout action 主要用于向 github 仓库拉取源代码（需要注意 workflow 是运行在服务器上，因此需要向远程的 github 拉取仓库源代码）
        # 它的功能包括但不限于
        #   - Fetch all history for all tags and branches
        #   - Checkout a different branch
        #   - Checkout HEAD^
        #   - Checkout multiple repos (side by side)
        #   - Checkout multiple repos (nested)
        #   - Checkout multiple repos (private)
        #   - Checkout pull request HEAD commit instead of merge commit
        #   - Checkout pull request on closed event
        #   - Push a commit using the built-in token

        # checkout action: https: //github.com/actions/checkout
        uses: actions/checkout@v4
        # with: action 提供的输入参数
        # with:
        #   指定 checkout 的分支、tag 或 SHA
        #   如果默认不指定，则指向触发工作流所在分支的 SHA
        #   When checking out the repository that triggered a workflow, this defaults to the reference or SHA for that event.
        #   更多 checkout action 的配置可查看 https://github.com/actions/checkout#usage
        #   ref: feat/ci

      #
      # run: 使用当前的操作系统的默认的 non-login shell 执行命令行程序
      # 运行单个脚本
      # run: npm install
      # 运行多个脚本
      # run: |
      #   npm ci
      #   npm run build
      #
      # working-directory: 用于指定当前脚本运行的目录
      # working-directory: ./temp
      #
      # shell: 可以指定 shell 类型进行执行，例如 bash、pwsh、python、sh、cmd、powershell
      # shell: bash
      #
      # env: 除了可以设置 workflow 以及 job 的 env，也可以设置 step 的 env（可以理解为作用域不同，局部作用域的优先级更高）
      #
      # comtinue-on-error: 默认当前 step 失败则会阻止当前 job 继续执行，设置 true 时当前 step 失败则可以跳过当前 job 的执行

    #   - name: 缓存 node_modules 依赖
    #     # cache action: https://github.com/actions/cache
    #     # cache 在这里主要用于缓存 npm，提升构建速率
    #     uses: actions/cache@v3
    #     # npm 缓存的路径可查看 https://docs.npmjs.com/cli/cache#cache
    #     # 由于这里 runs-on 是 ubuntu-latest，因此配置 ~/.npm
    #     with:
    #       # 指定缓存和还原的路径
    #       path: ~/.npm
    #       # key 中定义缓存标志，runner.os 指当前环境的系统。
    #       # 这里使用 package-lock.json 的内容生成 Hash 值作为缓存的 key 值
    #       # 一旦 package-lock.json 发生变化，则会导致 Hash 值变化，从而变更缓存内容
    #       key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    #       # 备用 key，如果 key 没有命中缓存，则可以使用 restore-keys 进行备用缓存匹配
    #       restore-keys: |
    #         ${{ runner.os }}-node-

      # github-script action: https://github.com/actions/github-script
      # 在 workflow 中使用 Script 语法调用 Github API 或引用 workflow context
      #   - uses: actions/github-script@v6
      #     id: my-script
      #     with:
      #         result-encoding: string
      #         retries: 3
      #         script: |
      #         github.rest.issues.get({
      #             issue_number: context.issue.number,
      #             owner: context.repo.owner,
      #             repo: context.repo.repo,
      #         })

      # setup-node action: https://github.com/actions/setup-node
      # 配置 Node 执行环境（当前构建的服务器默认没有 Node 环境，可以通过 Action 安装 Node）
      # 需要注意安装 Node 的同时会捆绑安装 npm，如果想了解为什么会捆绑，可以 Google 一下有趣的故事哦
      # 因此使用了该 action 后就可以使用 npm 的脚本在服务器进行执行啦
      - name: 下载和安装 Node 环境
        uses: actions/setup-node@v3
        with:
          # 在 package.json 的 engines 中我们配置了  "node": ">=16.18.1"
          # 因此这里对安装的 Node 进行版本限定
          node-version: "16.x"

      - name: 安装依赖
        # 需要注意 npm ci 和 npm i 的区别
        run: npm ci

      - name: 代码校验
        run: npm run lint

      - name: 单元测试
        run: npm test

      - name: 文档构建
        run: npm run docs:build

      - name: 代码构建
        run: npm run build

    #
    # timeout-minutes: 一个 job 执行的最大时间，默认是 6h，如果超过时间则取消执行
    #
    # strategy.matrix: 例如指定当前 job 的 node 版本列表、操作系统类型列表等
    # strategy.fail-fast
    # strategy.max-parallel
    # continue-on-error:  一旦当前 job 执行失败，那么 workflow 停止执行。设置为 true 可以跳过当前 job 执行
    # container: Docker 容器配置，包括 image、env、ports、volumes、options 等配置
    #
    # services: 使用 Docker 容器 Action 或者 服务 Action 必须使用 Linux 环境运行

```
