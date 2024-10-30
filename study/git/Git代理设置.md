# Git代理设置

https://www.cnblogs.com/China-Dream/p/16476775.html

## 场景

国内访问github比较慢，需要设置代理，才能更稳定的`pull`和`push`代码。

## 代理设置

### 全局代理设置

```bash
git config --global http.proxy http://127.0.0.1:7897
git config --global https.proxy https://127.0.0.1:7897
```

### 只对GitHub进行代理

如果挂了全局代理，克隆coding之类的国内仓库会变慢，所以我建议使用如下命令，只对GitHub进行代理，对国内的仓库不影响。

```bash
git config --global http.https://github.com.proxy https://127.0.0.1:7897
git config --global https.https://github.com.proxy https://127.0.0.1:7897
```

如果在输入这条命令之前，已经输入全局代理的话，先取消全局代理。

注意：以上两点都是对`https协议`进行代理设置，也就是仅对`git clone https://www.github.com/xxxx/xxxx.git`这种命令有效。

对于`SSH协议`，也就是`git clone git@github.com:xxxxxx/xxxxxx.git`这种，依旧是无效的。

### socks5代理设置

> 讨论网络代理的不同类型。通常情况下，SS（Shadowsocks）是一种常见的代理工具，它使用Socks5协议来进行数据传输。当有人提到SS暴露的是Socks5时，意味着SS所使用的代理协议是Socks5协议。所以，下面附上的Socks5代理方法可能是指如何使用SS代理，并配置Socks5代理的相关信息。

之前说的是`http代理`，有人反映ss（代理工具）暴露的是`socks5`。下面附上socks5代理的方法：

1、首先查看自己`socks5`的端口号，假设为：`127.0.0.1:7897`

2、输入以下命令：

```bash
git config --global http.https://github.com.proxy socks5://127.0.0.1:7897
git config --global https.https://github.com.proxy socks5://127.0.0.1:7897
```

### 推荐一次性代理方式

```bash
export https_proxy=http://127.0.0.1:7897 http_proxy=http://127.0.0.1:7897 all_proxy=socks5://127.0.0.1:7897
```

## 取消代理

```bash
git config --global --unset http.proxy
git config --global --unset https.proxy
```

## 查看已有配置

```bash
git config -l
git config --global -l
```
