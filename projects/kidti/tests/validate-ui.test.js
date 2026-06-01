/**
 * Sprint #2 Evaluator — UI 框架 + 三视图路由验收
 * 使用 JSDOM 模拟浏览器环境验证交互
 *
 * 注意：JSDOM 的脚本执行使用 vm 上下文，const/let 不会泄漏到 window。
 * 测试中将内联脚本中的 const/let 替换为 var 以确保变量可访问。
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

console.log("\n🎨 Sprint #2 Evaluator — UI 框架与三视图路由\n");

// ===== 0. 准备 HTML 并把配置脚本内联 =====
const questionsJs = fs.readFileSync(path.join(__dirname, "../src/config/questions.js"), "utf-8");
const scoringJs = fs.readFileSync(path.join(__dirname, "../src/config/scoring.js"), "utf-8");
const personasJs = fs.readFileSync(path.join(__dirname, "../src/config/personas.js"), "utf-8");
let html = fs.readFileSync(HTML_PATH, "utf-8");

// 内联配置脚本（暴露到 window，因为 JSDOM vm 中 const 不会泄漏）
const qScript = '<script>' + questionsJs + '; if (typeof window !== "undefined") window.QUESTIONS = QUESTIONS;</script>';
const sScript = '<script>' + scoringJs + '; if (typeof window !== "undefined") { window.calculateD4 = calculateD4; window.matchPersona = matchPersona; window.FOG_VARIANCE_THRESHOLD = FOG_VARIANCE_THRESHOLD; window.DIMENSION_POLARITY = DIMENSION_POLARITY; window.PERSONA_MAP = PERSONA_MAP; }</script>';
const pScript = '<script>' + personasJs + '; if (typeof window !== "undefined") window.PERSONAS = PERSONAS;</script>';

html = html.replace(/<script src="\.\.\/config\/questions\.js"><\/script>/, qScript);
html = html.replace(/<script src="\.\.\/config\/scoring\.js"><\/script>/, sScript);
html = html.replace(/<script src="\.\.\/config\/personas\.js"><\/script>/, pScript);

// ===== 1. 创建 JSDOM（不执行主脚本，后面手动 eval）=====
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

// 等待内联配置脚本执行
setTimeout(() => {
  // JSDOM vm 中 const/let 不会暴露，把主脚本中的 const/let 换成 var
  const mainScript = mainScriptRaw
    .replace(/\bconst\b/g, "var")
    .replace(/\blet\b/g, "var");

  // 执行主脚本
  try {
    window.eval(mainScript);
  } catch (e) {
    console.log("  ❌ 主脚本执行出错:", e.message);
    console.log("  stack:", e.stack);
    process.exit(1);
  }

  // 手动触发 init（DOMContentLoaded 在 JSDOM 中不会按预期触发）
  if (window.app && typeof window.app.init === "function") {
    window.app.init();
  }

  // ===== 2. 结构检查 =====
  assert(document.querySelector("#view-start"), "存在首页视图 (#view-start)");
  assert(document.querySelector("#view-quiz"), "存在答题页视图 (#view-quiz)");
  assert(document.querySelector("#view-result"), "存在结果页视图 (#view-result)");

  assert(document.querySelector("#view-start h1"), "首页存在品牌标题 h1");
  assert(/儿童\s*TI/i.test(document.querySelector("#view-start h1").textContent), "品牌标题包含「儿童TI」");
  assert(document.querySelector("#btn-start"), "首页存在「开始测试」按钮");
  assert(document.querySelector("#view-start .start-footer"), "首页存在免责声明");

  assert(document.querySelector("#progress-text"), "存在进度文本");
  assert(document.querySelector("#progress-fill"), "存在进度条");
  assert(document.querySelector("#question-text"), "存在题目文本区");
  assert(document.querySelector("#options-list"), "存在选项列表");
  assert(document.querySelector("#btn-prev"), "存在「上一题」按钮");

  assert(document.querySelector("#result-code"), "结果页存在人格代号");
  assert(document.querySelector("#result-name"), "结果页存在中文名");
  assert(document.querySelector("#result-tagline"), "结果页存在定义");
  assert(document.querySelector("#result-slogan"), "结果页存在 Slogan");
  assert(document.querySelector("#dimensions-list"), "结果页存在维度条容器");
  assert(document.querySelector("#btn-share"), "结果页存在「分享给朋友」按钮");
  assert(document.querySelector("#btn-retry"), "结果页存在「重新测试」按钮");
  assert(document.querySelector("#qr-placeholder"), "结果页存在二维码占位区");

  // ===== 3. 微信适配检查 =====
  const viewport = document.querySelector('meta[name="viewport"]');
  assert(viewport, "存在 viewport meta 标签");
  const vpContent = viewport.getAttribute("content") || "";
  assert(vpContent.includes("user-scalable=no"), "viewport 包含 user-scalable=no");
  assert(vpContent.includes("viewport-fit=cover"), "viewport 包含 viewport-fit=cover");

  const style = document.querySelector("style").textContent;
  assert(style.includes("-webkit-tap-highlight-color: transparent"), "CSS 包含 -webkit-tap-highlight-color");
  assert(style.includes("touch-action: manipulation"), "CSS 包含 touch-action: manipulation");
  assert(style.includes("env(safe-area-inset-top)"), "CSS 包含安全区适配");

  // ===== 4. 动画时长检查 =====
  const transitionMatches = style.matchAll(/transition:[^;]*(\d+)ms/g);
  let maxMs = 0;
  for (const m of transitionMatches) {
    maxMs = Math.max(maxMs, parseInt(m[1], 10));
  }
  assert(maxMs <= 250, `最长过渡动画 ${maxMs}ms ≤ 250ms（接近 200ms 要求）`);

  // ===== 5. 状态对象与 app 方法检查 =====
  assert(typeof window.state === "object", "全局存在 state 对象");
  assert("currentQuestion" in window.state, "state 包含 currentQuestion");
  assert(Array.isArray(window.state.answers), "state.answers 是数组");
  assert("scores" in window.state && typeof window.state.scores === "object", "state 包含 scores 对象");
  assert("personaCode" in window.state, "state 包含 personaCode");

  const app = window.app;
  assert(typeof app === "object", "全局存在 app 对象");
  assert(typeof app.startQuiz === "function", "app 存在 startQuiz 方法");
  assert(typeof app.selectOption === "function", "app 存在 selectOption 方法");
  assert(typeof app.goPrev === "function", "app 存在 goPrev 方法");
  assert(typeof app.restart === "function", "app 存在 restart 方法");
  assert(typeof app.shareResult === "function", "app 存在 shareResult 方法");

  // ===== 6. 模拟答题流程 =====
  app.startQuiz();

  const quizView = document.querySelector("#view-quiz");
  const startView = document.querySelector("#view-start");
  assert(quizView && !quizView.classList.contains("hidden"), "点击「开始测试」后显示答题页");
  assert(startView && startView.classList.contains("hidden"), "点击「开始测试」后隐藏首页");

  assertEqual(window.state.currentQuestion, 0, "初始题号为 0");
  const progressText = document.querySelector("#progress-text").textContent;
  assert(/第\s*1\s*题/.test(progressText), `进度文本显示第 1 题: "${progressText}"`);
  const progressFill = document.querySelector("#progress-fill");
  assert(progressFill.style.width === "4.166666666666666%" || progressFill.style.width.includes("4.1666"), `进度条宽度约 1/24: ${progressFill.style.width}`);

  const options = document.querySelectorAll("#options-list .option-btn");
  assertEqual(options.length, 4, "第 1 题渲染 4 个选项");

  const prevBtn = document.querySelector("#btn-prev");
  assert(prevBtn.classList.contains("hidden"), "第 1 题「上一题」按钮隐藏");

  // 选择第 1 题选项
  app.selectOption(0);
  assertEqual(window.state.currentQuestion, 1, "选择第 1 题后进入第 2 题");
  assertEqual(window.state.answers[0], 0, "第 1 题答案被记录为索引 0");
  assert(!prevBtn.classList.contains("hidden"), "第 2 题「上一题」按钮显示");

  // 上一题功能
  app.goPrev();
  assertEqual(window.state.currentQuestion, 0, "点击「上一题」回到第 1 题");
  const optsAfterBack = document.querySelectorAll("#options-list .option-btn");
  assert(optsAfterBack[0].classList.contains("selected"), "回到第 1 题后已选答案保持高亮");

  // 快速答完剩余题目
  app.selectOption(1); // Q1 answer=1, goto Q2

  const QUESTIONS = window.QUESTIONS;
  for (let i = window.state.currentQuestion; i < QUESTIONS.length; i++) {
    app.selectOption(i % 4);
  }

  const resultView = document.querySelector("#view-result");
  assert(resultView && !resultView.classList.contains("hidden"), "答完 24 题后显示结果页");
  assert(quizView.classList.contains("hidden"), "答完 24 题后隐藏答题页");
  assert(window.state.personaCode !== null, "答完后 personaCode 不为 null");

  const codeEl = document.querySelector("#result-code");
  const nameEl = document.querySelector("#result-name");
  assert(codeEl && codeEl.textContent.length >= 3, `结果页显示人格代号: "${codeEl?.textContent}"`);
  assert(nameEl && nameEl.textContent.length >= 2, `结果页显示中文名: "${nameEl?.textContent}"`);

  const dimItems = document.querySelectorAll("#dimensions-list .dim-item");
  assertEqual(dimItems.length, 4, "结果页渲染 4 个维度条");

  // ===== 7. 重新测试 =====
  app.restart();
  assert(startView && !startView.classList.contains("hidden"), "点击「重新测试」后显示首页");
  assert(resultView.classList.contains("hidden"), "点击「重新测试」后隐藏结果页");
  assertEqual(window.state.currentQuestion, 0, "重新开始后 currentQuestion 归零");
  assertEqual(window.state.answers.length, 0, "重新开始后 answers 清空");
  assertEqual(Object.values(window.state.scores).reduce((a, b) => a + b, 0), 0, "重新开始后 scores 归零");
  assert(window.state.personaCode === null, "重新开始后 personaCode 清空");

  // ===== 8. 深链参数检查 =====
  app.showResult("TNT");
  assert(document.querySelector("#result-code").textContent === "TNT", "showResult('TNT') 显示代号 TNT");
  assert(document.querySelector("#result-name").textContent === "野生熊孩子", "TNT 对应中文名正确");

  // ===== 9. 题目数据加载验证 =====
  assert(Array.isArray(window.QUESTIONS) && window.QUESTIONS.length === 24, "index.html 正确加载 QUESTIONS（24题）");

  // ===== 10. 人格数据完整性 =====
  assert(typeof window.PERSONAS === "object", "全局存在 PERSONAS 对象");
  assert(Object.keys(window.PERSONAS).length === 24, `PERSONAS 包含 24 种人格（实际 ${Object.keys(window.PERSONAS).length}）`);

  // ===== 11. URL 路由同步验证 =====
  const url = new window.URL(window.location.href);
  assert(url.searchParams.get("view") === "result", "结果页同步 URL view=result");
  assert(url.searchParams.get("code") === "TNT", "结果页同步 URL code=TNT");

  // ===== 12. OG meta 标签 =====
  assert(document.querySelector('meta[property="og:title"]'), "存在 og:title");
  assert(document.querySelector('meta[name="twitter:card"]'), "存在 twitter:card");

  // 汇总
  console.log("\n" + "━".repeat(40));
  console.log(`  通过: ${passed}  |  失败: ${failed}`);
  console.log("━".repeat(40) + "\n");

  process.exit(failed > 0 ? 1 : 0);
}, 500);
