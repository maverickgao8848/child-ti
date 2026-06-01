# Sprint #2 — 核心 UI 框架 + 三视图路由（UI Layer）

## Sprint #2

**goal:** 实现三视图 SPA 的 HTML/CSS/JS 骨架，包含首页、答题页、结果页的基础布局与视图切换，为后续计分与分享功能提供 UI 载体。

**impl:**
1. 在 `projects/kidti/src/ui/index.html` 中构建单文件 SPA（纯原生 HTML5 + CSS3 + ES6+）。
2. **首页 (Start Page)**：品牌标题「儿童 TI」、副标题「你是什么儿童？」、核心信息「24 道题，测出你的童年人格」、CTA 按钮「开始测试」、底部免责声明。
3. **答题页 (Quiz Page)**：弱化品牌标题、进度指示器（「第 N 题 / 共 24 题」+ 进度条）、题目文本区、4 个单选选项（A/B/C/D）、「上一题」按钮（第 1 题隐藏）。
4. **结果页 (Result Page)**：品牌标题、人格配图占位区、人格代号（大字号）、中文名、一句话定义、Slogan 占位区、维度进度条占位区、操作按钮区（「分享给朋友」「重新测试」）、二维码占位区。
5. **视图切换路由**：通过 `?view=` 查询参数 + 显隐 DOM 容器实现三视图切换；默认显示首页。
6. **状态对象**（内存驻留）：`{ currentQuestion, answers[], scores: {NRG,RUL,PRE,EMO}, personaCode }`。
7. **微信适配 CSS**：`user-scalable=no`、`touch-action: manipulation`、`-webkit-tap-highlight-color: transparent`、`env(safe-area-inset-*)`。
8. 从 `../config/questions.js` 加载题目数据并渲染到答题页（仅渲染，暂不计分跳转）。

**criteria:**
1. 打开 `index.html` 默认显示首页，品牌信息、CTA 按钮、免责声明均正确渲染。
2. 点击「开始测试」→ 答题页显示，渲染第 1 题题目文本与 4 个选项。
3. 答题页进度指示器显示「第 1 题 / 共 24 题」，进度条宽度为 1/24。
4. 选中任一选项后自动渲染下一题，题号与进度条同步更新。
5. 第 2 题及以上显示「上一题」按钮，点击可回到上一题并保留已选答案的高亮状态。
6. 第 24 题选中后跳转结果页，结果页显示对应人格的代号、中文名、定义、Slogan（使用 PRD 附录 PERSONAS 硬编码数据）。
7. 结果页「重新测试」按钮点击后清空状态回到首页。
8. 视图切换过程中无页面闪烁，过渡动画 ≤ 200ms。
9. iOS Safari / Android Chrome / 微信内置浏览器中，首屏无缩放、无 300ms 点击延迟、无蓝色点击高亮。
10. 通过 Playwright 或手动测试验证上述 1-9 条。

**layer:** ui

**blocked_by:** Sprint #1
