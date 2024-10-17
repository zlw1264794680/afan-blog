# electron

## 踩坑记录

### 安装依赖失败

![alt text](index.assets/image.png)

```bash
npm install phantomjs@2.1.1 --ignore-scripts
```

### win打包报错

![image-20241010153905957](index.assets/image-20241010153905957.png)

以管理员身份运行

![image-20241010153807752](index.assets/image-20241010153807752.png)

### 安装exe失败

![alt text](index.assets/image-1.png)

依赖安装失败，删除 `node_modules` 重新安装！！！

尽量使用 `npm` 安装，因为 `pnpm` 老是落安装部分依赖，导致这个问题。