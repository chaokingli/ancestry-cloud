# 修复页面404错误 - 工作计划

## TL;DR

> **快速摘要**: 诊断发现11个前端页面缺失导致404错误，需开发14个新页面、4个缺失API端点、3个全局错误处理，并添加E2E测试验证。
>
> **交付物**:
> - 5个核心功能页面 (families, worship, eulogy, ancestors/[id]/worship, families/:id/ancestors/new)
> - 6个辅助页面 (help, guide, faq, privacy, forgot-password, terms)
> - 3个全局错误处理 (not-found.tsx, error.tsx, global-error.tsx)
> - 4个缺失API端点
> - 完整E2E测试覆盖
>
> **预估工作量**: Large
> **并行执行**: YES - 4 Waves
> **关键路径**: API端点 → 核心页面 → E2E测试

---

## Context

### 原始请求
用户报告页面中出现多处404错误，需要诊断并修复。

### 调查摘要
**关键发现**:
- 根因是「功能未开发」而非「路由配置错误」
- API后端已完整实现（20+端点）
- 前端缺失11个页面 + 4个API端点 + 3个全局错误处理
- 祭拜动画组件已实现 (IncenseLighting, Bowing, Offering, PaperMoneyBurning)

**用户决策**:
- 开发所有缺失页面（核心功能页面5个 + 辅助页面6个）
- 辅助页面采用占位页面形式
- 添加全局错误处理
- 使用E2E测试验证

### Metis审查
**识别的差距** (已解决):
- API集成模式: 复用 `/api/ancestors/route.ts` 模式
- 表单模式: 使用 `react-hook-form` + `zod`（与login页面一致）
- 内容来源: 占位页面使用通用内容
- 认证流程: 复用 `/ancestors/[id]/page.tsx` 的session检查模式

---

## Work Objectives

### 核心目标
修复所有404错误，完成14个缺失页面的开发，补充缺失API端点，添加E2E测试验证。

### 具体交付物
1. `/families` - 家族列表页面
2. `/worship` - 祭祀页面
3. `/eulogy` - 祭文页面
4. `/ancestors/[id]/worship` - 祭拜先祖页面
5. `/families/[id]/ancestors/new` - 添加先祖页面
6. `/help` - 使用帮助页面
7. `/guide` - 祭祀指南页面
8. `/faq` - 常见问题页面
9. `/privacy` - 隐私政策页面
10. `/forgot-password` - 忘记密码页面
11. `/terms` - 服务条款页面
12. `not-found.tsx` - 全局404页面
13. `error.tsx` - 错误边界
14. `global-error.tsx` - 全局错误处理
15. `POST /api/worship` - 创建祭拜记录
16. `GET /api/members` - 列出家族成员
17. `GET /api/invitations/[token]` - 验证邀请令牌
18. `POST /api/invitations/[token]/accept` - 接受邀请

### 完成定义
- [x] 所有14个页面可正常访问，无404错误
- [x] 4个缺失API端点正常工作
- [x] 3个全局错误处理正常工作
- [x] E2E测试全部通过
- [x] `bun run build` 成功

### 必须有
- 所有页面使用水墨风格设计系统
- 认证检查（受保护路由重定向到/login）
- 错误处理和用户友好的中文错误消息

### 禁止事项 (Guardrails)
- 不得添加新的外部依赖（无需额外UI库）
- 不得改变现有API的接口契约
- 不得修改已有页面的实现
- 辅助页面不得超过100行代码（保持简洁）

---

## Verification Strategy (MANDATORY)

> **零人工干预原则** — 所有验证由agent执行。无例外。

### 测试决策
- **基础设施存在**: YES (Playwright已配置)
- **自动化测试**: E2E测试
- **框架**: Playwright

### QA策略
每个任务必须包含agent执行的QA场景。

- **前端/UI**: 使用Playwright — 导航、交互、断言DOM、截图
- **API/后端**: 使用Bash (curl) — 发送请求、断言状态码和响应字段

---

## Execution Strategy

### 并行执行波次

