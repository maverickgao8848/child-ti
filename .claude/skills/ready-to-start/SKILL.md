---
name: ready-to-start
description: >-
  项目启动过渡 skill，准备阶段完成后正式启动三 Agent 开发循环。
  负责目录结构确认、环境配置、技术检查。触发词：ready to start、项目启动、开始开发、start dev。
---

---

# /ready-to-start — 从准备到开发的过渡仪式

在所有前期探索（crazy-realist-friend → patient-pm → ia-planner → visual-explorer → ux-designer）完成之后，
确保项目结构清晰、环境配置就绪、文档无遗留问题，然后正式进入三 Agent 开发循环。

## 前置条件

调用本 skill 前应已完成：

1. `/patient-pm` — PRD、架构图、时序图已保存到 `docs/`
2. IA 规划 — IA 文档已保存到 `docs/`
3. 技术栈选型与系统架构图 — 技术栈已确定，架构图已生成（文档在 `docs/` 或已口头确认）

如果前置条件未满足，提醒用户先完成对应步骤。但不强制阻塞——如果用户坚持，
可以用最小结构继续，并在后续 Phase 中标注缺失项。

---

## 工作流程

### Phase 1: 信息收集与目录结构推导

目标：从已有文档和文件系统中推导出完整的项目目录结构。

**步骤**：

