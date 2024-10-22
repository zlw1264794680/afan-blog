# npm、yarn、pnpm清除缓存

https://blog.csdn.net/sinat_36728518/article/details/133083094

## 背景

前端工程化创建项目会经常使用各种安装包管理工具，安装各种前端依赖包。例如，`npm`、`yarn`、`pnpm`等。时间一长，各种安装包管理工具的在安装依赖时，留下的缓存文件就会变得很大，以至于影响系统的运行，因此必要时清除缓存就是一个不错的选择。


## npm

### 查看缓存路径

要查看`npm`的缓存路径，您可以执行以下命令：

```bash
npm config get cache
```

### 清除缓存

要清除`npm`的缓存，可以执行以下命令：

```bash
npm cache clean --force
```

> 注：这将清除npm缓存目录中的所有文件。
> 需要注意的是，这可能会导致重新下载项目的依赖，因此在执行此命令之前，请确保您已备份了重要的依赖信息。

## yarn

### 查看缓存列表

要查看`yarn`的缓存列表，可以执行以下命令：

```bash
yarn cache list
```

### 查看缓存路径

要查看`yarn`的缓存路径，可以执行以下命令：

```bash
yarn cache dir
```

### 清除缓存

要清除yarn的缓存，可以执行以下命令：

```bash
yarn cache clean
```

> 注：这将清除yarn缓存目录中的所有文件。和清除npm缓存一样，在执行此命令之前，请确保您已备份了重要的依赖信息。[Yarn缓存文档](https://classic.yarnpkg.com/en/docs/cli/cache)


## pnpm

### 缓存路径

要查看`pnpm`的缓存路径，可以执行以下命令：

```bash
pnpm store path
```

> 您可以手动删除该路径下的文件，以清除pnpm的缓存。 
> 注: 请注意，删除缓存文件后，pnpm可能会在未来的安装过程中速度变慢，因为它需要重新下载被删除的文件。

### 清除缓存

要清除`pnpm`的缓存，可以执行以下命令：

```bash
pnpm store prune
```

> 注：从存储中删除未引用的（无关的、孤立的）包。修剪商店无害，但可能降低未来安装的速度。
> 有关未引用包的更多信息以及原因，请访问 [Pnpm store文档](https://www.chengzz.com/?golink=aHR0cHM6Ly9wbnBtLmlvL2NsaS9zdG9yZQ==)





