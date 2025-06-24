# MMM Memos - Tauri 客户端

一个基于 Tauri 2.0 的 Memos 桌面客户端，支持 iOS 和桌面平台。

## 功能特性

- 🚀 基于 Tauri 2.0 构建
- 📱 支持 iOS 和桌面平台
- 🎨 现代化的 UI 设计，支持深色模式
- 🔐 安全的认证系统
- 📝 笔记编辑和管理
- 🔍 搜索功能
- 🏷️ 标签和分类
- 🛣️ Vue Router 路由管理
- 🗃️ Pinia 状态管理

## 技术栈

- **后端**: Tauri 2.0 (Rust)
- **前端**: Vue 3 + TypeScript + Vite
- **路由**: Vue Router 4
- **状态管理**: Pinia
- **样式**: Tailwind CSS
- **包管理**: pnpm

## 开发环境设置

### 前置要求

- Node.js 18+
- pnpm
- Rust (用于 Tauri)
- Xcode (用于 iOS 构建)

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
# 启动前端开发服务器
pnpm dev

# 启动 Tauri 开发模式
pnpm tauri dev
```

### 构建

```bash
# 构建前端
pnpm build

# 构建所有平台
pnpm tauri build

# 构建 iOS
pnpm tauri build --target aarch64-apple-ios
```

## 应用架构

### 路由结构

应用采用 Vue Router 进行页面路由管理：

- **`/`** - 登录页面 (`LoginView.vue`)
- **`/dashboard`** - 仪表板 (`DashboardView.vue`)
- **`/memos`** - 笔记列表 (`MemosView.vue`)
- **`/settings`** - 设置页面 (`SettingsView.vue`)
- **`/404`** - 404错误页面 (`NotFoundView.vue`)

### 状态管理 (Pinia)

应用使用 Pinia 进行状态管理，主要的 store 包括：

#### 认证 Store (`useAuthStore`)

```typescript
// 状态
authState: AuthState          // 认证状态对象
isLoading: boolean           // 加载状态

// 计算属性
isAuthenticated: boolean     // 是否已认证
user: User                   // 用户信息
serverUrl: string           // 服务器地址
accessToken: string         // 访问令牌

// 动作
login(data: LoginData)      // 登录
logout()                    // 登出
checkAuth()                 // 检查认证状态
updateUser(userData)        // 更新用户信息
```

### 路由守卫

- **认证检查**: 自动检查用户登录状态（从 Pinia store）
- **页面标题**: 动态设置页面标题
- **重定向**: 未登录用户自动重定向到登录页
- **状态恢复**: 自动从 localStorage 恢复认证状态

### 登录流程

1. **登录页面** (`/`)：用户输入服务器地址和访问令牌
2. **认证验证**：调用 Memos API 验证令牌
3. **状态保存**：认证信息存储到 Pinia store 和 localStorage
4. **页面跳转**：自动跳转到仪表板页面

### 数据持久化

- **Pinia Store**: 内存中的响应式状态管理
- **localStorage**: 持久化存储认证信息
- **自动同步**: Store 与 localStorage 双向同步

## 登录界面

应用包含一个简约的登录界面，包含以下功能：

### 界面元素

1. **服务器地址输入框**
   - 类型：URL 输入
   - 占位符：`https://your-memos-server.com`
   - 验证：URL 格式验证

2. **访问令牌输入框**
   - 类型：密码输入
   - 占位符：`请输入您的访问令牌`
   - 验证：非空验证

3. **登录按钮**
   - 状态：加载中/正常
   - 功能：提交登录信息

### 功能特性

- ✅ 响应式设计，支持移动端和桌面端
- ✅ 深色模式支持
- ✅ 表单验证
- ✅ 加载状态显示
- ✅ 错误处理和用户反馈
- ✅ 类型安全的 TypeScript 实现
- ✅ 路由导航和状态持久化
- ✅ Pinia 状态管理集成

### 使用说明

1. 在服务器地址输入框中输入您的 Memos 服务器地址
2. 在访问令牌输入框中输入您的访问令牌
3. 点击登录按钮进行认证
4. 系统会自动验证服务器连接和令牌有效性
5. 登录成功后自动跳转到仪表板页面

### 获取访问令牌

访问令牌可以在您的 Memos 服务器设置中找到：

1. 登录到您的 Memos 服务器
2. 进入设置页面
3. 在 API 或开发者选项中找到访问令牌
4. 复制令牌并在客户端中使用

## 项目结构

```
src/
├── components/          # Vue 组件
│   └── LoginForm.vue   # 登录表单组件
├── router/             # 路由配置
│   └── index.ts        # 路由定义和守卫
├── services/           # 服务层
│   └── auth.ts         # 认证服务
├── stores/             # Pinia 状态管理
│   ├── index.ts        # Store 入口
│   └── auth.ts         # 认证状态管理
├── types/              # TypeScript 类型定义
│   └── auth.ts         # 认证相关类型
├── views/              # 页面组件
│   ├── LoginView.vue   # 登录页面
│   ├── DashboardView.vue # 仪表板页面
│   ├── MemosView.vue   # 笔记页面
│   ├── SettingsView.vue # 设置页面
│   └── NotFoundView.vue # 404页面
├── assets/             # 静态资源
├── main.ts             # 应用入口
└── App.vue             # 根组件
```

## 页面说明

### 1. 登录页面 (`/`)
- 用户认证入口
- 服务器连接测试
- 状态持久化
- Pinia store 集成

### 2. 仪表板 (`/dashboard`)
- 用户欢迎界面
- 快速导航
- 用户信息展示
- 退出登录功能

### 3. 笔记页面 (`/memos`)
- 笔记列表展示
- 创建和编辑功能（开发中）
- 搜索和过滤（开发中）

### 4. 设置页面 (`/settings`)
- 主题设置
- 用户信息显示
- 服务器信息显示
- 应用配置

### 5. 404页面
- 友好的错误提示
- 导航返回选项

## 开发指南

### 添加新页面

1. 在 `src/views/` 目录下创建新的 Vue 组件
2. 在 `src/router/index.ts` 中添加路由配置
3. 设置适当的路由守卫和元信息

### 状态管理

- 使用 Pinia 进行全局状态管理
- Store 采用 Composition API 风格
- 响应式状态与 localStorage 双向同步
- 类型安全的 TypeScript 支持

#### 创建新的 Store

```typescript
// src/stores/example.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useExampleStore = defineStore('example', () => {
  // 状态
  const state = ref()
  
  // 计算属性
  const computed = computed(() => state.value)
  
  // 动作
  const action = () => {
    // 逻辑处理
  }
  
  return {
    state,
    computed,
    action
  }
})
```

### 样式指南

- 使用 Tailwind CSS 工具类
- 支持深色模式
- 遵循移动优先的响应式设计
- 确保良好的可访问性

## 贡献

欢迎提交 Issue 和 Pull Request！