1. **扫描 docs/**：读取 `docs/` 下所有 `.md` 文件，提取：
   - 项目名称（从文件名前缀或文档标题判断）
   - 页面列表（从 IA 文档的 Sitemap 和 Page Index 提取）
   - 模块划分与系统架构（从架构图提取）
   - 技术栈信息（从技术栈相关文档提取，如有）

2. **扫描根目录**：检查根目录下是否有需要归类的散落文件（`.html`、`.js`、`.css`、`.ts` 等）。

3. **读取 CLAUDE.md 当前目录结构**：获取模板基线，作为结构提案的基础。

4. **生成系统架构图（如尚未生成）**：
   如果 `docs/` 中还没有系统架构图，基于 PRD 和 IA 文档生成一个 Mermaid 架构图。
   - 使用 `flowchart TB` 表示明确的分层，或 `mindmap` 进行功能树状发散。
   - 必须体现三层结构：表现层/用户层、业务核心层、支撑与数据层。
   - 概念分类要清晰，节点名称具备高自我解释性，避免晦涩术语。
   - 输出为纯 Markdown 内含 Mermaid 代码块，可直接写入目标文件。
   - 架构设计必须严格依照 CLAUDE.md 依赖层级（`types → config → repo → service → runtime → ui`）。

   示例格式：
   ```mermaid
   flowchart TB
       subgraph 表现层/用户层
           User[目标用户群]
           Client[客户端/Web]
       end
       subgraph 业务核心层
           ModuleA[核心服务A]
           ModuleB[用户管理B]
       end
       subgraph 支撑与数据层
           DataCenter[数据中心/DB]
           ThirdParty[第三方接口/平台]
       end
       User --> Client
       Client --> ModuleA
       Client --> ModuleB
       ModuleA -.-> DataCenter
   ```

5. **生成结构提案**：综合以上信息，主动生成一份完整的项目目录树。

**主动提案原则**：

- 不要问空白问题（"你想用什么结构？"）——基于文档内容给出完整提案
- 每个文件标注来源（"← 现有文件" 或 "待创建"）
- 结构必须符合 CLAUDE.md 中的依赖层级（types → config → repo → service → runtime → ui）
- 参照 CLAUDE.md 中的目录结构模板，但根据实际项目内容填充

**输出格式**：

```markdown
## 项目目录结构提案

基于 docs/ 中的项目文档，建议以下结构：

（目录树 — 每个文件/目录一行，标注用途和来源）

请确认此结构，或指出需要调整的地方。
```

---

### Phase 2: 更新 CLAUDE.md 目录结构

目标：将确认后的目录结构写入 CLAUDE.md 的「仓库目录结构」段。

**步骤**：

1. 用户确认结构后，重新读取 `CLAUDE.md`（确保拿到最新版本）。
2. 定位 `## 仓库目录结构` 段落（从该标题到下一个 `---` 分隔线或下一个 `##` 标题之间的内容）。
3. 用确认后的目录结构替换该段落内容，保留段落标题。
4. 删除过期注释（如 "当前 index.html / game.html / member.html 待归入 projects/"）。
5. 展示写入的 diff 摘要，让用户确认改动。

**写入规则**：

- 只修改「仓库目录结构」段，不触碰其他段落（与 claudemd-updater 正交）
- 如果 docs/ 下有多个项目，结构中应体现多项目并列
- 保持与 CLAUDE.md 整体 Markdown 风格一致（中文注释、简洁列表）

---

### Phase 3: 生产环境配置引导（API Setup）

目标：引导用户配置项目所需的各类 API 密钥和外部服务连接。

**为什么这一步很重要**：很多开发阻塞发生在"代码写好了但 API key 没配"的时刻。
在开发开始前把所有外部依赖理清，可以避免后续 sprint 中因为配置问题导致的Evaluator失败。

**步骤**：

1. **提取 API 需求**：从 `docs/` 中的 PRD、架构图、技术栈文档中扫描项目需要的外部服务。
   常见类别包括：
   - LLM / AI API（Anthropic、OpenAI、Google AI 等）
   - 数据库连接（Supabase、PostgreSQL、MongoDB、Firebase 等）
   - 云服务 / 部署平台（AWS、Vercel、Cloudflare、Netlify 等）
   - 第三方服务（Stripe、Auth0、SendGrid、Twilio 等）
   - CDN / 资源服务（Cloudinary、S3 等）

2. **检查配置状态**：对每个检测到的 API 需求，检查对应的配置是否已就绪：
   - 检查 `.env`、`.env.local`、`.env.production` 等环境变量文件
   - 检查项目配置文件（`config/`、`settings/` 等）
   - 检查 `package.json` 中的依赖声明
   - 注意：不要读取或显示任何 key 的值，只检查变量是否存在且非空

3. **输出配置清单**：

```markdown
## 生产环境配置清单

| 服务          | 配置项                      | 状态   | 配置方式       |
| ------------- | --------------------------- | ------ | -------------- |
| Anthropic API | ANTHROPIC_API_KEY           | 未配置 | 在 .env 中设置 |
| Supabase      | SUPABASE_URL / SUPABASE_KEY | 已配置 | .env 中已有    |
| ...           | ...                         | ...    | ...            |

### 需要配置的服务：

1. **Anthropic API** — 用于 ...
   - 获取地址：https://console.anthropic.com/
   - 配置步骤：创建 .env 文件（如不存在），添加 `ANTHROPIC_API_KEY=your-key`

请告诉我你想先配置哪一项，或者哪些可以延后到开发中再处理。
```

4. **逐项引导**：用户选择要配置的项目后，给出具体步骤：
   - .env 文件的创建和格式
   - Key 的获取地址
   - 配置验证方法（如简单的 curl 命令或测试脚本）

5. 用户确认所有必要配置完成（或明确标记为延后）后继续。

---

### Phase 4: 基础技术配置检查

目标：确保开发所需的工具链已安装就绪，缺失项给出完整安装引导。

**Part A: 开发工具检查**

依次检查以下工具/配置：

| 检查项                          | 检查方式                                                                   | 阻塞级别                   |
| ------------------------------- | -------------------------------------------------------------------------- | -------------------------- |
| Node.js                         | `node --version`                                                           | **阻塞**                   |
| npm / pnpm / yarn               | `npm --version` 等                                                         | **阻塞**                   |
| Python                          | `python --version` 或 `python3 --version`                                  | 建议                       |
| Git                             | `git --version`                                                            | **阻塞**                   |
| Docker                          | `docker --version`                                                         | 可选                       |
| Playwright                      | `npx playwright --version` 或检查 package.json 中是否有 `@playwright/test` | **阻塞**（Evaluator 依赖） |
| Chrome Extension (ce-validator) | 检查 `tools/ce-validator/` 是否存在                                        | 建议                       |
| CLAUDE.md                       | 检查文件存在且包含关键段落                                                 | **阻塞**                   |
| Hooks 配置                      | 检查 `.claude/settings.json` 或 `.claude/hooks` 是否存在                   | 建议                       |

**Part B: 缺失项引导**

如果有工具缺失或版本过低，输出完整清单并提供安装指引：

```markdown
## 基础配置检查结果

### 必须项（阻塞开发）

- [x] Node.js v20.x — OK
- [x] Git v2.x — OK
- [ ] Playwright — 未安装
  - 安装命令：`npm init playwright@latest` 或 `npx playwright install`
  - Evaluator 依赖此工具进行自动化验收

### 建议项

- [ ] Python — 未检测到
  - 安装建议：https://www.python.org/downloads/
- [ ] Chrome Extension (ce-validator) — 未创建
  - 需要：创建 `tools/ce-validator/` 目录及基础文件

### 可选项

- [x] Docker — OK

---

阻塞项：Playwright 未安装（Evaluator 无法运行）
建议先解决阻塞项。是否现在安装？或标记为已知限制继续？
```

**处理策略**：

- 阻塞项缺失 → 必须明确告知用户，由用户决定是否强行继续
- 建议项缺失 → 提示但不阻塞
- 可选项缺失 → 仅记录，不影响流程

---

### Phase 5: 遗留决策扫描与确认

目标：确保文档中没有悬而未决的问题，避免 Planner 在模糊地带工作。

**步骤**：

1. **扫描 docs/ 下所有文档**，查找未解决的决策：
   - 含 `[ ]` 的待办项（如 IA 文档中的 Open Questions 段）
   - 包含 `TBD`、`TODO`、`未定`、`待确认`、`待定`、`FIXME` 等关键词的段落
   - 空白的"后续计划"或"待补充"段落

2. **汇总为清单**，标注每项的来源文档：

```markdown
## 遗留决策清单

以下问题在文档中标记为未解决：

1. **[来源: IA 文档 - Open Questions #3]** 用户认证方式：微信登录 / 姓名 / 个性化链接？
2. **[来源: PRD - 数据层]** 标签与活动的关联机制？
3. ...

请逐一确认，或标记为"开发迭代中再决定"。
```

3. 用户可以选择：确认决策、修改决策、或标记延后。
4. 所有遗留决策处理完毕后进入 Phase 6。

---

### Phase 6: 启动三 Agent 开发模式

目标：汇总所有确认结果，正式交接给 Planner Agent。

**步骤**：

1. **汇总确认结果**：
   - 项目目录结构：已确认并写入 CLAUDE.md
   - 生产环境配置：已配置 / 部分延后（列出延后项）
   - 基础技术配置：已就绪 / 已知限制（列出限制项）
   - 遗留决策：已处理 / 已标记延后（列出延后项）

2. **输出启动上下文块**：

```markdown
## 项目启动就绪

### 确认摘要

- 目录结构：已写入 CLAUDE.md「仓库目录结构」段
- 生产环境：{已配置 N 项，延后 M 项}
- 开发工具：{已就绪 / 已知限制：...}
- 遗留决策：{已处理 N 项，延后 M 项}

---

现在进入三 Agent 开发模式。
请 Planner 读取以下文档，制定 Sprint #1 计划：

- `{docs/ 下相关文档的完整路径列表}`

目录结构见 CLAUDE.md「仓库目录结构」段。
请严格遵循 Sprint Contract 格式（goal / impl / criteria / layer / blocked_by），
从第一个功能模块开始规划。
```

3. 此后对话自然进入 Planner 角色。Planner 读取文档并输出第一个 Sprint Contract，
   然后进入 Generator → Evaluator 的循环。

**注意**：本 skill 不直接调用 Planner Agent。它准备好上下文并给出明确的交接指令。
三 Agent 循环通过用户与 Claude 的后续对话自然展开——Planner 在对话中被激活，
Generator 和 Evaluator 通过 Sprint Contract 的交付物流转。

---

## 核心守则

- **主动提案，被动确认** — 不问开放式问题，先给出基于文档的完整方案让用户修改。这是从 ia-planner 继承的核心工作方式。
- **目录结构精简** — CLAUDE.md 中的目录树只列架构骨架和关键文件（~25 行），不逐文件展开标注。Claude 可通过 Glob/Grep 自行发现具体文件。
- **不破坏已有配置** — 更新 CLAUDE.md 时只改「仓库目录结构」段，与 claudemd-updater 的原则写入互不干扰。
- **阻塞检查严格** — 环境阻塞项必须明确告知用户，由用户决定是否强行继续，不在用户不知情的情况下跳过。
- **文档驱动** — 所有结构推导和 API 需求都以 docs/ 中的文档为依据，不凭空猜测。
- **安全意识** — 检查 API 配置时只验证变量是否存在且非空，不读取或显示任何密钥值。
- **一次启动** — 本 skill 对每个项目只执行一次。重复执行时先提醒用户检查 CLAUDE.md 是否已有当前项目的目录结构。
