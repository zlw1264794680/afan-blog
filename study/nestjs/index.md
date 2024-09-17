# Nest.js

## 相关命令

```bash


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

![alt text](image.png)

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
