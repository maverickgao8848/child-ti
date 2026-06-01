/**
 * Sprint #3 Evaluator — 计分引擎 + 结果页完整实现验收
 * 使用 JSDOM 模拟浏览器环境验证计分与 UI
 */

const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const HTML_PATH = path.join(__dirname, "../src/ui/index.html");

let passed = 0;
let failed = 0;

function assert(cond, msg) {
  if (cond) {
    passed++;
    console.log(`  ✅ ${msg}`);
  } else {
    failed++;
    console.log(`  ❌ ${msg}`);
  }
}

function assertEqual(a, b, msg) {
  assert(a === b, `${msg} (期望: ${b}, 实际: ${a})`);
}

console.log("\n🎯 Sprint #3 Evaluator — 计分引擎与结果页\n");

// ===== 0. 准备 HTML 并把配置脚本内联 =====
const questionsJs = fs.readFileSync(path.join(__dirname, "../src/config/questions.js"), "utf-8");
const scoringJs = fs.readFileSync(path.join(__dirname, "../src/config/scoring.js"), "utf-8");
const personasJs = fs.readFileSync(path.join(__dirname, "../src/config/personas.js"), "utf-8");
let html = fs.readFileSync(HTML_PATH, "utf-8");

const qScript = '<script>' + questionsJs + '; if (typeof window !== "undefined") window.QUESTIONS = QUESTIONS;</script>';
const sScript = '<script>' + scoringJs + '; if (typeof window !== "undefined") { window.calculateD4 = calculateD4; window.matchPersona = matchPersona; window.FOG_VARIANCE_THRESHOLD = FOG_VARIANCE_THRESHOLD; window.DIMENSION_POLARITY = DIMENSION_POLARITY; window.PERSONA_MAP = PERSONA_MAP; }</script>';
const pScript = '<script>' + personasJs + '; if (typeof window !== "undefined") window.PERSONAS = PERSONAS;</script>';

html = html.replace(/<script src="\.\.\/config\/questions\.js"><\/script>/, qScript);
html = html.replace(/<script src="\.\.\/config\/scoring\.js"><\/script>/, sScript);
html = html.replace(/<script src="\.\.\/config\/personas\.js"><\/script>/, pScript);

// 提取主脚本，从 HTML 中移除
const scriptMatches = html.match(/<script[^>]*>([\s\S]*?)<\/script>/g);
const mainScriptRaw = scriptMatches[scriptMatches.length - 1].replace(/<\/?script[^>]*>/g, '');
html = html.replace(scriptMatches[scriptMatches.length - 1], '');

const dom = new JSDOM(html, {
  url: "http://localhost/test",
  runScripts: "dangerously",
  resources: "usable",
  pretendToBeVisual: true,
});

const document = dom.window.document;
const window = dom.window;