```
Wave 1 (立即开始 — 研究和基础设施):
├── Task 1: 研究现有API和表单模式 [quick]
├── Task 2: 创建API端点占位 (4个文件) [quick]
├── Task 3: 创建静态辅助页面 (6个文件) [writing]
└── Task 4: 创建全局错误处理 (3个文件) [quick]

Wave 2 (Wave 1完成后 — 核心开发):
├── Task 5: 实现 /families 页面 [visual-engineering]
├── Task 6: 实现 /worship 页面 [visual-engineering]
├── Task 7: 实现 /eulogy 页面 [visual-engineering]
├── Task 8: 实现 /ancestors/[id]/worship 页面 [visual-engineering]
└── Task 9: 实现 /families/[id]/ancestors/new 页面 [visual-engineering]

Wave 3 (Wave 2完成后 — API实现):
├── Task 10: 实现 POST /api/worship [unspecified-high]
├── Task 11: 实现 GET /api/members [unspecified-high]
├── Task 12: 实现 GET /api/invitations/[token] [unspecified-high]
└── Task 13: 实现 POST /api/invitations/[token]/accept [unspecified-high]

Wave 4 (Wave 3完成后 — 验证):
├── Task 14: E2E测试 - 核心功能页面 [artistry]
├── Task 15: E2E测试 - 辅助页面和错误处理 [artistry]
└── Task 16: 最终验证和构建测试 [quick]

关键路径: Task 1 → Task 2 → Task 5-9 → Task 10-13 → Task 14-16
并行加速: 约50%快于顺序执行
最大并发: 6 (Wave 2)
```

### 依赖矩阵

- **1-4**: 无依赖，可立即开始
- **5-9**: 依赖 1, 2
- **10-13**: 依赖 1, 2
- **14-15**: 依赖 5-13
- **16**: 依赖 14-15

### Agent分发摘要

- **Wave 1**: 4任务 — T1-T2→`quick`, T3→`writing`, T4→`quick`
- **Wave 2**: 5任务 — T5-T9→`visual-engineering`
- **Wave 3**: 4任务 — T10-T13→`unspecified-high`
- **Wave 4**: 3任务 — T14-T15→`artistry`, T16→`quick`

---

- [x] 1. 研究现有API和表单模式
  **What to do**:
  - 分析 `/api/ancestors/route.ts` 和 `/api/families/route.ts` 了解API模式
  - 分析 `/login/page.tsx` 了解表单模式 (react-hook-form + zod)
  - 分析 `/ancestors/[id]/page.tsx` 了解认证检查模式
  - 记录请求/响应格式、错误处理模式、认证流程

  **Must NOT do**:
  - 不要修改任何现有代码

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 研究任务，无需复杂决策
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3, 4)
  - **Blocks**: Task 5-13
  - **Blocked By**: None (can start immediately)

  **References**:
  - `src/app/api/ancestors/route.ts` - API模式参考
  - `src/app/api/families/route.ts` - 家族API参考
  - `src/app/login/page.tsx` - 表单和认证模式参考
  - `src/app/ancestors/[id]/page.tsx` - 认证检查模式参考

  **Acceptance Criteria**:
  - [x] 记录API请求/响应格式文档
  - [x] 记录表单验证模式文档
  - [x] 记录认证流程文档

  **QA Scenarios**:
  ```
  Scenario: 研究完成验证
    Tool: Bash
    Steps:
      1. 检查研究文档是否存在
    Expected Result: 文档包含API格式、表单模式、认证流程
    Evidence: .sisyphus/evidence/task-1-research.md
  ```

  **Commit**: NO

