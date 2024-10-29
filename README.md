

# NestJS Project Template

这是一个基于 NestJS 的项目模板，提供了一个开箱即用的开发环境，集成了多种工具和库，以便于快速开始开发。

## 特性

- **JWT**: 集成了JSON Web Tokens，用于处理身份验证和授权。
- **Swagger**: 提供了Swagger UI，用于API文档的自动生成和测试。
- **Prisma**: 集成了Prisma ORM，简化了数据库的管理和操作，支持多种数据库（如PostgreSQL、MySQL等）。
- **Crypto**: 集成了加密库，用于数据加密和安全处理。
- **Log4js**: 集成了Log4js日志库，用于日志记录和管理。
- **Redis**: 集成了Redis缓存库，用于数据缓存和持久化。


## 安装

在开始之前，请确保您已经安装了Node.js和npm/yarn。

1. 克隆本项目到本地：
   ```bash
   git clone https://github.com/wzdzzz/nest-template
   ```

2. 进入项目目录：
   ```bash
   cd nestjs-template
   ```

3. 安装依赖：
   ```bash
   npm install
   # 或者使用yarn
   yarn
   ```

## 快速开始

1. 运行项目：
   ```bash
   npm run start:dev
   # 或者使用yarn
   yarn start:dev
   ```

2. 访问Swagger UI：
   ```
   http://localhost:3000/api
   ```

## 环境变量

根据 `.env.example` 在 `.env` 文件中设置您的环境变量，例如数据库连接、JWT密钥等。

```
DATABASE_URL="postgresql://postgres:password@localhost:5433/database_name"
NODE_ENV=production
JWT_SECRET=nest-demo
JWT_EXPIRATION_TIME=7d
DATABASE_USER=user

# key的长度必须为32bytes
AES_SECRET_KEY=Passw0rdPassw0rdPassw0rdPassw0rd
# iv的长度必须为16bytes
AES_SECRET_VI=a1b2c3d4e5f6g7h8
```


## Prisma 说明

Prisma 是一个现代的数据库工具，提供了类型安全的数据库访问。它通过生成一个类型安全的客户端，使得数据库操作更加简单和高效。使用 Prisma，您可以轻松地进行数据库迁移、查询和管理。

### 安装 Prisma

在项目目录中，您可以使用以下命令安装 Prisma：

```bash
npm install @prisma/client
npm install prisma --save-dev
```

### 初始化 Prisma

运行以下命令以初始化 Prisma：

```bash
npx prisma init
```

这将创建一个 `prisma` 目录，其中包含 `schema.prisma` 文件，您可以在其中定义数据模型。

### 数据库迁移

在定义完数据模型后，您可以运行以下命令进行数据库迁移：

```bash
npx prisma migrate dev --name init
```

## 目录结构

```
nestjs-project-template/
│
├── src/                     # 源代码目录
│   ├── app.module.ts        # 主模块
│   ├── main.ts              # 应用入口文件
│   └── ...                  # 其他模块和文件
│
├── prisma/                  # Prisma 相关文件
│   ├── schema.prisma        # 数据模型定义
│   └── migrations/          # 数据库迁移文件
│
├── test/                    # 测试目录
├── .env                     # 环境变量文件
├── .gitignore               # Git忽略文件
├── package.json             # npm包管理文件
├── README.md                # 项目说明文件
└── tsconfig.json            # TypeScript配置文件
```

## 许可证

本项目采用[MIT许可证](LICENSE)。

请根据您的实际情况调整项目名称、GitHub仓库地址、端口号、环境变量等。如果您需要进一步的定制或者有其他特定的要求，请告诉我。
