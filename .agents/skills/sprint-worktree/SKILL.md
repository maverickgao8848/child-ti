---
name: sprint-worktree
description: >-
  Git worktree lifecycle manager for three-agent sprint development.
  Manages creation, validation, merging, and cleanup of sprint worktrees.
  Triggers on: "sprint worktree", "create worktree", "finish sprint",
  "merge sprint", "clean worktree", "worktree status", "worktree health",
  "validate worktree", "setup sprint", "收尾 sprint", "创建 worktree",
  "worktree 检查", "sprint 环境".
---

# Sprint Worktree Manager

你是 Harbor Journal 项目的 Worktree 生命周期管理器。根据用户意图选择对应子命令执行。

---

## 项目规范

- 目录：`../sprint-worktrees/sprint-{N}-generator/`
- 分支：`sprint/{N}-{feature-slug}`（如 `sprint/01-capture`）
- Sprint 编号两位数：`01`、`02`、`03`...
- 禁止使用 `EnterWorktree`/`ExitWorktree`（它们管理 `.claude/worktrees/`，不适用 sprint 目录结构）

---

## 子命令选择

| 用户意图                       | 子命令                 |
| ------------------------------ | ---------------------- |
| 创建/新建/准备 sprint 环境     | `setup`                |
| 检查/验证/审计 worktree        | `validate`             |
| 合并 sprint 到 main            | `merge`                |
| 清理/收尾/删除 sprint worktree | `clean`                |
| 状态/概览/当前 worktree        | `status`               |
| 不确定                         | 先运行 `status` 再决定 |

---

## `setup {N} {feature}` — 创建 Sprint Worktree

**前置条件：** 当前在主 worktree（`journal app/`），分支为 `main`

**执行步骤：**

1. 确认当前在 main 分支：

   ```bash
   git branch --show-current
   ```

   不在 main → 提示用户先切换

2. 提取 sprint 编号和功能简称（从 `docs/plan.md` 读取当前 sprint，或接受用户参数）。编号补零到两位。

3. 执行创建（使用 Makefile）：

   ```bash
   make sprint-create SPRINT={NN} FEATURE={feature-slug}
   ```

4. 验证创建成功：

   ```bash
   git worktree list
   ```

5. 写入状态文件 `.claude/sprint-status.json`：

   ```json
   {
     "active_sprint": <N>,
     "active_feature": "<feature-slug>",
     "active_branch": "sprint/<NN>-<feature-slug>",
     "worktree_path": "../sprint-worktrees/sprint-<NN>-generator",
     "status": "in_progress",
     "created_at": "<ISO 8601>",
     "history": [<append to existing history>]
   }
   ```

6. 输出 Generator 工作目录路径：`../sprint-worktrees/sprint-{NN}-generator/`

---

## `validate` — 健康检查

**执行步骤：**

1. 运行审计脚本：

   ```bash
   make sprint-audit
   ```

2. 额外检查（在审计脚本之外）：
   - **分支命名规范**：所有非 main 分支匹配 `sprint/\d{2}-.+`
     ```bash
     git branch --list 'sprint/*' | grep -v 'sprint/[0-9][0-9]-'
     ```
   - **过期分支**：超过 7 天无提交的 sprint 分支
     ```bash
     git for-each-ref --sort=committerdate --format='%(refname:short) %(committerdate:iso8601)' refs/heads/sprint/
     ```
   - **磁盘占用**：
     ```bash
     du -sh ../sprint-worktrees/ 2>/dev/null
     ```
   - **主 worktree 干净度**：
     ```bash
     git status --porcelain
     ```
   - **sprint-status.json 一致性**：文件中引用的 worktree 路径是否实际存在

3. 输出结构化报告：
   ```
   ## Worktree Validation Report
   | # | Check | Severity | Status | Detail |
   |---|-------|----------|--------|--------|
   | 1 | ... | CRITICAL/WARNING/INFO | PASS/FAIL | ... |
   ```

**severity 说明：**

- CRITICAL：阻止继续开发（如孤儿 git 引用、worktree 目录丢失）
- WARNING：建议修复（如未提交修改、依赖缺失）
- INFO：仅信息（如磁盘占用统计）

---

## `merge {N} {feature}` — 合并到 Main

**前置条件：** Evaluator 验收通过

**执行步骤：**

