# Sprint #3 — 计分引擎集成 + 结果页完整实现（Service + UI Layer）

## Sprint #3

**goal:** 将 Sprint #1 的计分逻辑集成到前端运行时，实现完整的答题计分、上一题修改重算、人格匹配、维度可视化、深链分享功能。

**impl:**
1. 在前端引入 `scoring.js` 中的 `calculateD4`、`matchPersona`、`DIMENSION_POLARITY`、`PERSONA_MAP`。
2. **答题计分**：用户选中选项时，将该选项的 `scores` 累加到 `state.scores`；同时记录 `answers[currentQuestion] = optionIndex`。
3. **上一题修改重算**：点击「上一题」返回时保留旧答案；若用户重新选择，用新分数替换旧分数（先减去旧选项分数，再加新选项分数），确保 `state.scores` 始终与当前 `answers` 一致。
4. **人格计算**：第 24 题选中后，调用 `calculateD4(state.scores.EMO 的每题分值数组)` 判定 D4 结果；D1/D2/D3 直接比较总分正负；最后 `matchPersona()` 得到人格代号。
5. **结果页完整渲染**：根据匹配到的人格代号，从 `PERSONAS` 数据渲染配图路径、代号、中文名、定义、详细解读（2-3 段）、**人格解读 `reading`**、Slogan。其中 `reading` 为黑色幽默场景化的 MBTI 恶搞版心理解读（如：「全班最懂事的那个，也是厕所隔间里哭得最凶的那个……」），直接引用 `persona-design.md` 中的「黑色幽默解读」列。
6. **维度可视化**：结果页绘制 4 条进度条，分别展示 NRG/RUL/PRE/EMO 的偏向程度（进度条颜色 + 百分比）。
7. **深链分享**：结果页 URL 自动更新为 `?code=KPBL`（或对应代号）；直接访问带 `?code=` 的链接时跳过答题流程，直接渲染结果页。
8. 补充 `PERSONAS` 完整数据到前端（含代号、中文名、定义、详细解读、`reading` 人格解读、Slogan）。`reading` 字段须与 `docs/kidti/persona-design.md` 中「黑色幽默解读」列逐条对齐。

**criteria:**
1. 连续答完 24 题后，控制台输出的 `state.scores` 与手动累加预期一致（±0）。
2. 答到第 5 题后点击「上一题」修改答案，修改前后 `state.scores` 变化量等于「新选项分数 - 旧选项分数」（精确相等）。
3. 使用预设的极端答案组合（如全部选 BATTERY/WOLF/BLACKHOLE/STORM 倾向选项），最终匹配的人格代号与 PRD 人格映射表一致。
4. D4 极端横跳答案组合（3 题 +2 EMO，3 题 -2 EMO）判定为 FOG 人格。
5. 结果页 4 条进度条的宽度百分比与对应维度总分范围一致（如 NRG 最高 12 分对应 100% BATTERY，最低 -12 分对应 100% REACTOR，0 分为 50%）。
6. 直接访问 `?code=TNT` 深链，页面跳过首页/答题页，直接显示 TNT「野生熊孩子」结果页，且人格解读正确渲染。
7. 结果页人格解读文本（`reading`）与 `persona-design.md` 对应条目一致，无遗漏或错位。
8. 深链结果页点击「重新测试」后，URL 恢复为无参数状态，显示首页。
9. 结果页展示的人格配图路径为 `assets/personas/persona-{code}.webp`，若图片不存在则显示占位色块（不阻断流程）。
10. 通过 Vitest/Jest 单元测试验证计分逻辑（答案修改重算、极端组合匹配、D4 FOG 判定）。

**layer:** service, ui

**blocked_by:** Sprint #2
