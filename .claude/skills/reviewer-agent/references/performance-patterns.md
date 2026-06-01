# 性能问题和优化模式

## 常见性能问题

### 1. N+1 查询问题

```typescript
// ❌ N+1 问题
const users = await db.query('SELECT * FROM users');
for (const user of users) {
  user.posts = await db.query('SELECT * FROM posts WHERE user_id = ?', [user.id]);
}

// ✅ 批量查询
const users = await db.query('SELECT * FROM users');
const posts = await db.query('SELECT * FROM posts WHERE user_id IN (?)', [userIds]);
// 在内存中关联
```

### 2. 大循环中的重复计算

```typescript
// ❌ 每次循环都重新计算
for (let i = 0; i < array.length; i++) {
  const result = heavyComputation(constant);
  // ...
}

// ✅ 提前计算
const cachedResult = heavyComputation(constant);
for (let i = 0; i < array.length; i++) {
  // 使用 cachedResult
}
```

### 3. 内存泄漏

```typescript
// ❌ 事件监听器未清理
useEffect(() => {
  window.addEventListener('resize', handleResize);
}, []);

// ✅ 清理事件监听器
useEffect(() => {
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

---

## React 性能优化

### 1. 不必要的重渲染

```typescript
// ❌ 内联函数导致重渲染
<Button onClick={() => handleClick(id)} />

// ✅ 使用 useCallback
const handleClick = useCallback((id) => {
  // ...
}, [dependency]);
```

### 2. 缺少 memo

```typescript
// ❌ 父组件更新时子组件也会更新
const ChildComponent = ({ data }) => { ... }

// ✅ 使用 memo 避免不必要更新
const ChildComponent = React.memo(({ data }) => { ... })
```

### 3. 大列表渲染

```typescript
// ❌ 渲染大量数据
{items.map(item => <Item key={item.id} {...item} />)}

// ✅ 使用虚拟列表
import { FixedSizeList } from 'react-window';
<FixedSizeList height={600} itemCount={items.length} itemSize={35}>
  {({ index, style }) => <Item style={style} {...items[index]} />}
</FixedSizeList>
```

---

## 数据库性能

### 1. 缺少索引

```sql
-- ❌ 全表扫描
SELECT * FROM orders WHERE user_id = 123;

-- ✅ 添加索引
CREATE INDEX idx_user_id ON orders(user_id);
```

### 2. 查询过多字段

```sql
-- ❌ 查询所有字段
SELECT * FROM users;

-- ✅ 只查询需要的字段
SELECT id, name, email FROM users;
```

---

## 网络性能

### 1. 请求瀑布流

```typescript
// ❌ 串行请求
const user = await fetchUser();
const posts = await fetchPosts(user.id);

// ✅ 并行请求
const [user, posts] = await Promise.all([
  fetchUser(),
  fetchPosts(userId) // 如果 userId 已知
]);
```

### 2. 缺少缓存

```typescript
// ❌ 每次都请求
const data = await fetch('/api/data');

// ✅ 使用缓存
const data = await fetch('/api/data', {
  headers: { 'Cache-Control': 'max-age=3600' }
});
```

---

## 性能评分标准

| 评分 | 标准 |
|------|------|
| 9-10 | 无性能问题，有优化亮点 |
| 7-8 | 无严重问题，有小优化空间 |
| 5-6 | 有中等性能问题 |
| 3-4 | 有严重性能问题 |
| 1-2 | 存在致命性能问题 |