- [x] 2. 创建API端点占位 (4个文件)
  **What to do**:
  - 创建 `src/app/api/worship/route.ts` - POST 创建祭拜记录
  - 创建 `src/app/api/members/route.ts` - GET 列出家族成员 (扩展现有PUT)
  - 创建 `src/app/api/invitations/[token]/route.ts` - GET 验证邀请令牌
  - 创建 `src/app/api/invitations/[token]/accept/route.ts` - POST 接受邀请
  - 使用现有API模式，实现完整功能

  **Must NOT do**:
  - 不得改变现有API接口

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: API实现需要完整逻辑和错误处理
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3, 4)
  - **Blocks**: Task 5-9
  - **Blocked By**: Task 1

  **References**:
  - `src/app/api/ancestors/route.ts:1-442` - API模式参考
  - `src/app/api/families/route.ts:1-99` - 家族API参考
  - `prisma/schema.prisma` - 数据模型参考

  **Acceptance Criteria**:
  - [x] `POST /api/worship` 返回201和创建的记录
  - [x] `GET /api/members?familyId=xxx` 返回成员列表
  - [x] `GET /api/invitations/[token]` 返回邀请详情
  - [x] `POST /api/invitations/[token]/accept` 接受邀请

  **QA Scenarios**:
  ```
  Scenario: POST /api/worship 创建祭拜记录
    Tool: Bash (curl)
    Preconditions: 用户已登录，有测试用家族ID和先祖ID
    Steps:
      1. curl -X POST http://localhost:3000/api/worship -H "Content-Type: application/json" -d '{"ancestorId":"test-id","type":"incense"}'
    Expected Result: HTTP 201, 返回创建的worship记录
    Evidence: .sisyphus/evidence/task-2-api-worship.txt

  Scenario: GET /api/members 获取成员列表
    Tool: Bash (curl)
    Steps:
      1. curl "http://localhost:3000/api/members?familyId=test-family-id"
    Expected Result: HTTP 200, 返回成员数组
    Evidence: .sisyphus/evidence/task-2-api-members.txt
  ```

  **Commit**: YES (groups with Task 10-13)
  - Message: `feat(api): add worship, members, and invitation endpoints`
  - Files: `src/app/api/worship/route.ts`, `src/app/api/members/route.ts`, `src/app/api/invitations/[token]/route.ts`, `src/app/api/invitations/[token]/accept/route.ts`

- [x] 3. 创建静态辅助页面 (6个文件)
  **What to do**:
  - 创建 `/help` - 使用帮助页面
  - 创建 `/guide` - 祭祀指南页面
  - 创建 `/faq` - 常见问题页面
  - 创建 `/privacy` - 隐私政策页面
  - 创建 `/forgot-password` - 忘记密码页面
  - 创建 `/terms` - 服务条款页面
  - 使用水墨风格，占位内容，每个页面<100行

  **Must NOT do**:
  - 不得添加外部依赖
  - 单个文件不得超过100行

  **Recommended Agent Profile**:
  - **Category**: `writing`
    - Reason: 静态内容页面，需要文案撰写
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 4)
  - **Blocks**: Task 15
  - **Blocked By**: None

  **References**:
  - `src/app/page.tsx` - 页面结构和样式参考
  - `src/styles/ink-wash.css` - 水墨设计系统
  - `src/components/layout/Footer.tsx` - 了解链接来源

  **Acceptance Criteria**:
  - [x] 所有6个页面可访问，返回200
  - [x] 使用水墨风格
  - [x] 包含占位内容

  **QA Scenarios**:
  ```
  Scenario: 辅助页面可访问
    Tool: Bash (curl)
    Steps:
      1. curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/help
      2. curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/guide
      3. curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/faq
      4. curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/privacy
      5. curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/forgot-password
      6. curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/terms
    Expected Result: 所有返回200
    Evidence: .sisyphus/evidence/task-3-helper-pages.txt
  ```

  **Commit**: YES
  - Message: `feat(pages): add helper pages (help, guide, faq, privacy, forgot-password, terms)`

- [x] 4. 创建全局错误处理 (3个文件)
  **What to do**:
  - 创建 `src/app/not-found.tsx` - 全局404页面
  - 创建 `src/app/error.tsx` - React错误边界
  - 创建 `src/app/global-error.tsx` - 全局错误处理
  - 使用水墨风格，显示中文错误信息

  **Must NOT do**:
  - 不得修改现有页面

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 错误页面相对简单
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 3)
  - **Blocks**: Task 15
  - **Blocked By**: None

  **References**:
  - Next.js文档: https://nextjs.org/docs/app/api-reference/file-conventions/not-found
  - Next.js文档: https://nextjs.org/docs/app/api-reference/file-conventions/error
  - `src/styles/ink-wash.css` - 水墨设计系统

  **Acceptance Criteria**:
  - [x] 访问不存在的路由显示自定义404页面
  - [x] 错误边界捕获React错误

  **QA Scenarios**:
  ```
  Scenario: 404页面显示
    Tool: Bash (curl)
    Steps:
      1. curl -s http://localhost:3000/nonexistent-page-12345 | grep -c "404\|未找到\|页面不存在"
    Expected Result: 返回包含404或错误信息的HTML
    Evidence: .sisyphus/evidence/task-4-error-pages.txt
  ```

  **Commit**: YES
  - Message: `feat(pages): add global error handling (not-found, error, global-error)`

