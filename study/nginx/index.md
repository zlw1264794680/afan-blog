# nginx

## 踩坑总结

### 网络请求返回 `nginx 413 Request Entity Too Large`

#### 分析原因

`nginx` 默认是 `1M`，需要增大的话，需要修改配置文件。

### 解决办法

- 打开 `nginx` 配置文件 `nginx.conf`, 路径一般是：`/etc/nginx/nginx.conf`。

- 在 `http{}` 段中加入 `client_max_body_size 20m`; （`20m`为允许最大上传的大小）。

- 保存后重启 `nginx`，问题解决。