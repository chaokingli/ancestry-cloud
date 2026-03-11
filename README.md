# 拜祭先祖 / Ancestry Cloud

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## 简体中文

一个现代化的家族拜祭先祖网页应用，采用水墨风格设计，支持家族成员共享先祖信息、致词撰写和虚拟祭拜功能。

### 功能特性

#### 家族共享系统
- **多家族管理**：用户可创建多个家族，或加入他人邀请的家族
- **三级权限体系**：管理员 (ADMIN)、编辑者 (EDITOR)、查看者 (VIEWER)
- **邀请机制**：通过邮件邀请家人加入，支持邀请链接过期设置

#### 先祖管理
- **完整信息记录**：姓名、性别、生卒日期、籍贯、生平简介
- **照片相册**：支持多张照片上传，自动压缩和优化
- **搜索筛选**：按姓名、家族筛选，支持排序

#### 虚拟祭拜
四种传统祭拜方式的精美动画：

| 祭拜类型 | 描述 |
|---------|------|
| 上香 | 香炉上香动画，香烟袅袅升起 |
| 供奉 | 传统供品摆放，含水果、糕点、茶酒等 |
| 磕头/作揖 | 人物跪拜动画，可选择磕头或作揖 |
| 烧纸钱 | 金纸银纸燃烧动画，火焰跃动 |

#### 致词系统
- **模板管理**：创建可复用的致词模板
- **个性化致词**：为每位先祖撰写专属悼词
- **传统格式**：支持传统祭文格式

#### 活动动态
- **时间线展示**：家族所有活动一目了然
- **类型筛选**：按活动类型筛选查看
- **分页浏览**：支持大量活动记录

### 水墨设计系统

本项目采用传统水墨画风格设计，体现中华文化的庄重与典雅：

#### 色彩体系
- **墨色 (Ink)**：代表庄重与敬意，用于文字和边框
- **宣纸色 (Paper)**：代表纯净与传统，用于背景
- **朱砂色 (Vermilion)**：代表吉祥与繁荣，用于强调和装饰
- **金色 (Gold)**：用于装饰元素

#### 设计理念
- 佛教美学影响：简约、尊重、宁静
- 传统排版：支持竖排文字、宋体字体
- 有机边框：模拟手绘效果的边角处理
- 印章风格：朱红色印章元素点缀

### 技术栈

| 类别 | 技术 |
|------|------|
| 前端框架 | Next.js 16 (App Router) |
| 类型系统 | TypeScript |
| 样式方案 | Tailwind CSS + 水墨设计系统 |
| 组件库 | shadcn/ui + Radix UI |
| 数据库 ORM | Prisma 7 |
| 数据库 | SQLite (开发) / PostgreSQL (生产) |
| 认证 | NextAuth.js v5 + bcrypt |
| 测试 | Vitest + Playwright |
| 部署 | Docker |

### 快速开始

#### 环境要求
- Node.js 20+
- Bun (推荐) 或 npm/yarn/pnpm

#### 本地开发

```bash
# 克隆仓库
git clone https://github.com/your-username/ancestry-cloud.git
cd ancestry-cloud

# 安装依赖
bun install

# 复制环境变量
cp .env.example .env

# 生成 Prisma 客户端
bunx prisma generate

# 运行数据库迁移
bunx prisma migrate dev

# 启动开发服务器
bun run dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

#### 环境变量配置

创建 `.env` 文件并配置以下变量：

```env
# NextAuth.js 配置 (必需)
# 使用 openssl rand -base64 32 生成
AUTH_SECRET=your-32-byte-random-secret-key-here

# 数据库连接 (SQLite 开发环境)
DATABASE_URL=file:./dev.db

# 可选：自定义域名
# NEXTAUTH_URL=https://yourdomain.com
```

### Docker 部署

#### 使用 Docker Compose (推荐)

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，设置 AUTH_SECRET
# 使用 openssl rand -base64 32 生成密钥

# 构建并启动
docker-compose up -d

# 查看日志
docker-compose logs -f
```

#### 手动 Docker 构建

```bash
# 构建镜像
docker build -t ancestry-cloud .

# 运行容器
docker run -d \
  -p 3000:3000 \
  -e AUTH_SECRET=your-secret-key \
  -e DATABASE_URL=file:/data/db/production.db \
  -v ancestry-data:/data/db \
  ancestry-cloud
```

### 项目结构

```
ancestry-cloud/
├── src/
│   ├── app/                    # Next.js App Router 页面
│   │   ├── (auth)/            # 认证相关页面
│   │   ├── ancestors/         # 先祖管理页面
│   │   ├── api/               # API 路由
│   │   ├── families/          # 家族管理页面
│   │   └── settings/          # 用户设置页面
│   ├── components/            # React 组件
│   │   ├── ui/               # 基础 UI 组件
│   │   └── worship/          # 祭拜动画组件
│   ├── lib/                   # 工具函数和配置
│   └── styles/               # 样式文件
│       └── ink-wash.css      # 水墨设计系统
├── prisma/
│   └── schema.prisma         # 数据库模型定义
├── tests/
│   └── e2e/                  # E2E 测试
├── docker-compose.yml
├── Dockerfile
└── package.json
```

### 测试

```bash
# 运行单元测试
bun run test

# 运行 E2E 测试
bun run test:e2e

# 带 UI 的 E2E 测试
bun run test:e2e:ui
```