- [x] 5. 实现 /families 页面
  **What to do**:
  - 创建 `src/app/families/page.tsx`
  - 显示用户所属家族列表
  - 支持创建新家族
  - 实现认证检查（未登录重定向到/login）
  - 使用水墨风格设计

  **Must NOT do**:
  - 不得添加外部依赖
  - 不得修改API

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: 核心功能页面，需要良好的UI/UX
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: UI/UX设计和实现

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 6, 7, 8, 9)
  - **Blocks**: Task 14
  - **Blocked By**: Task 1, Task 2

  **References**:
  - `src/app/ancestors/page.tsx` - 列表页面模式参考
  - `src/app/api/families/route.ts` - API端点
  - `src/lib/constants/navigation.ts` - 导航配置

  **Acceptance Criteria**:
  - [x] 页面可访问，返回200
  - [x] 未登录用户重定向到/login
  - [x] 显示家族列表
  - [x] 可创建新家族

  **QA Scenarios**:
  ```
  Scenario: 家族列表页面加载
    Tool: Playwright
    Preconditions: 用户已登录
    Steps:
      1. page.goto('http://localhost:3000/families')
      2. expect(page.locator('h1')).toContainText('家族')
    Expected Result: 页面加载成功，显示家族列表
    Evidence: .sisyphus/evidence/task-5-families-page.png

  Scenario: 未登录用户重定向
    Tool: Playwright
    Preconditions: 用户未登录
    Steps:
      1. page.goto('http://localhost:3000/families')
      2. expect(page).toHaveURL(/login/)
    Expected Result: 重定向到登录页
    Evidence: .sisyphus/evidence/task-5-families-redirect.png
  ```

  **Commit**: YES (groups with Task 6-9)
  - Message: `feat(pages): add core feature pages`

- [x] 6. 实现 /worship 页面
  **What to do**:
  - 创建 `src/app/worship/page.tsx`
  - 显示祭拜入口，选择先祖进行祭拜
  - 集成祭拜动画组件 (IncenseLighting, Bowing, Offering, PaperMoneyBurning)
  - 实现认证检查

  **Must NOT do**:
  - 不得添加外部依赖

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: 核心功能页面，涉及动画组件集成
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 5, 7, 8, 9)
  - **Blocks**: Task 14
  - **Blocked By**: Task 1, Task 2

  **References**:
  - `src/components/worship/` - 祭拜动画组件
  - `src/app/api/worship/history/route.ts` - 祭拜历史API

  **Acceptance Criteria**:
  - [x] 页面可访问，返回200
  - [x] 可选择先祖进行祭拜
  - [x] 祭拜动画正常显示

  **QA Scenarios**:
  ```
  Scenario: 祭拜页面加载
    Tool: Playwright
    Steps:
      1. page.goto('http://localhost:3000/worship')
      2. expect(page.locator('h1')).toContainText('祭祀')
    Expected Result: 页面加载成功
    Evidence: .sisyphus/evidence/task-6-worship-page.png
  ```

  **Commit**: YES (groups with Task 5, 7-9)
