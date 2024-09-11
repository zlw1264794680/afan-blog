# VitePress

> 由 Vite 和 Vue 驱动的静态站点生成器
> 将 Markdown 变成优雅的文档，只需几分钟

[Markdown 扩展](https://vitepress.dev/zh/guide/markdown#table-of-contents)

[默认主题配置](https://vitepress.dev/zh/reference/default-theme-config)

## 快速搭建

新建目录（项目名）

```bash

pnpm add -D vitepress

pnpm vitepress init

```

```txt

┌  Welcome to VitePress!
│
◇  Where should VitePress initialize the config?
│  ./docs
│
◇  Site title:
│  My Awesome Project
│
◇  Site description:
│  A VitePress Site
│
◆  Theme:
│  ○ Default Theme (Out of the box, good-looking docs)
│  ● Default Theme + Customization
│  ○ Custom Theme
└


```

```bash

pnpm run docs:dev

````

## 图片位置

根目录新建`public`文件夹，图片丢里面，访问使用`/xxx.svg`。

## GitHub Pages 建站

Github Pages 建站的参考文章：

[VitePress官网 - 构建 Github Action 的 deploy.yml](https://vitepress.dev/zh/guide/deploy#github-pages)

[VitePress + GitHub Pages 文章1](https://jspao.com/guide/vitepress.html)

[VitePress + GitHub Pages 文章2](https://www.cnblogs.com/zhishu/p/17804548.html)

### 修改前的 deploy.yml

```yaml
# 构建 VitePress 站点并将其部署到 GitHub Pages 的示例工作流程
#
name: Deploy VitePress site to Pages

on:
  # 在针对 `main` 分支的推送上运行。如果你
  # 使用 `master` 分支作为默认分支，请将其更改为 `master`
  push:
    branches: [main]

  # 允许你从 Actions 选项卡手动运行此工作流程
  workflow_dispatch:

# 设置 GITHUB_TOKEN 的权限，以允许部署到 GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# 只允许同时进行一次部署，跳过正在运行和最新队列之间的运行队列
# 但是，不要取消正在进行的运行，因为我们希望允许这些生产部署完成
concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  # 构建工作
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0 # 如果未启用 lastUpdated，则不需要
      # - uses: pnpm/action-setup@v3 # 如果使用 pnpm，请取消注释
      # - uses: oven-sh/setup-bun@v1 # 如果使用 Bun，请取消注释
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm # 或 pnpm / yarn
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Install dependencies
        run: npm ci # 或 pnpm install / yarn install / bun install
      - name: Build with VitePress
        run: npm run docs:build # 或 pnpm docs:build / yarn docs:build / bun run docs:build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: docs/.vitepress/dist

  # 部署工作
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    name: Deploy
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 踩坑总结

- 本地安装依赖的包管理器，如果使用的是`pnpm`，这里要修改配置成`pnpm`，并且绑定对应的版本
- 同理，`Node`版本也需要一一对应，避免依赖错误
- 新版本的`VitePress`执行打包命令后，`dist`目录的完整路径是`.vitepress/dist`

### 修改后的 deploy.yml

```yam
# 构建 VitePress 站点并将其部署到 GitHub Pages 的示例工作流程
#
name: Deploy VitePress site to Pages

on:
  # 在针对 `main` 分支的推送上运行。如果你
  # 使用 `master` 分支作为默认分支，请将其更改为 `master`
  push:
    branches: [main]

  # 允许你从 Actions 选项卡手动运行此工作流程
  workflow_dispatch:

# 设置 GITHUB_TOKEN 的权限，以允许部署到 GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# 只允许同时进行一次部署，跳过正在运行和最新队列之间的运行队列
# 但是，不要取消正在进行的运行，因为我们希望允许这些生产部署完成
concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  # 构建工作
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0 # 如果未启用 lastUpdated，则不需要
      - uses: pnpm/action-setup@v3 # 如果使用 pnpm，请取消注释
        with: # **** 这里因为使用了pnpm所以要制定一个版本，避免报错
          version: 8.15.4 # **** 这里因为使用了pnpm所以要制定一个版本，避免报错
      # - uses: oven-sh/setup-bun@v1 # 如果使用 Bun，请取消注释
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20.16.0
          cache: pnpm # 或 pnpm / yarn
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Install dependencies
        run: pnpm install # 或 pnpm install / yarn install / bun install
      - name: Build with VitePress
        run: pnpm docs:build # 或 pnpm docs:build / yarn docs:build / bun run docs:build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: .vitepress/dist

  # 部署工作
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    name: Deploy
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 排查技巧

可以在 github 项目仓库界面，通过查看`Actions`来进行错误排查。

![image-20240911154321982](/docs/image-20240911154321982.png)

## 百度统计

[百度统计代码嵌入](https://tongji.baidu.com/main/setting/10000533894/home/site/index)

操作步骤：

- 设置需要统计的网站域名
- 切换到使用设置，代码管理下，复制代码
- 填入 VitePress 项目，发布后，在代码管理下，检测网站是否嵌入统计代码

### 站点设置

[VitePress 设置网站图标、script](https://vitepress.dev/zh/reference/site-config#example-adding-a-favicon)

### 统计概览

![image-1726067888997](/docs/image-1726067888997.png)