setTimeout(() => {
  const mainScript = mainScriptRaw
    .replace(/\bconst\b/g, "var")
    .replace(/\blet\b/g, "var");

  try {
    window.eval(mainScript);
  } catch (e) {
    console.log("  ❌ 主脚本执行出错:", e.message);
    process.exit(1);
  }

  if (window.app && typeof window.app.init === "function") {
    window.app.init();
  }

  const app = window.app;
  const QUESTIONS = window.QUESTIONS;
  const PERSONAS = window.PERSONAS;

  // ===== 1. 计分一致性：手动累加 vs 自动计分 =====
  app.startQuiz();

  // 模拟随机答题并同时手动累加
  const manualScores = { NRG: 0, RUL: 0, PRE: 0, EMO: 0 };
  const manualD4 = [];
  const selectedAnswers = [];

  for (let i = 0; i < QUESTIONS.length; i++) {
    const q = QUESTIONS[i];
    const idx = i % 4; // 选 A/B/C/D 轮换
    selectedAnswers.push(idx);

    const opt = q.options[idx];
    Object.entries(opt.scores).forEach(([dim, val]) => {
      manualScores[dim] += val;
    });
    if (q.dimension === 'EMO') {
      manualD4.push(opt.scores.EMO || 0);
    }

    app.selectOption(idx);
  }

  assertEqual(window.state.scores.NRG, manualScores.NRG, "NRG 自动计分与手动累加一致");
  assertEqual(window.state.scores.RUL, manualScores.RUL, "RUL 自动计分与手动累加一致");
  assertEqual(window.state.scores.PRE, manualScores.PRE, "PRE 自动计分与手动累加一致");
  assertEqual(window.state.scores.EMO, manualScores.EMO, "EMO 自动计分与手动累加一致");
  assertEqual(JSON.stringify(window.state.d4Scores), JSON.stringify(manualD4), "D4 分值数组一致");

  // ===== 2. 上一题修改重算 =====
  app.restart();
  app.startQuiz();

  // 答前 5 题
  for (let i = 0; i < 5; i++) {
    app.selectOption(0);
  }

  // 返回到第 5 题 (0-based index 4)
  const q5Idx = 4;
  window.state.currentQuestion = q5Idx;
  app.renderQuestion();
  const q5 = QUESTIONS[q5Idx];

  // 记录第 5 题当前已选答案的分数（前5题都选的选项0）
  const scoresBeforeChange = { ...window.state.scores };

  // 改选第 5 题选项 1
  app.selectOption(1);
  const scoresAfterFirst = { ...window.state.scores };

  // 返回第 5 题并改选选项 2
  window.state.currentQuestion = q5Idx;
  app.renderQuestion();
  app.selectOption(2);
  const scoresAfterSecond = { ...window.state.scores };

  // 计算预期变化
  const q5Opt1 = q5.options[1].scores;
  const q5Opt2 = q5.options[2].scores;
  const expectedDelta = {};
  ['NRG', 'RUL', 'PRE', 'EMO'].forEach(dim => {
    expectedDelta[dim] = (q5Opt2[dim] || 0) - (q5Opt1[dim] || 0);
  });

  assertEqual(
    scoresAfterSecond.NRG - scoresAfterFirst.NRG,
    expectedDelta.NRG,
    "修改第5题答案后 NRG 变化 = 新分 - 旧分"
  );
  assertEqual(
    scoresAfterSecond.RUL - scoresAfterFirst.RUL,
    expectedDelta.RUL,
    "修改第5题答案后 RUL 变化 = 新分 - 旧分"
  );
  assertEqual(
    scoresAfterSecond.PRE - scoresAfterFirst.PRE,
    expectedDelta.PRE,
    "修改第5题答案后 PRE 变化 = 新分 - 旧分"
  );
  assertEqual(
    scoresAfterSecond.EMO - scoresAfterFirst.EMO,
    expectedDelta.EMO,
    "修改第5题答案后 EMO 变化 = 新分 - 旧分"
  );

  // ===== 3. 极端组合人格匹配 =====
  // 构造答案：全部选 BATTERY/WOLF/BLACKHOLE/STORM 倾向
  // BATTERY = NRG >= 0, WOLF = RUL < 0, BLACKHOLE = PRE >= 0, STORM = EMO 高
  app.restart();
  app.startQuiz();

  for (let i = 0; i < QUESTIONS.length; i++) {
    const q = QUESTIONS[i];
    // 找使 NRG 最大、RUL 最小、PRE 最大、EMO 最大的选项
    let bestIdx = 0;
    let bestScore = -Infinity;
    q.options.forEach((opt, idx) => {
      let s = 0;
      if (opt.scores.NRG !== undefined) s += opt.scores.NRG * 2;
      if (opt.scores.RUL !== undefined) s -= opt.scores.RUL * 2; // 负分更好（WOLF）
      if (opt.scores.PRE !== undefined) s += opt.scores.PRE * 2;
      if (opt.scores.EMO !== undefined) s += opt.scores.EMO * 2;
      if (s > bestScore) {
        bestScore = s;
        bestIdx = idx;
      }
    });
    app.selectOption(bestIdx);
  }

  const extremeCode = window.state.personaCode;
  assert(extremeCode !== null, "极端组合产生了人格匹配");
  // BATTERY+WOLF+BLACKHOLE+STORM = NUKE (根据映射表)
  // 但如果 EMO 方差大可能触发 FOG，变成 NEIG
  assert(extremeCode === 'NUKE' || extremeCode === 'NEIG', `极端组合匹配到 NUKE 或 NEIG (实际: ${extremeCode})`);

  // ===== 4. D4 极端横跳判定 FOG =====
  app.restart();
  app.startQuiz();

  for (let i = 0; i < QUESTIONS.length; i++) {
    const q = QUESTIONS[i];
    if (q.dimension === 'EMO') {
      // 前 3 道 EMO 选 +2，后 3 道选 -2
      const emoScores = q.options.map((opt, idx) => ({ idx, emo: opt.scores.EMO || 0 }));
      const d4Index = QUESTIONS.filter((qq, ii) => ii <= i && qq.dimension === 'EMO').length - 1;
      if (d4Index < 3) {
        // 选 +2
        const target = emoScores.find(s => s.emo === 2);
        app.selectOption(target ? target.idx : 0);
      } else {
        // 选 -2
        const target = emoScores.find(s => s.emo === -2);
        app.selectOption(target ? target.idx : 0);
      }
    } else {
      app.selectOption(0);
    }
  }

  const dims = app.calculateDimensions();
  assertEqual(dims.EMO, 'FOG', "D4 极端横跳（3题+2, 3题-2）判定为 FOG");

  // ===== 5. 进度条百分比验证 =====
  app.restart();
  app.startQuiz();

  // 构造一个 NRG 最高的答案
  for (let i = 0; i < QUESTIONS.length; i++) {
    const q = QUESTIONS[i];
    let maxNrgIdx = 0;
    let maxNrg = -Infinity;
    q.options.forEach((opt, idx) => {
      const nrg = opt.scores.NRG || 0;
      if (nrg > maxNrg) { maxNrg = nrg; maxNrgIdx = idx; }
    });
    app.selectOption(maxNrgIdx);
  }

  const resultView = document.querySelector("#view-result");
  assert(resultView && !resultView.classList.contains("hidden"), "答题完成后显示结果页");

  const dimFills = document.querySelectorAll("#dimensions-list .dim-bar-fill");
  assertEqual(dimFills.length, 4, "结果页渲染 4 个维度条");

  // 验证 NRG 进度条在最右侧（因为 NRG 最高分，应该是从中心向右填充）
  const nrgFill = dimFills[0];
  const nrgLeft = parseFloat(nrgFill.style.left);
  const nrgWidth = parseFloat(nrgFill.style.width);
  assert(nrgLeft === 50, `NRG 高分时进度条起点在中心 (50%)，实际 ${nrgLeft}%`);
  assert(nrgWidth > 40, `NRG 最高分进度条宽度 > 40%，实际 ${nrgWidth}%`);

  // 验证 EMO 进度条也在最右侧（因为全部选了正向 EMO）
  const emoFill = dimFills[3];
  const emoLeft = parseFloat(emoFill.style.left);
  assert(emoLeft === 50, `EMO 高分时进度条起点在中心 (50%)，实际 ${emoLeft}%`);

  // ===== 6. 深链直接显示结果页 =====
  window.history.replaceState(null, '', 'http://localhost/test?code=TNT');
  app.init();
  assert(document.querySelector("#result-code").textContent === 'TNT', "?code=TNT 深链直接显示 TNT");
  assert(document.querySelector("#result-name").textContent === '野生熊孩子', "深链显示正确中文名");

  // ===== 7. 深链重测后 URL 恢复 =====
  app.restart();
  const urlAfterRestart = new window.URL(window.location.href);
  assertEqual(urlAfterRestart.searchParams.get('code'), null, "重新测试后 URL 无 code 参数");
  assertEqual(urlAfterRestart.searchParams.get('view'), null, "重新测试后 URL 无 view 参数");
  const startView = document.querySelector("#view-start");
  assert(startView && !startView.classList.contains("hidden"), "重新测试后显示首页");

  // ===== 8. 配图路径 =====
  app.showResult('KPBL');
  const img = document.querySelector("#result-img");
  assert(img !== null, "结果页存在 img 标签");
  assert(img.src.includes('assets/personas/persona-kpbl.webp'), `配图路径正确: ${img.src}`);

  // ===== 9. 单元测试：calculateD4 =====
  const { calculateD4, matchPersona } = require("../src/config/scoring");

  // D4 FOG
  const fogResult = calculateD4([2, 2, 2, -2, -2, -2]);
  assertEqual(fogResult.result, 'FOG', "calculateD4: 3题+2, 3题-2 → FOG");

  // D4 STORM
  const stormResult = calculateD4([2, 2, 1, 2, 1, 2]);
  assertEqual(stormResult.result, 'STORM', "calculateD4: 全部外放 → STORM");

  // D4 LAKE
  const lakeResult = calculateD4([-2, -1, -2, -1, -2, -2]);
  assertEqual(lakeResult.result, 'LAKE', "calculateD4: 全部内敛 → LAKE");

  // matchPersona
  assertEqual(matchPersona({ NRG: 'BATTERY', RUL: 'WOLF', PRE: 'BLACKHOLE', EMO: 'STORM' }), 'NUKE', "matchPersona: BATTERY+WOLF+BLACKHOLE+STORM → NUKE");
  assertEqual(matchPersona({ NRG: 'REACTOR', RUL: 'SHEEP', PRE: 'BLACKHOLE', EMO: 'LAKE' }), '502ER', "matchPersona: REACTOR+SHEEP+BLACKHOLE+LAKE → 502ER");
  assertEqual(matchPersona({ NRG: 'BATTERY', RUL: 'SHEEP', PRE: 'SPOTLIGHT', EMO: 'FOG' }), 'CTRLC', "matchPersona: BATTERY+SHEEP+SPOTLIGHT+FOG → CTRLC");

  // 汇总
  console.log("\n" + "━".repeat(40));
  console.log(`  通过: ${passed}  |  失败: ${failed}`);
  console.log("━".repeat(40) + "\n");

  process.exit(failed > 0 ? 1 : 0);
}, 500);
