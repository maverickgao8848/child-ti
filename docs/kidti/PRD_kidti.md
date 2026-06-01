# 产品需求文档 (PRD) - 儿童TI (KidTI)

> 项目代号：kidti  
> 对外品牌：儿童TI  
> 域名：kidti.pages.dev  
> 日期：2026-06-01  
> 版本：MVP v1.0

---

## 1. 背景与目标 (Background & Goals)

### 1.1 是什么

儿童TI 是一款**纯前端单页人格测试应用**。用户回答 24 道童年情境选择题，系统根据 4 维度计分模型匹配出 1 种"童年人格"，生成带分享卡片的结果页。

核心定位：**不是儿童心理学测评，而是一份"童年创伤回忆录"**——用成年人的视角，笑着说出小时候那些其实挺惨的真相。

### 1.2 解决什么问题

- **用户情绪出口**：六一节点，18-35 岁互联网用户存在强烈的童年怀旧 + 自嘲情绪，缺乏低成本、高共鸣的释放方式
- **社交传播素材**：结果页的荒诞命名（KPBL、TNT、ELON 等）和黑色幽默 Slogan 具备强社交货币属性，天然适合微信群/朋友圈传播

### 1.3 成功标准

| 指标 | 目标值 | 测量方式 |
|---|---|---|
| 完成率 | ≥ 70% | Cloudflare Web Analytics，页面停留路径 |
| 分享率 | ≥ 15% | 分享按钮点击事件 + 链接复制事件 |
| 微信兼容性 | 100% | iOS/Android 微信内置浏览器手动测试 |
| 首屏加载 | < 1s | Lighthouse / WebPageTest |

---

## 2. 目标用户 (Target Audience)

### 2.1 用户画像

- **年龄**：18-35 岁
- **身份**：互联网原住民，活跃于微信/微博/小红书
- **心理特征**：对童年有复杂情感（怀旧 + 自嘲 + 轻微创伤），习惯用"自黑"进行社交表达
- **使用场景**：微信群闲聊时点击链接、朋友圈看到好友分享后好奇测试、微博/小红书话题参与

### 2.2 核心策略

**零门槛、快传播**：
- 无需注册/登录
- 24 题 3-5 分钟完成
- 结果即出即分享
- 单文件部署，任何网络环境秒开

---

## 3. 需求范围 (Scope)

### 3.1 In Scope（MVP 必做）

| # | Feature | 说明 |
|---|---|---|
| 1 | 24 种人格体系 | 4 维度 × (2+2+2+3) = 24 种，含代号、中文名、定义、Slogan |
| 2 | 24 道题目 | 每题 4 选项，选项带多维度分数偏移 |
| 3 | 三视图 SPA | 首页 → 答题页 → 结果页，纯原生 HTML/CSS/JS 单文件 |
| 4 | 计分与人格匹配 | D1/D2/D3 简单高低判定，D4 特殊矛盾检测法判定 FOG |
| 5 | 结果页维度可视化 | 4 条进度条展示用户在各维度的偏向程度 |
| 6 | 分享海报生成 | HTML5 Canvas 生成带二维码的分享图片 |
| 7 | 深链分享 | 结果页 URL 带 `?code=KPBL` 参数，打开直接跳对应人格 |
| 8 | OG 分享卡片 | 微信/社交平台分享时显示标题+描述+封面图 |
| 9 | 24 张人格配图 | Low Poly 3D + 手绘涂鸦风格，正方形 1:1 |
| 10 | Cloudflare Pages 部署 | 含自定义域名、HTTPS、Web Analytics |

### 3.2 Out of Scope（不涉及 / 未来做）

| Feature | 说明 | 计划版本 |
|---|---|---|
| 英文版 / i18n | 代码结构预留扩展点，本次仅中文 | V2 |
| 组合人格 | 如"KPBL-x-TNT"主次人格显示 | V2 |
| 童年诊断书长图 | 基于结果生成长图文报告 | V2 |
| 好友对比 | 输入两个人格代号生成相处分析 | V2 |
| 年度复测 / 历史记录 | 保存多次测试结果并对比 | V2 |
| 后端统计 API | 仅依赖 Cloudflare Web Analytics | — |
| 用户账号系统 | 完全不涉及 | — |

