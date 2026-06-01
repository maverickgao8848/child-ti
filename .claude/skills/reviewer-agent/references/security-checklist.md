# 安全审查清单

## 注入漏洞

### SQL 注入
- [ ] 检查是否使用参数化查询
- [ ] 避免字符串拼接 SQL
- [ ] 使用 ORM 的安全方法

```typescript
// ❌ 危险
const query = `SELECT * FROM users WHERE id = ${userId}`;

// ✅ 安全
const query = 'SELECT * FROM users WHERE id = ?';
db.query(query, [userId]);
```

### XSS (跨站脚本)
- [ ] 用户输入是否转义
- [ ] 避免使用 `dangerouslySetInnerHTML`
- [ ] CSP 头配置正确

### 命令注入
- [ ] 避免拼接用户输入到 shell 命令
- [ ] 使用安全的 API 替代 shell 执行

---

## 认证与授权

### 密码安全
- [ ] 密码使用 bcrypt/argon2 哈希
- [ ] 不存储明文密码
- [ ] 密码强度验证

### 会话管理
- [ ] 使用安全的 session ID
- [ ] 设置合理的过期时间
- [ ] HTTPS only cookies
- [ ] HttpOnly flag

### 权限检查
- [ ] 每个敏感操作都有权限验证
- [ ] 不信任客户端传来的权限信息
- [ ] 最小权限原则

---

## 数据安全

### 敏感数据处理
- [ ] 不在日志中记录敏感信息
- [ ] 不在 URL 中传递敏感数据
- [ ] 敏感配置使用环境变量

### API 密钥管理
- [ ] 不硬编码 API 密钥
- [ ] 使用密钥管理服务
- [ ] 定期轮换密钥

---

## 依赖安全

- [ ] 检查 npm audit / pip audit
- [ ] 更新有漏洞的依赖
- [ ] 锁定依赖版本

---

## 配置安全

- [ ] DEBUG 模式生产环境关闭
- [ ] 错误信息不暴露堆栈
- [ ] 安全头配置 (HSTS, X-Frame-Options 等)