### 安全考虑

- 所有密码使用 bcrypt 加密存储
- NextAuth.js v5 提供安全的会话管理
- API 路由实现完整的权限验证
- 文件上传支持类型和大小验证
- CSRF 防护默认启用

---

## English

A modern web application for ancestral worship, featuring ink-wash design aesthetics, family sharing capabilities, ancestor management, and virtual worship ceremonies.

### Features

#### Family Sharing System
- **Multi-family Management**: Users can create multiple families or join families they're invited to
- **Three-tier Permission System**: Admin, Editor, and Viewer roles
- **Invitation Mechanism**: Email-based invitations with expiring links

#### Ancestor Management
- **Complete Information**: Name, gender, birth/death dates, birthplace, biography
- **Photo Albums**: Multiple photo uploads with automatic compression and optimization
- **Search & Filter**: Filter by name or family, with sorting options

#### Virtual Worship
Four traditional worship ceremony animations:

| Worship Type | Description |
|-------------|-------------|
| Incense Lighting | Incense burner animation with rising smoke |
| Offerings | Traditional offerings including fruits, pastries, tea, and wine |
| Bowing | Character bowing animation with kowtow or clasped hands options |
| Paper Money Burning | Gold and silver paper money burning with flickering flames |

#### Eulogy System
- **Template Management**: Create reusable eulogy templates
- **Personalized Eulogies**: Write dedicated eulogies for each ancestor
- **Traditional Format**: Support for traditional memorial text formats

#### Activity Feed
- **Timeline View**: See all family activities at a glance
- **Type Filtering**: Filter by activity type
- **Pagination**: Support for large activity records

### Ink-Wash Design System

This project adopts a traditional Chinese ink-wash painting style:

#### Color Palette
- **Ink Colors**: Representing respect and solemnity
- **Paper Colors**: Representing purity and tradition
- **Vermilion Colors**: Representing fortune and prosperity
- **Gold Accents**: For decorative elements

#### Design Philosophy
- Buddhist aesthetic influence: minimalist, respectful, serene
- Traditional typography: vertical text support, serif fonts
- Organic borders: hand-painted effect corners
- Seal/stamp styling: vermilion seal elements

### Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | Next.js 16 (App Router) |
| Types | TypeScript |
| Styling | Tailwind CSS + Ink-Wash Design System |
| Components | shadcn/ui + Radix UI |
| ORM | Prisma 7 |
| Database | SQLite (dev) / PostgreSQL (prod) |
| Auth | NextAuth.js v5 + bcrypt |
| Testing | Vitest + Playwright |
| Deployment | Docker |

### Quick Start

#### Requirements
- Node.js 20+
- Bun (recommended) or npm/yarn/pnpm

#### Local Development

```bash
# Clone the repository
git clone https://github.com/your-username/ancestry-cloud.git
cd ancestry-cloud

# Install dependencies
bun install

# Copy environment variables
cp .env.example .env

# Generate Prisma client
bunx prisma generate

# Run database migrations
bunx prisma migrate dev

# Start development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

#### Environment Variables

Create a `.env` file with the following:

```env
# NextAuth.js configuration (required)
# Generate with: openssl rand -base64 32
AUTH_SECRET=your-32-byte-random-secret-key-here

# Database connection (SQLite for development)
DATABASE_URL=file:./dev.db

# Optional: Custom domain
# NEXTAUTH_URL=https://yourdomain.com
```

### Docker Deployment

#### Using Docker Compose (Recommended)

```bash
# Copy environment template
cp .env.example .env

# Edit .env file and set AUTH_SECRET
# Generate key with: openssl rand -base64 32

# Build and start
docker-compose up -d

# View logs
docker-compose logs -f
```

#### Manual Docker Build

```bash
# Build image
docker build -t ancestry-cloud .

# Run container
docker run -d \
  -p 3000:3000 \
  -e AUTH_SECRET=your-secret-key \
  -e DATABASE_URL=file:/data/db/production.db \
  -v ancestry-data:/data/db \
  ancestry-cloud
```

### Project Structure

```
ancestry-cloud/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Authentication pages
│   │   ├── ancestors/         # Ancestor management
│   │   ├── api/               # API routes
│   │   ├── families/          # Family management
│   │   └── settings/          # User settings
│   ├── components/            # React components
│   │   ├── ui/               # Base UI components
│   │   └── worship/          # Worship animations
│   ├── lib/                   # Utilities and config
│   └── styles/               # Stylesheets
│       └── ink-wash.css      # Ink-wash design system
├── prisma/
│   └── schema.prisma         # Database models
├── tests/
│   └── e2e/                  # E2E tests
├── docker-compose.yml
├── Dockerfile
└── package.json
```

### Testing

```bash
# Run unit tests
bun run test

# Run E2E tests
bun run test:e2e

# E2E tests with UI
bun run test:e2e:ui
```

### Security Considerations

- All passwords encrypted with bcrypt
- NextAuth.js v5 provides secure session management
- Complete permission verification on API routes
- File upload validation (type and size)
- CSRF protection enabled by default

---

## Contributing / 贡献

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

欢迎提交 Pull Request。对于重大更改，请先开 Issue 讨论您想要更改的内容。

## License / 许可证

[MIT](LICENSE)