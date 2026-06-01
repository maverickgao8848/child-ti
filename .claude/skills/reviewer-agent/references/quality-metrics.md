# 代码质量评估标准

## 代码规范

### 命名规范
- [ ] 变量名有意义，避免 a, b, x 等
- [ ] 函数名使用动词或动词短语
- [ ] 类名使用名词
- [ ] 常量使用大写蛇形命名
- [ ] 布尔变量使用 is/has/can 前缀

```typescript
// ❌ 差命名
const a = users.filter(u => u.active);
function process(d) { ... }

// ✅ 好命名
const activeUsers = users.filter(user => user.isActive);
function validateUserCredentials(credentials) { ... }
```

### 代码格式
- [ ] 一致的缩进
- [ ] 合理的空行
- [ ] 行长度不超过限制（通常 100-120 字符）
- [ ] 大括号风格一致

---

## 错误处理

### 异常捕获
- [ ] 不使用空的 catch 块
- [ ] 捕获具体的异常类型
- [ ] 记录错误信息
- [ ] 提供有意义的错误消息

```typescript
// ❌ 空捕获
try {
  doSomething();
} catch (e) {}

// ✅ 正确处理
try {
  doSomething();
} catch (error) {
  logger.error('Failed to do something', { error, context });
  throw new BusinessError('操作失败，请稍后重试');
}
```

### 边界情况
- [ ] 处理 null/undefined
- [ ] 处理空数组/对象
- [ ] 处理边界值（0, -1, 最大值等）

---

## 测试覆盖

### 单元测试
- [ ] 核心逻辑有测试覆盖
- [ ] 边界情况有测试
- [ ] 异常路径有测试
- [ ] 测试命名清晰

### 测试质量
- [ ] 测试独立，不互相依赖
- [ ] 测试可重复
- [ ] 测试快速
- [ ] 使用 mock 隔离外部依赖

---

## 类型安全 (TypeScript)

- [ ] 避免使用 any
- [ ] 使用严格模式
- [ ] 正确处理可能为 null 的值
- [ ] 使用类型推断而非显式注解（简单情况）

```typescript
// ❌ 使用 any
function process(data: any) { ... }

// ✅ 使用具体类型
interface UserData {
  id: string;
  name: string;
}
function process(data: UserData) { ... }
```

---

## 代码重复

- [ ] 没有复制粘贴的代码
- [ ] 重复逻辑已抽象
- [ ] 遵循 DRY 原则

```typescript
// ❌ 重复代码
function validateEmail(email) { ... }
function validateUserEmail(email) { ... } // 几乎相同

// ✅ 抽象公共逻辑
function validateEmail(email, options = {}) { ... }
```

---

## 质量评分标准

| 评分 | 标准 |
|------|------|
| 9-10 | 代码规范优秀，有测试，无重复，错误处理完善 |
| 7-8 | 代码规范良好，有基本测试，小问题不影响可读性 |
| 5-6 | 有命名/格式问题，缺少测试，有一定重复 |
| 3-4 | 命名混乱，无测试，大量重复，错误处理缺失 |
| 1-2 | 代码难以理解，存在严重质量问题 |
