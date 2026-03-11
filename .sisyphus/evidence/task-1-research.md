# API 和表单模式研究文档

**研究日期**: 2026-03-11  
**研究目标**: 分析现有 API 和表单模式，为新功能开发提供参考

---

## 1. API 路由模式

### 1.1 通用结构

所有 API 路由遵循 Next.js App Router 格式：

```typescript
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET, POST, PUT, DELETE 对应 HTTP 方法
export async function GET(request: NextRequest) {
  try {
    // 1. 认证检查
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "未授权，请先登录" },
        { status: 401 }
      )
    }
    
    // 2. 参数解析
    const { searchParams } = new URL(request.url)
    const param = searchParams.get("paramName")
    
    // 3. 权限验证
    // ... 业务逻辑
    
    // 4. 返回数据
    return NextResponse.json(
      { data },
      { status: 200 }
    )
  } catch (error) {
    console.error("[API_PATH] Error:", error)
    return NextResponse.json(
      { message: "操作失败" },
      { status: 500 }
    )
  }
}
```

### 1.2 请求格式

#### GET 请求参数
- 通过 `URLSearchParams` 解析
- 常用参数: `familyId`, `search`, `page`, `limit`, `sortBy`, `sortOrder`
- 示例: `/api/ancestors?familyId=xxx&search=xxx&page=1&limit=20`

#### POST/PUT 请求体
- 使用 `request.json()` 解析
- TypeScript 类型安全
- 示例:
```typescript
const body = await request.json()
const { field1, field2 } = body
```

### 1.3 响应格式

#### 成功响应
```typescript
return NextResponse.json(
  {
    message: "操作成功描述",
    data: object,
    // 可选分页信息
    pagination: {
      page: number,
      limit: number,
      total: number,
      totalPages: number,
    },
  },
  { status: 200 | 201 }
)
```

#### 错误响应
统一错误格式:
```typescript
return NextResponse.json(
  { message: "中文错误描述" },
  { status: 400 | 401 | 403 | 404 | 500 }
)
```

错误码规范:
| 状态码 | 含义 | 中文描述 |
|--------|------|----------|
| 400 | Bad Request | 参数验证失败 |
| 401 | Unauthorized | 未授权/未登录 |
| 403 | Forbidden | 权限不足 |
| 404 | Not Found | 资源不存在 |
| 500 | Internal Server Error | 服务器错误 |

### 1.4 权限验证模式

#### 家族成员检查
```typescript
async function checkFamilyMembership(userId: string, familyId: string) {
  const familyMember = await prisma.familyMember.findFirst({
    where: {
      userId,
      familyId,
    },
  })
  return familyMember
}
```

#### 角色权限检查
```typescript
function hasEditPermission(role: string): boolean {
  return role === "EDITOR" || role === "ADMIN"
}
```

三个角色:
- `ADMIN` - 管理员（所有权限）
- `EDITOR` - 编辑者（可增删改）
- `VIEWER` - 查看者（只读）

### 1.5 活动日志记录

所有修改操作需记录活动:
```typescript
await prisma.activity.create({
  data: {
    familyId,
    ancestorId: itemId,
    type: "ancestor_created | ancestor_updated | ancestor_deleted",
    itemId: string,
    itemName: string,
    description: string,
    userId: session.user.id,
  },
})
```

---

## 2. 认证流程

### 2.1 服务端认证 (`auth()`)
```typescript
import { auth } from "@/lib/auth"

const session = await auth()
if (!session?.user?.id) {
  // 未认证处理
}
```

### 2.2 客户端认证检查
页面级认证检查 ( utilizes `/api/auth/session`):
```typescript
useEffect(() => {
  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/session", {
        credentials: "include",
      })
      if (!res.ok || res.status === 401) {
        router.push("/login")
        return
      }
      const data = await res.json()
      if (!data.user?.id) {
        router.push("/login")
        return
      }
      setIsAuthenticated(true)
    } catch {
      router.push("/login")
    }
  }
  checkAuth()
}, [router])
```

### 2.3 会话 API 响应格式
```typescript
// GET /api/auth/session
{
  user: {
    id: string,
    name?: string,
    email?: string,
    image?: string,
  },
  expires: string,
}
```

---

## 3. 表单模式 (React Hook Form + Zod)

### 3.1 核心依赖
```typescript
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
```

### 3.2 Schema 定义
```typescript
const loginSchema = z.object({
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(1, "请输入密码"),
})

type LoginSchema = z.infer<typeof loginSchema>
```

