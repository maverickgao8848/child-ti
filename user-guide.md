### 阶段一：前期筹备（依靠持久化文档交接，避免过度设计）

1. **方向收敛**：调用 `/crazy-realist-friend` 提出初始点子并完成多角度调查分析，收敛出一个核心业务方向。
2. **极简需求定调（Minimal PRD）**：使用 `/patient-pm` 完成需求分析。不要急于设计底层细节，仅让此 Agent 输出轻量级的 PRD（核心 MVP 范围与重点 User Story）并保存到 `docs/{project}/PRD.md` 中。**👉 (千万不要在此时生成架构图和时序图！)**
3. **信息架构与视觉配方**：使用 `/ia-planner` 读取 PRD 以生成基础高密度的内容体系流向（使用 ASCII 线框图辅助用户理解页面布局，但不作为给 AI 的交付物）；然后通过呼叫 `/visual-explorer` （传入 PRD 与 IA 架构图）对接，输出前端友好且包含强约束 Design Tokens 的规范。
4. **互动设计与资产规划**：
   - 使用 `/motion-concept`（传入 PRD、IA 与 Design Tokens）进行创意动态概念表达与音效设计，输出 cinematography-level 的七维动效方案（Scroll Storytelling、Cursor Physics、Cinematic Transitions、Ambient Texture、Micro-Interactions、Sound Design、Immersive Backgrounds）。
   - 如需 Canvas 沉浸式技术改造，再使用 `html-in-canvas-upgrader` 提出具体实现方案与代码。
   - 如需生成美术素材提示词，使用 `resource-inventory` 扫描资产需求并输出英文高阶提示词库。
5. **项目启动配置**：使用 `ready-to-start` skill 完成项目启动。该 skill 会一次性完成以下工作：
   - 根据 PRD / IA 推导项目目录结构（严格遵循 `types → config → repo → service → runtime → ui` 六层依赖层级）
   - 生成系统架构图（Mermaid flowchart，如尚未在 `docs/` 中存在）
   - 引导配置生产环境 API 密钥与外部服务
   - 检查基础开发工具（Node、Git、Playwright 等）
   - 扫描并确认遗留决策
   **注意：进入开发前，务必确认是否已根据生图提示词生成外部美术资产（图片/音频/视频），并已存放至 `public/` 或 `assets/` 目录。**

### 阶段二：三 Agent 循环开发

项目启动以后开始使用三 agent 架构完成敏捷开发，遵循单一职责与即时生成原则：

- **全局任务拆解 (Sprint Backlog Generation)**：在进入具体的 Sprint 前，Planner 必须先通读 PRD、IA 和架构图，生成一份全局的 Sprint Backlog 或任务清单，把项目拆分成有明确依赖关系（`blocked_by`）的 Sprint 列表。
- **Planner 拆解与局部设计**：每次 Sprint 认领一个单一需求，Planner 制定 sprint contract。**如果涉及复杂逻辑交互，Planner 在此时按需仅生成该局部特性的时序图/流程图**，防止早期的宏大发散造成记忆污染。随后调用 `/sprint-worktree setup` 创建隔离环境。
- **Generator 实现**：在 worktree 中严格根据底层向上原则实现具体代码。
- **安全审查**：每个 sprint 实现完成后，使用 `security-best-practices` skill 对变更代码做安全审查。关键变更额外使用 `/reviewer-agent` 做多维审查。
- **Evaluator 验收**：根据开发层级（底层逻辑使用 Vitest/Jest 单元测试，UI层使用 Playwright/CE 进行 E2E 跑查），验收通过后 → `/sprint-worktree merge` 并在确认后 `/sprint-worktree clean` → 进入下一个 sprint。
- 每次 Claude 停止时 Stop hook 会自动检查 worktree 健康状态；也可随时用 `/sprint-worktree status` 或 `validate` 主动检查。

定期使用 garbage-collection skill 来检查项目是否存在冗余文件或者矛盾，并进行清理

可以安装 chrome dev tools mcp 自动化测试功能


出错时/或者 CLAUDE.md（AGENTS.md）的项目目录结构部分需要更新时使用 `claudemd-updater` skill（当卡住，思考 what tool is missing）来工程化避免错误

---

### 补充：独立 Skill 速查

以下 Skill 通常由上游 Skill 自动调用，但也可以在对话中独立触发：

| Skill | 独立触发场景 | 触发词 |
|---|---|---|
| `motion-concept` | 需要单独讨论网站的动态效果、滚动叙事、转场动画、光标物理、微交互等创意概念，不经过完整的 UX 设计流程 | "how should the site move", "I want scroll animations", "网站能不能有沉浸式体验", "帮我设计动效" |
| `sprint-worktree` | 直接执行 git worktree 的 setup / merge / clean / validate / status 操作，不需要对话引导 | `/sprint-worktree setup`, `/sprint-worktree merge`, `/sprint-worktree clean` |
| `diagnose` | 结构化诊断硬骨头 bug 或性能退化：建反馈环 → 复现 → 3-5 个可证伪假设 → 插桩 → 修复 + 回归测试 → 清理 + 复盘 | "diagnose this", "debug this", "帮我排查这个 bug", "定位性能问题" |
| `security-best-practices` | 开发阶段：对代码做安全审查，支持生成安全代码 / 被动漏洞发现 / 完整审计报告三种模式 | "安全审查", "检查这段代码安全吗" |