- [x] 7. 实现 /eulogy 页面

  **What to do**:
  - 创建 `src/app/eulogy/page.tsx`
  - 显示祭文列表，支持查看和创建祭文
  - 使用模板功能
  - 实现认证检查

  **Must NOT do**:
  - 不得添加外部依赖

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: 核心功能页面
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 5, 6, 8, 9)
  - **Blocks**: Task 14
  - **Blocked By**: Task 1, Task 2

  **References**:
  - `src/app/api/eulogies/route.ts` - 祭文API
  - `src/app/api/eulogies/templates/route.ts` - 模板API

  **Acceptance Criteria**:
  - [x] 页面可访问，返回200
  - [x] 显示祭文列表
  - [x] 可创建新祭文

  **QA Scenarios**:
  ```
  Scenario: 祭文页面加载
    Tool: Playwright
    Steps:
      1. page.goto('http://localhost:3000/eulogy')
      2. expect(page.locator('h1')).toContainText('祭文')
    Expected Result: 页面加载成功
    Evidence: .sisyphus/evidence/task-7-eulogy-page.png
  ```

  **Commit**: YES (groups with Task 5-6, 8-9)

- [x] 8. 实现 /ancestors/[id]/worship 页面
  **What to do**:
  - 创建 `src/app/ancestors/[id]/worship/page.tsx`
  - 显示祭拜界面，执行祭拜操作
  - 集成祭拜动画组件
  - 调用 POST /api/worship 创建祭拜记录

  **Must NOT do**:
  - 不得添加外部依赖

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: 核心功能页面，祭拜交互
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 5-7, 9)
  - **Blocks**: Task 14
  - **Blocked By**: Task 1, Task 2

  **References**:
  - `src/app/ancestors/[id]/page.tsx:409` - 链接来源
  - `src/components/worship/` - 祭拜动画组件
  - `src/app/api/worship/route.ts` - 祭拜API

  **Acceptance Criteria**:
  - [x] 页面可访问，返回200
  - [x] 显示先祖信息和祭拜选项
  - [x] 可执行祭拜操作

  **QA Scenarios**:
  ```
  Scenario: 祭拜先祖页面
    Tool: Playwright
    Steps:
      1. page.goto('http://localhost:3000/ancestors/test-id/worship')
      2. expect(page.locator('button')).toContainText('祭拜')
    Expected Result: 页面加载成功，显示祭拜选项
    Evidence: .sisyphus/evidence/task-8-ancestor-worship.png
  ```

  **Commit**: YES (groups with Task 5-7, 9)

- [x] 9. 实现 /families/[id]/ancestors/new 页面
  - 创建 `src/app/families/[id]/ancestors/new/page.tsx`
  - 创建先祖表单页面
  - 使用 react-hook-form + zod 验证
  - 调用 POST /api/ancestors 创建先祖

  **Must NOT do**:
  - 不得添加外部依赖

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: 表单页面，需要良好UX
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 5-8)
  - **Blocks**: Task 14
  - **Blocked By**: Task 1, Task 2

  **References**:
  - `src/app/login/page.tsx` - 表单模式参考
  - `src/app/api/ancestors/route.ts` - 先祖API
  - `src/app/ancestors/page.tsx:639` - 链接来源

  **Acceptance Criteria**:
  - [x] 页面可访问，返回200
  - [x] 表单验证正常
  - [x] 可创建先祖

  **QA Scenarios**:
  ```
  Scenario: 添加先祖页面
    Tool: Playwright
    Steps:
      1. page.goto('http://localhost:3000/families/test-id/ancestors/new')
      2. expect(page.locator('form')).toBeVisible()
    Expected Result: 页面加载成功，显示表单
    Evidence: .sisyphus/evidence/task-9-new-ancestor.png
  ```

  **Commit**: YES (groups with Task 5-8)

- [x] 10. 实现 POST /api/worship 端点完整功能
  **What to do**:
  - 完善 `src/app/api/worship/route.ts` 的POST实现
  - 创建祭拜记录，记录到WorshipRecord表
  - 创建活动日志

  **Must NOT do**:
  - 不得修改现有API接口

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: API实现需要完整逻辑
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 11-13)
  - **Blocks**: Task 14
  - **Blocked By**: Task 1, Task 2

  **References**:
  - `src/app/api/ancestors/route.ts` - API模式参考
  - `prisma/schema.prisma` - WorshipRecord模型

  **Acceptance Criteria**:
  - [x] POST请求创建祭拜记录
  - [x] 返回201和创建的记录
  - [x] 创建活动日志

  **QA Scenarios**:
  ```
  Scenario: 创建祭拜记录
    Tool: Bash (curl)
    Steps:
      1. curl -X POST http://localhost:3000/api/worship -H "Content-Type: application/json" -d '{"ancestorId":"test","type":"incense"}'
    Expected Result: HTTP 201
    Evidence: .sisyphus/evidence/task-10-api-worship-post.txt
  ```

  **Commit**: YES (groups with Task 2, 11-13)



  **What to do**:
  - 创建 `src/app/api/invitations/[token]/route.ts`
  - 验证邀请令牌有效性
  - 返回邀请详情

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 10, 11, 13)
  - **Blocked By**: Task 1, Task 2

  **Commit**: YES (groups with Task 2, 10-11, 13)
