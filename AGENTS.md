# Harness Model Dev Protocol

## 三 Agent 开发架构

```
Planner ──sprint contract──► Generator ──► Evaluator
   ▲                                           │
   └─────────── feedback / next sprint ◄───────┘
```

### Roles

| Agent         | 职责                                                          |
| ------------- | ------------------------------------------------------------- |
| **Planner**   | 拆解需求 → 制定 sprint contract → 生成验收标准                |
| **Generator** | 按 contract 实现功能，输出可运行代码                          |
| **Evaluator** | 根据所属层级用 Vitest/Jest (底层) 或 Playwright/CE (UI层) 验收；通过则推进，失败则反馈 |

### Agent 模型选择

调用 Agent tool 时，按角色指定模型：

| Agent         | model       |
| ------------- | ----------- |
| **Planner**   | `"opus"`    |
| **Generator** | `"sonnet"`  |
| **Evaluator** | `"sonnet"`  |

### Sprint Contract（每轮必须包含）

```
## Sprint #{n}
goal:        # 本轮要实现的单一功能
impl:        # Generator 的实现方案（技术路径）
criteria:    # 可测试的成功标准（底层模块使用 Vitest/Jest 断言；UI层使用 Playwright/CE 断言）
layer:       # 涉及的依赖层（见下，支持跨层垂直切片或单层横向推进）
blocked_by:  # 依赖的前序 sprint（无则 none）
```

### Evaluator 工具规则

- 底层 (types ~ runtime) → Vitest/Jest；UI 层 → Playwright；扩展 → Chrome Extension
- 每条 criteria 对应一条自动化断言；无法自动化的须注明手动步骤

## 依赖层级（不可逆向依赖）

```
types → config → repo → service → runtime → ui
```

- 上层可引用下层，下层禁止；跨层调用须经接口隔离

## 仓库目录结构

```
harness_model/
├── CLAUDE.md / AGENTS.md      # Dev protocol（内容同步）
├── README.md                  # 流程总览 & 快速上手
├── user-guide.md              # 给用户的详细工作流指南
├── .agents/
│   ├── skills/                # 可复用 skill 定义
│   └── workflows/             # 工作流定义
├── docs/                      # 项目文档（PRD、IA、视觉方案）
│   └── {project}/             # 按项目归档
├── projects/                  # 开发项目
│   └── {project-name}/
│       ├── src/               # 按依赖层分包
│       └── tests/e2e/         # Playwright 测试
└── tools/
    └── ce-validator/          # Chrome Extension 验收工具
```

- src/ 子目录严格对应依赖层级：`types → config → repo → service → runtime → ui`
> `AGENTS.md` 与 `CLAUDE.md` 内容同步（Claude Code 读前者，Kimi 读后者）。

## 开发 & Worktree 守则

1. 每次对话只执行**一个 sprint**；Evaluator 未通过 → 禁止进入下一 sprint
2. 依赖层违规 → Planner 拒绝 contract，打回重写
3. 所有 worktree 操作统一用 `/sprint-worktree` skill（setup / validate / merge / clean / status）
4. 流程：`setup`（新建 worktree）→ 实现 → `merge` → `clean` → 下一 sprint
5. 禁止用 `EnterWorktree`/`ExitWorktree` 管 sprint worktree（它们管 `.claude/worktrees/`）
6. Worktree 健康检查由 Stop hook 自动运行；也可随时 `/sprint-worktree status`
7. 用户做出不合理选择时，果断提醒并解释原因、提出更好方案
8. 积极询问，质疑，采访用户，知道对任务的理解达到百分之90才开始执行

---
## 安全守则

- **认证/授权在服务端**：Supabase RLS 或 Edge Functions 做权限校验，不依赖前端 CSS/JS 隐藏。密码、密钥不入源码（`src/config/` 禁止硬编码）。
- **每 Sprint 安全检查**：实现完成后跑 `security-review`；关键变更用 `/reviewer-agent` 做多维审查。
- **RLS 硬约束**：新建表必须 `ENABLE ROW LEVEL SECURITY` 并定义 USING/WITH CHECK 策略。
- 详细规则见 `.claude/skills/reviewer-agent/references/security-checklist.md`
---

## 资源优化原则

- 图片默认 WebP；图标/Logo 优先 SVG；PNG 仅用于必须透明且无法 SVG 的场景
- AI 生图的原始 PNG 须经压缩（感知无损级别）才能进入项目
- 大图使用 `loading="lazy"` + `srcset` 响应式多尺寸
- 纹理、渐变、阴影能用 CSS 实现则不使用位图
- 构建时配置 Vite 图片压缩插件做二次压缩

所有大的涉及到功能或者主要布局的调整都要和用户确认是否需要同步更改/doc文件夹里的对应内容，并提出大致方案