### 3.3 表单组件结构
```typescript
const form = useForm<LoginSchema>({
  resolver: zodResolver(schema),
  defaultValues: {
    field1: "",
    field2: "",
  },
})

async function onSubmit(data: LoginSchema) {
  // 处理提交
}

return (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FormField
        control={form.control}
        name="fieldName"
        render={({ field }) => (
          <FormItem>
            <Label>字段标签</Label>
            <Input {...field} disabled={isLoading} />
            <FormMessage />
          </FormItem>
        )}
      />
    </form>
  </Form>
)
```

### 3.4 UI 组件库
表单相关组件位置:
- `@/components/ui/form` - Form, FormField, FormItem, FormMessage
- `@/components/ui/input` - Input
- `@/components/ui/label` - Label
- `@/components/ui/button` - Button

### 3.5 错误处理模式
```typescript
const [error, setError] = useState<string | null>(null)
const [isLoading, setIsLoading] = useState(false)

async function onSubmit(data: Data) {
  setIsLoading(true)
  setError(null)
  
  try {
    const result = await someAsyncOperation()
    if (result?.error) {
      setError("错误描述")
      setIsLoading(false)
      return
    }
    // 成功处理
  } catch (error) {
    setError("异常错误描述")
    setIsLoading(false)
  }
}
```

---

## 4. 认证页面模式 (`/login/page.tsx`)

### 4.1 登录流程
```typescript
async function onSubmit(data: LoginSchema) {
  const result = await signIn('credentials', {
    email: data.email,
    password: data.password,
    redirect: false, // 关键: 不自动重定向
  })
  
  if (result?.error) {
    setError("邮箱或密码错误")
    return
  }
  
  router.push("/") // 成功后重定向
  router.refresh()
}
```

### 4.2 NextAuth 配置
认证配置位于 `/src/lib/auth-config.ts`:
```typescript
import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth-config"

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
```

---

## 5. 错误处理模式总结

### API 层错误
- 所有 API 路由必须有 try-catch 包裹
- 错误必须记录到 console.error
- 统一返回格式 `{ message: "中文描述" }`

### 页面层错误
```typescript
const [error, setError] = useState<string | null>(null)

if (error) {
  return (
    <div className="text-center">
      <AlertCircle className="mx-auto mb-4" />
      <p>{error}</p>
      <Button onClick={() => setError(null)}>重试</Button>
    </div>
  )
}
```

---

## 6. 开发规范检查清单

### API 路由开发
- [ ] 认证检查 `auth()` 必须在函数开头
- [ ] 参数验证并返回 400 错误
- [ ] 权限检查并返回 403 错误
- [ ] 资源存在性检查并返回 404 错误
- [ ] 修改操作必须记录活动日志
- [ ] 使用 NextResponse.json 统一返回格式
- [ ] try-catch 包裹所有逻辑

### 表单开发
- [ ] 使用 Zod 定义 Schema
- [ ] 使用 zodResolver 关联表单
- [ ] 所有字段添加 FormMessage 显示错误
- [ ] 提交时显示 loading 状态
- [ ] 错误信息使用中文描述
- [ ] 使用 {...field} 自动绑定表单字段

### 认证检查
- [ ] 服务端组件使用 `auth()`
- [ ] 客户端组件使用 `/api/auth/session` API
- [ ] 未认证用户重定向到 `/login`
- [ ] 敏感操作二次验证权限

---

## 7. 相关文件路径

| 文件类型 | 路径 | 说明 |
|----------|------|------|
| 认证库 | `src/lib/auth.ts` | NextAuth 导出 |
| 认证配置 | `src/lib/auth-config.ts` | NextAuth 配置 |
| Prisma | `src/lib/prisma.ts` | 数据库实例 |
| 登录页面 | `src/app/login/page.tsx` | 登录表单 |
| 注册页面 | `src/app/register/page.tsx` | 注册表单 |
| 家族 API | `src/app/api/families/route.ts` | 家族 CRUD |
| 先祖 API | `src/app/api/ancestors/route.ts` | 先祖 CRUD |
| 先祖详情 API | `src/app/api/ancestors/[id]/route.ts` | 单个先祖 |
| 活动 API | `src/app/api/activity/route.ts` | 活动日志 |
| 相册 API | `src/app/api/albums/route.ts` | 照片管理 |
| 致词 API | `src/app/api/eulogies/route.ts` | 致词管理 |
| 成员 API | `src/app/api/members/route.ts` | 家族成员 |

---

**文档版本**: 1.0  
**最后更新**: 2026-03-11