---

## 4. 技术栈 (Tech Stack)

### 4.1 选型总览

| 层级 | 技术选择 | 选型理由 |
|---|---|---|
| **前端框架** | 纯原生 HTML5 + CSS3 + ES6+（单文件） | 零构建步骤、首屏极快、微信内置浏览器兼容性最佳、无依赖风险 |
| **状态管理** | 原生 JS 对象 + `localStorage`（可选） | 题目答案、计分状态全部驻留内存；`localStorage` 仅用于防刷新丢进度（可选） |
| **路由** | URL `hash` 或 `?view=` 查询参数 | 单文件无 History API 需求；首页/答题/结果通过显隐 DOM 节点切换 |
| **二维码生成** | [kjua](https://github.com/lrsjng/kjua)（纯 JS，~8KB gzip） | 无需后端，前端 Canvas 直接生成；与分享海报的 Canvas 绘制同技术栈 |
| **分享海报** | HTML5 Canvas 2D API | 前端直接绘制，无需服务端截图服务；图片合成后调用 `canvas.toBlob()` 触发下载/分享 |
| **部署平台** | Cloudflare Pages | 免费、全球 CDN、自动 HTTPS、微信域名不拦截、与 `kidti.pages.dev` 子域名天然适配 |
| **数据分析** | Cloudflare Web Analytics（免费版） | 不暴露用户隐私、无 Cookie 横幅、不增加页面体积、自带基础 PV/UV/路径分析 |
| **字体** | 系统字体栈 | 无网络字体请求，避免字体加载阻塞首屏；`-apple-system, "PingFang SC", "Microsoft YaHei"` |
| **图片格式** | WebP（主）+ PNG 回退 | 人格配图体积大，WebP 压缩率高；PNG 仅用于必须透明且无法 SVG 的场景（如 OG 卡片） |
| **构建工具** | 无 | 手写单文件，直接提交 `index.html`；如需压缩可用任意在线 HTML/CSS/JS minifier |

### 4.2 前端架构

**单文件结构**：
```
index.html
├── <style>   /* CSS：变量定义 + 三视图布局 + 动画 + 微信适配 */
├── <body>    /* DOM：三个视图容器（首页 / 答题页 / 结果页），默认只显示首页 */
└── <script>  /* JS：题目数据 + 计分逻辑 + 视图切换 + Canvas 海报 + 二维码 */
```

**运行流程**：
1. 解析 URL 参数：`?code=KPBL` → 直接渲染结果页；无参数 → 显示首页
2. 首页点击"开始测试" → 重置分数数组 → 显示答题页 → 渲染第 1 题
3. 答题页选中选项 → 记录答案 + 累加计分 → 自动渲染下一题；最后一题 → 计算人格 → 渲染结果页
4. 结果页点击"分享给朋友" → Canvas 合成海报 → 生成 Blob → 触发下载
5. 结果页点击"重新测试" → 清空状态 → 回到首页

**状态对象**（内存驻留，刷新丢失）：
```javascript
const state = {
  currentQuestion: 0,      // 当前题号 0-23
  answers: [],             // 每题选中的选项索引 [0, 2, 1, ...]
  scores: { NRG: 0, RUL: 0, PRE: 0, EMO: 0 },  // 四维度累积分
  personaCode: null,       // 最终匹配的人格代号
};
```

### 4.3 关键依赖

**唯一外部库：kjua（二维码生成）**
- 引入方式：CDN 或本地拷贝 `kjua.min.js`
- 使用场景：结果页二维码 + 分享海报底部二维码
- 回退方案：如 kjua 加载失败，隐藏二维码区域，保留链接复制功能

**无其他依赖**：
- 无 jQuery / Vue / React
- 无 CSS 框架（Tailwind / Bootstrap）
- 无构建工具（Webpack / Vite / Rollup）
- 无图标库（使用 SVG 内联或 Unicode emoji）

### 4.4 部署配置

**Cloudflare Pages 设置**：
- 构建命令：无（直接部署静态文件）
- 输出目录：`/`
- 根文件：`index.html`
- 自定义域名：`kidti.pages.dev`（后续可绑定独立域名）
- HTTPS：强制（Cloudflare 默认）
- 缓存策略：HTML `no-cache`；图片/字体 `max-age=31536000`

**资源目录建议**（部署时相对路径）：
```
/
├── index.html              # 主文件（含 JS/CSS）
├── assets/
│   ├── personas/           # 24 张人格配图（persona-kpbl.webp ...）
│   ├── og-share-square.png # OG 分享方图
│   ├── og-share-wide.png   # OG 分享横图
│   └── bg-texture.webp     # 首页背景纹理
└── kjua.min.js             # 二维码库（可选 CDN）
```

### 4.5 微信适配要点（技术侧）

| 问题 | 解决方案 |
|---|---|
| 双指缩放 | `user-scalable=no` + `min/max-scale=1` |
| 300ms 点击延迟 | `touch-action: manipulation` |
| iOS 输入框聚焦缩放 | 所有输入元素（如有）`font-size: 16px` |
| 刘海屏安全区 | `viewport-fit=cover` + `env(safe-area-inset-*)` |
| 点击高亮 | `-webkit-tap-highlight-color: transparent` |
| 微信分享卡片 | 完整 OG `meta` 标签（见 5.5） |

---

## 5. 核心功能详述 (Functional Requirements)

### 5.1 人格体系（已设计完成，直接落地）

#### 5.1.1 四维度定义

| 维度 | 代号 | 极A | 极B | 判定规则 |
|---|---|---|---|---|
| D1 能量源 | `NRG` | **BATTERY**（充电型） | **REACTOR**（放电型） | 总分高 = BATTERY，低 = REACTOR |
| D2 规则观 | `RUL` | **SHEEP**（顺毛型） | **WOLF**（反骨型） | 总分高 = SHEEP，低 = WOLF |
| D3 存在感 | `PRE` | **BLACKHOLE**（黑洞型） | **SPOTLIGHT**（聚光型） | 总分高 = BLACKHOLE，低 = SPOTLIGHT |
| D4 情绪天气 | `EMO` | **STORM**（暴雨型） | **LAKE**（静海型） | **FOG**（迷雾型） | 特殊矛盾检测法（见 5.1.2） |

#### 5.1.2 D4 FOG 判定逻辑

1. 提取用户所有 D4 相关题目的答案分值
2. 计算答案分布的方差
3. **方差 > 阈值**（答案在"极度外放"和"极度内敛"之间反复横跳）→ **FOG**
4. **方差 ≤ 阈值 且 均值偏高** → **STORM**
5. **方差 ≤ 阈值 且 均值偏低** → **LAKE**

> 阈值需在题目文案确定后，根据选项分值范围校准。建议初始值：方差阈值取 D4 题目数量 × 单题最大偏移² × 0.25。

#### 5.1.3 人格映射表

根据 D1/D2/D3/D4 的组合直接查表定位（4 象限 × 6 人格 = 24 格）：

| D1+D2 | D3=BLACKHOLE, D4=STORM | D3=BLACKHOLE, D4=LAKE | D3=BLACKHOLE, D4=FOG | D3=SPOTLIGHT, D4=STORM | D3=SPOTLIGHT, D4=LAKE | D3=SPOTLIGHT, D4=FOG |
|---|---|---|---|---|---|---|
| BATTERY + SHEEP | **KPBL** | **WALL** | **IMOK** | **KPI** | **DAREN** | **CTRLC** |
| BATTERY + WOLF | **NUKE** | **DAMN** | **NEIG** | **TNT** | **STUDY** | **GODD** |
| REACTOR + SHEEP | **GLUE** | **502ER** | **RUOK?** | **JOKER** | **MAPI** | **TRUMP** |
| REACTOR + WOLF | **CHAOS** | **STEAM** | **IPHONE** | **BOSS** | **YINM** | **ELON** |

### 5.2 题目系统（待 Generator 实现）

#### 5.2.1 题目结构规范

```
总题数：24 题（每维度 6 题）
每题：1 个情境描述 + 4 个选项（A/B/C/D）
每选项：文本 + 维度分数偏移标记
```

#### 5.2.2 计分规则

- 每题每个选项可标记 **1~2 个维度的分数偏移**
- 偏移值建议：+1 / +2（正向）或 -1 / -2（负向）
- 最终维度总分 = 该维度所有偏移值累加
- D1/D2/D3 直接比较总分正负/高低判定极性
- D4 按 4.1.2 矛盾检测法判定

#### 5.2.3 题目风格约束

- **情境化**：场景必须让成年人瞬间穿越回小学/初中（如"课间操时""家长会之后"）
- **无评判感**：所有选项都是"合理"的，避免用户有"被诊断"的压力
- **黑色幽默选项**：每个选项都要有"笑着扎心"的质感
- **童年感**：禁用抽象心理学术语，用具体动作/场景替代

#### 5.2.4 题目示例（1 题）

```
题目：老师突然宣布随堂测验，你的第一反应是？

A. 立刻拿出课本复习（D2+SHEEP, D3+SPOTLIGHT）
B. 心里骂街但默默接受（D1+BATTERY, D2+SHEEP）
C. 直接问"可以拒绝吗"（D2+WOLF, D3+SPOTLIGHT）
D. 把书包里的漫画拿出来看（D2+WOLF, D1+REACTOR）
```

### 5.3 三视图 SPA 页面

#### 5.3.1 首页 (Start Page)

**触发条件**：用户首次访问（无 `?code=` 参数）

**页面元素**：
- 品牌标题："儿童 TI"
- 副标题："你是什么儿童？"
- 核心信息："24 道题，测出你的童年人格"
- CTA 按钮："开始测试"
- 底部免责声明："纯属娱乐 · 无心理学背书"

**行为**：
- 点击"开始测试" → 进入答题页，题号重置为 1

#### 5.3.2 答题页 (Quiz Page)

**触发条件**：首页点击"开始测试"，或从结果页点击"重新测试"

**页面元素**：
- 品牌标题（弱化）
- 进度："第 N 题 / 共 24 题" + 进度条
- 题目文本区
- 4 个单选选项（A/B/C/D）
- "上一题"按钮（第 1 题时禁用/隐藏）

**行为**：
- 选中选项后**自动进入下一题**（无需点击"下一题"按钮）
- 支持点击"上一题"返回修改，保留已选答案
- 第 24 题选中后 → 自动跳转结果页

**校验规则**：
- 每题必须且只能选 1 个选项
- 返回上一题修改后，新选择覆盖旧选择，重新累加计分

#### 5.3.3 结果页 (Result Page)

**触发条件**：答完第 24 题；或直接访问带 `?code=KPBL` 的深链

**页面元素**：
- 品牌标题
- 人格配图（正方形，占首屏视觉中心）
- 人格代号（大字号，如"KPBL"）
- 中文名（如"我没事型"）
- 一句话定义
- 详细解读文本（2-3 段）
- 黑色幽默 Slogan（引用式展示）
- 维度解读区：4 条进度条 + 维度标签
- 操作区："分享给朋友"、"重新测试"
- 二维码区：当前页面二维码 + "扫码测测你是什么儿童"

**行为**：
- 深链访问（`?code=XXX`）→ 直接展示对应人格，跳过答题流程
- "重新测试" → 清空所有答题记录和分数，回到首页
- "分享给朋友" → 触发分享海报生成（见 5.4）

### 5.4 分享海报生成

**触发条件**：结果页点击"分享给朋友"

**生成方式**：HTML5 Canvas 前端绘制

**海报内容**：
- 顶部：品牌名 "儿童TI"
- 中间：人格配图（缩小版）
- 人格代号 + 中文名
- 一句话定义
- Slogan（精选一句）
- 底部：二维码（当前结果页 URL）+ "扫码测测你是什么儿童"

**技术约束**：
- 海报尺寸：建议 750×1334 px（适配手机截图分享）
- 二维码生成库：kjua（纯 JS，无需后端）
- 绘制时需注意跨域图片问题（人格配图需同域或配置 CORS）

### 5.5 OG 分享卡片

**触发条件**：微信/社交平台抓取页面元数据

**实现**：HTML `<meta>` 标签

```html
<meta property="og:title" content="儿童TI — 你是什么儿童？">
<meta property="og:description" content="24道题测出你的童年人格。纯属娱乐，不构成育儿建议。">
<meta property="og:image" content="https://kidti.pages.dev/assets/og-share-square.png">
<meta property="og:image:width" content="600">
<meta property="og:image:height" content="600">
```

**资源需求**：
- `og-share-square.png`：600×600，正方形
- `og-share-wide.png`：1200×630，横版（部分平台使用）

### 5.6 微信适配

**Viewport**：
```html
<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, viewport-fit=cover, user-scalable=no">
```

**CSS 约束**：
- `touch-action: manipulation`：消除 300ms 点击延迟
- 输入框（如有）`font-size: 16px`：避免 iOS 聚焦强制缩放
- `-webkit-tap-highlight-color`：自定义点击反馈
- `env(safe-area-inset-*)`：刘海屏安全区适配

---

## 6. 资源清单 & 生成提示词（供 resource-inventory 使用）

### 6.1 题目文案生成规范

**交付物**：24 道完整题目（每维度 6 题），Markdown 表格格式

**每题字段**：
| 字段 | 说明 |
|---|---|
| 题号 | 1-24 |
| 维度归属 | D1/D2/D3/D4（标注主要考查维度） |
| 题目文本 | 童年情境描述 |
| 选项A | 文本 + 维度偏移标记 |
| 选项B | 文本 + 维度偏移标记 |
| 选项C | 文本 + 维度偏移标记 |
| 选项D | 文本 + 维度偏移标记 |

**生成要求**：
- D1 题目：聚焦"社交后状态、独处偏好、精力来源"
- D2 题目：聚焦"对权威的反应、作弊/撒谎选择、规矩的态度"
- D3 题目：聚焦"上台表演、小组讨论、被忽视时的反应"
- D4 题目：聚焦"情绪外露程度、恢复速度、反差行为"（需设计极端矛盾选项以触发 FOG）
- 每题 4 个选项必须覆盖不同的维度组合，避免所有选项只影响单一维度

### 6.2 人格配图生成提示词

**交付物**：24 张正方形 1:1 图片

**统一风格前缀**（每张图必须包含）：
```
Low Poly 3D character style, hand-drawn doodle overlays, 
crayon lines, watercolor stains, pencil sketch texture, 
muted candy colors with ironic tone, childhood nostalgia with dark humor, 
square composition, solid color background, clean edges
```

**24 张图独立提示词**：

| 代号 | 提示词（主体描述，接在统一前缀后） |
|---|---|
| KPBL | A capybara-shaped child, vacant expression, silent tears rolling down cheeks, emotional shutdown pose, muted coral and gray tones |
| WALL | A child displayed inside a glass trophy case, body covered in award stickers and certificates, expressionless face, no emotion in eyes |
| IMOK | A perfect porcelain doll child, fine cracks spreading across body, smiling mouth but hollow empty eyes, eerie perfection |
| KPI | A child staring at a ranking chart on wall, holding a 99-point exam paper, face twisted in anguish, obsessive perfectionist energy |
| DAREN | A child wearing an oversized business suit, holding a folder, standing next to kids playing in mud, serious adult-like posture |
| CTRLC | A child wearing a happy smile mask, shadow behind shows a crying face, copy-paste identical expressions, identity loss theme |
| NUKE | A child hiding behind a door, holding chewing gum, half face peeking out with mischievous grin, silent threat energy |
| DAMN | A child with deadpan expression, shrugging shoulders, speech bubble with "damn" text, cold indifferent aura |
| NEIG | A child with angel halo and sweet smile, but snake tail visible behind, two-faced betrayer aesthetic |
| TNT | A child with torn exam papers flying around, messy wild hair, maniacal laughter, explosive chaos energy |
| STUDY | A child with thick glasses, hand raised high, teacher in background with headache expression, logic rebel pose |
| GODD | A child standing on top of desk, classmates raising hands to follow, charismatic troublemaker leader pose |
| GLUE | A child in puppy-like clinging pose, teary eyes, desperately hugging someone's leg, overly attached energy |
| 502ER | A child with various objects stuck to body, stretched and deformed shape, still smiling despite distortion |
| RUOK? | A child's face split half smiling and half crying, chameleon skin texture, unpredictable mood switch |
| JOKER | A child with clown nose, exaggerated huge smile, standing alone at center of empty stage, performative sadness |
| MAPI | A child standing next to teacher holding a notebook, classmates keeping distance, teacher's pet pose |
| TRUMP | A child in dark shadows, holding conspiracy blueprint, sinister smirk, child politician manipulating playground |
| CHAOS | A child hiding in corner, holding eraser crumbs, secretly giggling, objects around spontaneously breaking |
| STEAM | A child wearing headphones, face illuminated by blue screen glow, holding game controller, surrounded by snack bags |
| IPHONE | A child holding latest smartphone, mirror reflection glow, crowd of envious kids in background, silent mysterious pose |
| BOSS | A child at center of tornado, objects flying around, arms spread laughing wildly, floating health bar above head |
| YINM | A child with exposed brain, chess piece gestures, classmates as chess pieces on giant board, cold calculated strategist |
| ELON | A child sitting on rocket model, holding Mars map, kids kneeling below in worship, charismatic tyrant child pose |

**附加资源**：

| 资源 | 规格 | 提示词 |
|---|---|---|
| OG 分享方图 | 600×600 | "儿童TI 品牌封面，Low Poly 3D 风格，一个神秘的儿童剪影站在作业本背景上，标题'你是什么儿童？'，珊瑚红和薄荷绿配色，手绘涂鸦边框" |
| OG 分享横图 | 1200×630 | "儿童TI 品牌横幅，多个 Low Poly 3D 儿童角色并排站立，表情各异，作业本纸张纹理背景，标题'24道题测出你的童年人格'" |
| 首页背景纹理 | 可平铺 | "旧作业本纸张纹理，轻微泛黄，铅笔草稿痕迹，橡皮擦残留，可无缝平铺，低饱和度" |

---

## 7. 非功能性需求

### 7.1 性能

- 首屏加载 < 1s（单文件 < 500KB，不含图片）
- 人格配图懒加载：结果页只加载当前人格配图，其余不加载
- 分享海报生成 < 2s

### 7.2 兼容性

- iOS Safari 12+
- Android Chrome 80+
- 微信内置浏览器（iOS + Android）
- 不支持 IE

### 7.3 部署

- 平台：Cloudflare Pages
- 域名：kidti.pages.dev（可后续绑定自定义域名）
- HTTPS：强制
- 分析：Cloudflare Web Analytics（免费版）

---

## 8. 附录：人格数据速查表（供 Generator 直接引用）

```javascript
const PERSONAS = {
  // 象限一：BATTERY + SHEEP
  "KPBL":  { name: "我没事型", d1: "BATTERY", d2: "SHEEP", d3: "BLACKHOLE", d4: "STORM",  slogan: "像水豚一样情绪稳定——稳定到连崩溃都是静音的" },
  "WALL":  { name: "奖状陈列品", d1: "BATTERY", d2: "SHEEP", d3: "BLACKHOLE", d4: "LAKE",   slogan: "你是奖品收集者，一面墙都是你的战利品——但你不知道自己在打什么仗" },
  "IMOK":  { name: "我很好型", d1: "BATTERY", d2: "SHEEP", d3: "BLACKHOLE", d4: "FOG",    slogan: "'I'm OK' 是每个乖孩子的第二句谎言——比'I'm fine' 更熟练" },
  "KPI":   { name: "排名奴隶", d1: "BATTERY", d2: "SHEEP", d3: "SPOTLIGHT", d4: "STORM",  slogan: "你人生的意义是一个数字，而且这个数字还不是你的" },
  "DAREN": { name: "实习大人", d1: "BATTERY", d2: "SHEEP", d3: "SPOTLIGHT", d4: "LAKE",   slogan: "别的小朋友在玩泥巴，你在写会议纪要" },
  "CTRLC": { name: "赝品小孩", d1: "BATTERY", d2: "SHEEP", d3: "SPOTLIGHT", d4: "FOG",    slogan: "Ctrl+C 你的人生，Ctrl+V 你的表情" },
  // 象限二：BATTERY + WOLF
  "NUKE":  { name: "闷声大雷", d1: "BATTERY", d2: "WOLF", d3: "BLACKHOLE", d4: "STORM",  slogan: "你是沉默的核武器——不发射，但所有人都知道你有" },
  "DAMN":  { name: "背后冷刀", d1: "BATTERY", d2: "WOLF", d3: "BLACKHOLE", d4: "LAKE",   slogan: "你的沉默不是金，是淬了毒的刀" },
  "NEIG":  { name: "幽灵叛徒", d1: "BATTERY", d2: "WOLF", d3: "BLACKHOLE", d4: "FOG",    slogan: "你是所有人的好朋友，直到投票那天" },
  "TNT":   { name: "野生熊孩子", d1: "BATTERY", d2: "WOLF", d3: "SPOTLIGHT", d4: "STORM",  slogan: "老师看到你的背影就开始头痛" },
  "STUDY": { name: "聪明反骨", d1: "BATTERY", d2: "WOLF", d3: "SPOTLIGHT", d4: "LAKE",   slogan: "你用三段论证明了老师错了，然后被罚站" },
  "GODD":  { name: "暴动领袖", d1: "BATTERY", d2: "WOLF", d3: "SPOTLIGHT", d4: "FOG",    slogan: "你是 God-tier 的麻烦制造者" },
  // 象限三：REACTOR + SHEEP
  "GLUE":  { name: "人形牛皮糖", d1: "REACTOR", d2: "SHEEP", d3: "BLACKHOLE", d4: "STORM",  slogan: "你是人际关系里的工业粘合剂——用力过猛，粘完就废" },
  "502ER": { name: "502精", d1: "REACTOR", d2: "SHEEP", d3: "BLACKHOLE", d4: "LAKE",   slogan: "502胶水都没你粘得紧" },
  "RUOK?": { name: "情绪开关", d1: "REACTOR", d2: "SHEEP", d3: "BLACKHOLE", d4: "FOG",    slogan: "今天你是天使，明天你是恶魔——全看谁在看着你" },
  "JOKER": { name: "班级小丑", d1: "REACTOR", d2: "SHEEP", d3: "SPOTLIGHT", d4: "STORM",  slogan: "你负责搞笑，大家负责笑，没人负责记住你的名字" },
  "MAPI":  { name: "老师爱宠", d1: "REACTOR", d2: "SHEEP", d3: "SPOTLIGHT", d4: "LAKE",   slogan: "你是老师最信任的耳目，也是同学最不想同桌的存在" },
  "TRUMP": { name: "儿童政客", d1: "REACTOR", d2: "SHEEP", d3: "SPOTLIGHT", d4: "FOG",    slogan: "Make Playground Great Again" },
  // 象限四：REACTOR + WOLF
  "CHAOS": { name: "恶作剧永动机", d1: "REACTOR", d2: "WOLF", d3: "BLACKHOLE", d4: "STORM",  slogan: "你是行走的混沌本身，所到之处秩序自动瓦解" },
  "STEAM": { name: "冷静钻头", d1: "REACTOR", d2: "WOLF", d3: "BLACKHOLE", d4: "LAKE",   slogan: "你不生气，你只是冷静地把遥控器拆了，然后装不回去" },
  "IPHONE":{ name: "人形黑洞", d1: "REACTOR", d2: "WOLF", d3: "BLACKHOLE", d4: "FOG",    slogan: "你不说话，你不表情，你只是盯着人看。然后东西就坏了" },
  "BOSS":  { name: "混沌魔王", d1: "REACTOR", d2: "WOLF", d3: "SPOTLIGHT", d4: "STORM",  slogan: "你是最终Boss，出场自带灾难片BGM" },
  "YINM":  { name: "冷面棋手", d1: "REACTOR", d2: "WOLF", d3: "SPOTLIGHT", d4: "LAKE",   slogan: "你今天让全班罢课，明天让家长联名上书——全是计划" },
  "ELON":  { name: "暴君幼体", d1: "REACTOR", d2: "WOLF", d3: "SPOTLIGHT", d4: "FOG",    slogan: "历史书上的暴君，小时候都长你这样" },
};
```
