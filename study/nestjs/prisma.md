# Prisma

> `Prisma ORM ` 是一款下一代 Node.js 和 TypeScript ORM，它凭借其直观的 数据模型、自动迁移、类型安全和自动完成，为数据库开发带来了全新的开发体验。
>
> [**Prisma ORM 中文文档**](https://prisma.org.cn/docs/orm/overview/introduction/what-is-prisma) 
>
> [**Prisma ORM 英文文档**](https://www.prisma.io/docs/getting-started)

## 安装依赖

```bash
pnpm i prisma @prisma/client
```

## 初始化配置

https://www.prisma.io/docs/orm/reference/connection-urls

```bash
npx prisma init
```

执行以上命令会创建`.env`文件与`prisma`文件夹

- `.env ` 用于定义数据库连接
- `prisma` 用于定义模型结构与数据迁移与数据填充文件

### 修改 .env 

```bash
# 解释
DATABASE_URL="<mysql[数据库引擎]>://<账号>:<密码>@localhost:3306/<数据库名>"
# 示例
DATABASE_URL="mysql://root:123456@localhost:3306/personal_system"
```

### 修改 prisma/schema.prisma 

```bash

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

```

## 拉取数据库模型

需要确保 `prisma/schema.prisma ` 数据库配置正确！！！

```bash
npx prisma db pull
```

## 生成 Prisma Client

```bash
npx prisma generate
```

具体来说，它会根据你在 `prisma/schema.prisma` 文件中定义的数据模型，生成 Prisma 客户端代码。生成的代码可以让你在项目中方便地与数据库交互，进行 CRUD 操作等。

> Prisma Client 是一个自动生成的类型安全查询构造器。
>
> 可以理解：提供模型信息的类型提示功能。

## Prisma Studio

> Prisma Studio 是数据库中数据的可视化编辑器。

```bash
npx Prisma studio
```

## 集成到 Nest.js 项目

### 定义 prisma.service.ts 

```ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
  constructor() {
    // 输出查询 SQL等 LOG
    // 正式环境，不建议输出查询SQL
    super({
      log: ['query', 'info', 'warn', 'error'],
    });
  }
}

```

### 修改 share.module.ts

https://docs.nestjs.com/recipes/prisma

```ts
import { Global, Module, ValidationPipe } from '@nestjs/common';
import { SharedService } from './shared.service';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AllExceptionFilter } from '@/common/filters/all-exception.filter';
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor';
import { ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';
import { createClient } from 'redis';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  imports: [],
  providers: [
    SharedService,
    RedisService,
    PrismaService,
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
    {
      // 全局错误过滤器
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    {
      // 全局拦截器
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      //全局参数校验管道
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        transform: true, // 自动类型转换
      }),
    },
  ],
  exports: [SharedService, RedisService, PrismaService],
})
export class SharedModule {}
```

## 常用CRUD

> 单表CRUD可以使用orm，这个没什么问题！！！
>
> 多表联查，不建议使用orm，有一定层度上的心智负担和学习成本，用原生SQL嗦哈！！！

### 在service使用

```ts
constructor(
    private readonly prisma: PrismaService,
) {}
```