1. 确认在主 worktree 的 main 分支：

   ```bash
   git branch --show-current
   ```

2. 确认 sprint 分支存在：

   ```bash
   git branch --list sprint/<NN>-<feature-slug>
   ```

3. 执行合并：

   ```bash
   git merge sprint/<NN>-<feature-slug>
   ```

4. 如遇冲突：
   - 列出冲突文件：`git status`
   - 报告给用户，等待手动解决
   - 解决后继续 `clean` 步骤

5. 合并成功后提示用户运行 `clean` 完成收尾

---

## `clean {N} {feature}` — 清理 Sprint Worktree

**前置条件：** 已成功 merge（或确认放弃此 sprint）

**执行步骤：**

1. 确认在主 worktree 的 main 分支

2. 运行收尾脚本（自动执行合并确认、worktree 移除、分支删除、prune）：

   ```bash
   make sprint-finish SPRINT=<NN> FEATURE=<feature-slug>
   ```

   注意：此脚本会要求交互确认。如果希望自动跳过确认，改为逐步执行：

   ```bash
   git worktree remove ../sprint-worktrees/sprint-<NN>-generator --force
   git branch -d sprint/<NN>-<feature-slug>
   git worktree prune -v
   ```

3. 验证清理完成：

   ```bash
   git worktree list
   git branch
   ```

4. 更新 `.claude/sprint-status.json`：将 sprint 状态改为 `merged`

---

## `status` — 快速状态概览

**执行步骤：**

1. 读取 `.claude/sprint-status.json`（如存在）

2. 列出所有 worktree：

   ```bash
   git worktree list
   ```

3. 对每个非主 worktree：

   ```bash
   git -C <path> status --porcelain | wc -l
   git -C <path> log --oneline -1
   ```

4. 输出格式：

   ```
   ## Sprint Worktree Status

   Active Sprint: #<N> (<feature>) — <status>
   Branch: sprint/<NN>-<feature-slug>
   Worktree: ../sprint-worktrees/sprint-<NN>-generator/

   | Worktree | Branch | Uncommitted | Last Commit |
   |----------|--------|-------------|-------------|
   | sprint-01-generator | sprint/01-capture | 0 files | abc1234 feat: ... |

   All worktrees: <count> | Disk usage: <size>
   ```

5. 如 `.claude/sprint-status.json` 不存在但检测到 sprint worktree，提示用户重新创建状态文件

---

---

## 使用向导（快速指引）

本 skill 同时提供对话式引导，根据用户意图自动进入对应阶段：

| 用户说                                                 | 进入阶段                |
| ------------------------------------------------------ | ----------------------- |
| "检查 worktree" / "worktree 健康检查"                  | 先运行 `status`，再 `validate` |
| "Sprint 完成了" / "Evaluator 通过了" / "收尾 sprint"   | `merge` → `clean`       |
| "开始新 Sprint" / "创建 worktree" / "生成 sprint 环境" | `setup`                 |
| 不确定                                                 | 先运行 `status`         |

### Sprint 收尾确认清单（执行 `merge` 前必须确认）

```
在收尾 Sprint 之前，请确认：
□ Evaluator 的 Playwright 测试全部通过了吗？
□ Generator worktree 中的代码全部提交了吗？
□ 当前在主 worktree（main 分支）吗？
```

只有三项全部确认后才继续执行 `merge`。

### 合并冲突处理

- 不要慌，这是正常情况。
- 引导用户：`git status` 查看冲突文件 → 手动解决 → `git add .` → `git commit`。
- 冲突解决后手动执行 `clean` 完成收尾。

## 错误处理参考

| 错误                                                   | 原因               | 修复                                                                   |
| ------------------------------------------------------ | ------------------ | ---------------------------------------------------------------------- |
| `fatal: A branch named 'sprint/XX-yyy' already exists` | 分支已存在         | `git branch -D sprint/XX-yyy` 确认不需要后删除                         |
| `fatal: '../sprint-worktrees/...' already exists`      | 目录已存在         | `rm -rf ../sprint-worktrees/sprint-XX-generator && git worktree prune` |
| `CONFLICT (content): Merge conflict in ...`            | 合并冲突           | `git status` 查看冲突文件 → 手动解决 → `git add .` → `git commit`      |
| npm install 路径过长                                   | Windows 长路径限制 | `git config --global core.longpaths true`                              |
