# Sprint #1 — 题目数据层（Config Layer）

## Sprint #1

**goal:** 完成 24 道童年情境选择题的题目数据（含情境文案、4 个选项、维度分数偏移），作为前端计分与答题的静态配置源。

**impl:**
1. 在 `projects/kidti/src/config/questions.js` 中定义 `QUESTIONS` 数组，共 24 题。
2. 按维度均分：D1(NRG) 6 题、D2(RUL) 6 题、D3(PRE) 6 题、D4(EMO) 6 题。
3. 每题结构：`{ id, dimension, text, options: [{ label, text, scores: { NRG?, RUL?, PRE?, EMO? } }] }`。
4. 每选项标注 1~2 个维度的分数偏移，取值范围 ±1 / ±2。
5. D4（情绪天气）题目选项需覆盖极端分值（+2 极度外放 / -2 极度内敛），以支持 FOG 矛盾检测法的方差计算。
6. 在 `projects/kidti/src/config/scoring.js` 中定义 FOG 阈值常量及计分辅助函数。
7. 文案风格：童年情境化、无评判感、黑色幽默、具体动作/场景替代抽象术语。

**criteria:**
1. `QUESTIONS.length === 24`，且每维度恰好 6 题（通过 Node.js 断言验证）。
2. 每道题有且仅有 4 个 `options`，每个 `option` 包含 `label`（A/B/C/D）、`text`、`scores` 对象（至少一个维度偏移）。
3. 所有 `scores` 中的维度键名仅限于 `NRG | RUL | PRE | EMO`，取值仅限于 `-2 | -1 | 1 | 2`。
4. D4 维度（id 19-24）的每道题目中，四个选项的 EMO 分值必须覆盖 `+2, +1, -1, -2` 或同等宽幅，确保用户答案可产生足够方差。
5. 数据文件能被 Node.js `require()` 直接加载，无语法错误。
6. 题目文案无明显重复场景，选项无逻辑冲突。

**layer:** config

**blocked_by:** none