- [x] 13. 实现 POST /api/invitations/[token]/accept 端点

  **What to do**:
  - 创建 `src/app/api/invitations/[token]/accept/route.ts`
  - 接受邀请，将用户添加到家族

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 10-12)
  - **Blocked By**: Task 1, Task 2

  **Commit**: YES (groups with Task 2, 10-12)

- [x] 14. E2E测试 - 核心功能页面
  **What to do**:
  - 创建 `tests/e2e/families.spec.ts`
  - 创建 `tests/e2e/worship.spec.ts`
  - 创建 `tests/e2e/eulogy.spec.ts`
  - 测试所有核心功能页面的加载、认证、基本交互

  **Recommended Agent Profile**:
  - **Category**: `artistry`
    - Reason: E2E测试需要创造性设计
  - **Skills**: [`playwright`]
    - `playwright`: Playwright测试框架

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Task 15)
  - **Blocked By**: Task 5-13

  **Commit**: YES
  - Message: `test(e2e): add tests for core feature pages`
- [x] 15. E2E测试 - 辅助页面和错误处理

  **What to do**:
  - 创建 `tests/e2e/helper-pages.spec.ts`
  - 创建 `tests/e2e/error-handling.spec.ts`
  - 测试所有辅助页面和错误处理

  **Recommended Agent Profile**:
  - **Category**: `artistry`
  - **Skills**: [`playwright`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Task 14)
  - **Blocked By**: Task 3-4, Task 5-13

  **Commit**: YES
  - Message: `test(e2e): add tests for helper pages and error handling`

- [x] 16. 最终验证和构建测试
  **What to do**:
  - 运行 `bun run build` 确保构建成功
  - 运行 `bun run test:e2e` 确保所有测试通过
  - 验证所有页面可访问

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`playwright`]

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential (最后一步)
  - **Blocked By**: Task 14-15

  **QA Scenarios**:
  ```
  Scenario: 构建验证
    Tool: Bash
    Steps:
      1. bun run build
    Expected Result: 构建成功，无错误
    Evidence: .sisyphus/evidence/task-16-build.txt

  Scenario: E2E测试通过
    Tool: Bash
    Steps:
      1. bun run test:e2e
    Expected Result: 所有测试通过
    Evidence: .sisyphus/evidence/task-16-e2e.txt
  ```

  **Commit**: NO


## Final Verification Wave (MANDATORY — 所有实现任务完成后)

- [x] F1. **计划合规审计** — `oracle`
- [x] F2. **代码质量审查** — `unspecified-high`

  - [x] F4. **范围保真度检查** — `deep`
---

## Commit Strategy

- **策略**: 按功能分组提交
- **提交1**: `feat(api): add missing worship and members endpoints`
- **提交2**: `feat(pages): add core feature pages (families, worship, eulogy)`
- **提交3**: `feat(pages): add helper pages and error handling`
- **提交4**: `test(e2e): add tests for all new pages`

---

## Success Criteria

### 验证命令
```bash
# 构建验证
bun run build  # 预期: 成功无错误

# E2E测试
bun run test:e2e  # 预期: 所有测试通过

# 页面可访问性验证
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/families  # 预期: 200
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/worship   # 预期: 200
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/eulogy    # 预期: 200
```

- [x] 所有14个页面可访问
- [x] 所有4个API端点正常工作
- [x] 3个全局错误处理正常工作
- [x] E2E测试全部通过
- [x] 构建成功
- [x] 无TypeScript错误