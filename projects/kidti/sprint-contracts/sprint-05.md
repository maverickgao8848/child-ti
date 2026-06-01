# Sprint #5 — 美术资源 + Cloudflare Pages 部署（Runtime Layer）

## Sprint #5

**goal:** 生成/收集全部美术资源，完成项目目录组织，部署到 Cloudflare Pages 并通过端到端验收。

**impl:**
1. **人格配图**：生成或获取 24 张 Low Poly 3D + 手绘涂鸦风格人格配图，正方形 1:1，WebP 格式，按 `assets/personas/persona-{code}.webp` 命名存放。
2. **OG 分享图**：
   - `assets/og-share-square.png`：600×600px，正方形
   - `assets/og-share-wide.png`：1200×630px，横版
3. **首页背景纹理**：`assets/bg-texture.webp`，旧作业本纸张纹理，可无缝平铺。
4. **资源压缩**：所有 WebP 图片经压缩后进入项目；PNG 仅用于 OG 卡片（必须透明场景）。
5. **目录结构整理**：
   ```
   /
   ├── index.html              # 主文件（含内联 CSS/JS）
   ├── assets/
   │   ├── personas/           # 24 张人格配图
   │   ├── og-share-square.png
   │   ├── og-share-wide.png
   │   └── bg-texture.webp
   └── kjua.min.js             # 二维码库
   ```
6. **部署配置**：Cloudflare Pages 直接部署静态文件（无构建命令，输出目录 `/`）。
7. **缓存策略**：HTML `no-cache`；图片/字体 `max-age=31536000`。
8. **端到端测试**：完整走通「首页 → 答题 → 结果 → 分享 → 深链访问」全流程。
9. **性能验证**：Lighthouse 首屏加载 < 1s；单文件（不含图片）< 500KB。
10. **安全审查**：确认无密钥硬编码、无敏感信息泄露。

**criteria:**
1. `assets/personas/` 下存在 24 个 `.webp` 文件，命名与 PRD 附录 `PERSONAS` 的 24 个代号一一对应。
2. `assets/og-share-square.png` 尺寸为 600×600，`assets/og-share-wide.png` 尺寸为 1200×630。
3. `assets/bg-texture.webp` 可作为 CSS `background-image` 无缝平铺，无可见接缝。
4. 访问 `kidti.pages.dev` 首页正常加载，品牌信息、CTA 按钮、背景纹理均正确显示。
5. 完整答题流程（24 题）到结果页无 JavaScript 报错。
6. 结果页人格配图正确加载（无 404）。
7. 分享海报生成正常，二维码可扫描。
8. 直接访问 `?code=ELON` 深链，结果页直接展示 ELON「暴君幼体」。
9. Lighthouse Performance 评分 ≥ 90，首屏加载时间 < 1s（3G 网络模拟）。
10. Cloudflare Web Analytics 已启用，可追踪 PV/UV/页面停留路径。
11. 通过 `security-review` skill 检查：无密钥入源码、无敏感信息、OG 图片 URL 为公开可访问地址。

**layer:** runtime

**blocked_by:** Sprint #4
