# Nest.js

`Nest` 是 `Node` 最流行的企业级开发框架，提供了 `IOC`、`AOP`、`微服务`等架构特性。

`Nest` 是对标 `Java` 的 `Spring` 框架的后端框架。

## 文档

<https://nest.nodejs.cn/>

## 项目学习

<https://github.com/buqiyuan/nest-admin/blob/main/src/modules/system/role/role.entity.ts>

## 基础概念

### IOC反转控制 - 依赖注入

`Nest` 实现了一套依赖注入机制，叫做 `IoC`（Inverse of Control 反转控制）。

简单说就是你只需要声明依赖了啥就行，不需要手动去 new 依赖，Nest 的 IoC 容器会自动给你创建并注入依赖。

**创建项目**

```bash
npm i -g @nestjs/cli
nest new project-name
cd project-name
```

**cats.service.ts**

`@Injectable()` 装饰器用来标记一个类可以作为依赖注入系统的一部分。

```bash
nest generate service cats
```

```ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class CatsService {
  private readonly cats = [
    { id: 1, name: 'Milo', age: 3 },
    { id: 2, name: 'Otis', age: 5 },
  ];

  findAll(): any[] {
    return this.cats;
  }
}
```

**cats.controller.ts**

```bash
nest generate controller cats
```

```ts
import { Controller, Get } from '@nestjs/common';
import { CatsService } from './cats.service';
  
@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  findAll() {
    return this.catsService.findAll();
  }
}
```

**app.module.ts**

通过 `@Module` 声明模块，它包含 `controllers` 和 `providers`。

- **imports：** 用于导入其他模块，这些模块可能提供了当前模块需要的服务或控制器。
- **controllers：** 注册模块中的控制器，这些控制器将处理 HTTP 请求。
- **providers：** 注册模块中的服务和其他可注入的类。这些服务可以被模块中的其他组件通过依赖注入来使用。

```ts
import { Module } from '@nestjs/common';
import { CatsController } from './cats/cats.controller';
import { CatsService } from './cats/cats.service';

@Module({
  imports: [], // 导入其他模块
  controllers: [CatsController], // 注册控制器
  providers: [CatsService], // 注册服务
})
export class AppModule {}
```

**动态提供者**

除了直接注册服务类，你还可以使用动态提供者来注册更复杂的服务。动态提供者允许你在运行时动态地创建和配置服务。

```ts
import { Module, Provider } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

const catsServiceProvider: Provider = {
  provide: 'CATS_SERVICE',
  useClass: CatsService,
};

@Module({
  imports: [],
  controllers: [CatsController],
  providers: [catsServiceProvider],
})
export class AppModule {}
```

在这个例子中，我们使用了一个配置对象 catsServiceProvider 来注册 CatsService，并指定了一个提供者令牌 'CATS_SERVICE'。这样，你可以在其他地方通过这个令牌来注入服务：

```ts
import { Inject, Controller, Get } from '@nestjs/common';
import { CatsService } from './cats.service';

@Controller('cats')
export class CatsController {
  constructor(@Inject('CATS_SERVICE') private readonly catsService: CatsService) {}

  @Get()
  findAll() {
    return this.catsService.findAll();
  }
}
```

### AOP面向切面编程

![alt text](./index.assets/image-13.png)

这样的横向扩展点就叫做切面，这种透明的加入一些切面逻辑的编程方式就叫做 `AOP` （面向切面编程）。

`AOP` 的好处是可以把一些通用逻辑分离到切面中，保持业务逻辑的纯粹性，这样切面逻辑可以复用，还可以动态的增删。

`Nest` 实现 `AOP` 的方式更多，一共有五种，包括 `Middleware`、`Guard`、`Pipe`、`Interceptor`、`ExceptionFilter`。

![alt text](./index.assets/image-15.png)

### 全局中间件

```ts
// main.ts
app.use(function(req: Request, res: Response, next: NextFunction) {
    console.log('before', req.url);
    next();
    console.log('after');
})
```

![alt text](./index.assets/image-14.png)

`handler`：控制器里处理路由的方法。

## CLI 命令

```bash
# --no-spec 不生成（单元）测试文件
# --flat 是平铺，不生成目录。

# 增删改查生成器
nest g resource [dir]/[name] --no-spec

# 路由器
nest g controller [dir]/[name] --no-spec
```

## 操作redis

### 安装redis

<https://www.npmjs.com/package/redis>

```bash
pnpm add redis
```

### 定义RedisService

`src/shared/redis.service.ts`文件

```ts
import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;

  async get(key: string) {
    return await this.redisClient.get(key);
  }

  async set(key: string, value: string | number, ttl?: number) {
    await this.redisClient.set(key, value);

    if (ttl) {
      await this.redisClient.expire(key, ttl);
    }
  }

  async del(key: string) {
    await this.redisClient.del(key);
    return true;
  }

  async hashGet(key: string) {
    return await this.redisClient.hGetAll(key);
  }

  async hashSet(key: string, obj: Record<string, any>, ttl?: number) {
    for (const name in obj) {
      await this.redisClient.hSet(key, name, obj[name]);
    }

    if (ttl) {
      await this.redisClient.expire(key, ttl);
    }
  }
}

```

### 定义env

```bash
# Redis ：redis[s]://[[username][:password]@][host][:port][/db-number]
REDIS_URL=redis://default:123456@localhost:6379
```

### 依赖注入

```ts
import { Global, Module } from '@nestjs/common';
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor';
import { ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';
import { createClient } from 'redis';

@Global()
@Module({
  providers: [
    RedisService,
    {
      inject: [ConfigService],
      provide: 'REDIS_CLIENT',
      async useFactory(configService: ConfigService) {
        const client = createClient({
          url: configService.get('REDIS_URL'),
        });
        await client.connect();
        return client;
      },
    },
  ],
  exports: [RedisService],
})
export class SharedModule {}
```

装饰器说明：

- `@Global` ： 全局模块，不需要在其他模块下注入，可以直接使用。

服务说明：

- `ConfigService` ： 用于管理应用程序配置的服务，可以使得`process.env.xxx`拿到数据，也可以使用`this.configService.get('xxx')`获取数据。

## 创建数据库

### GUI操作

![alt text](./index.assets/image.png)

### 命令行操作

```bash
# database_name  是数据库名
# table_name 是表名

# 要创建一个新的数据库并指定字符集为utf8mb4
CREATE DATABASE database_name  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 要验证数据库的字符集是否正确设置为utf8mb4
SHOW CREATE DATABASE database_name;

# 如果你已经创建了一个数据库，但忘记了在创建时指定字符集，或者想要修改数据库的字符集
ALTER DATABASE database_name  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 在创建数据库时指定字符集utf8mb4只会影响新创建的表，已经存在的表仍然使用默认的字符集。如果你想要将已经存在的表的字符集也改为utf8mb4
ALTER TABLE table_name CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## token

### 同一账号多端同时登录

- 客户端1登录，后台随机生成一个token1，redis key为token1 value为用户id
- 客户端2登录，后台随机生成一个token2，redis key为token2 value为用户id

### 同一账号只能在一个设备登录

- 客户端1登录，后台随机生成一个token1，redis key为用户id value为token1
- 客户端2登录，后台随机生成一个token2，redis key为用户id value为token2，删除redis key为用户id的value为token1的key-value
