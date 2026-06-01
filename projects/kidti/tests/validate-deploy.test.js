/**
 * Sprint #5 Evaluator — 美术资源 + 部署验收
 */

const fs = require("fs");
const path = require("path");

const DEPLOY_DIR = path.join(__dirname, "../deploy");
const { PERSONAS } = require("../src/config/personas.js");

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

// ===== 1. 人格配图检查 =====
const personasDir = path.join(DEPLOY_DIR, "assets", "personas");
const codes = Object.keys(PERSONAS);
let webpCount = 0;

codes.forEach(code => {
  const lower = code.toLowerCase().replace("?", "");
  const webpPath = path.join(personasDir, `persona-${lower}.webp`);
  if (fs.existsSync(webpPath)) {
    webpCount++;
  }
});
assert(webpCount === 24, `assets/personas/ 下存在 24 个 .webp 文件 (实际 ${webpCount})`);

// ===== 2. OG 图片检查 =====
const ogSquare = path.join(DEPLOY_DIR, "assets", "og-share-square.png");
const ogWide = path.join(DEPLOY_DIR, "assets", "og-share-wide.png");
assert(fs.existsSync(ogSquare), "存在 og-share-square.png");
assert(fs.existsSync(ogWide), "存在 og-share-wide.png");

// ===== 3. 背景纹理检查 =====
const bgTexture = path.join(DEPLOY_DIR, "assets", "bg-texture.webp");
assert(fs.existsSync(bgTexture), "存在 bg-texture.webp");

// ===== 4. 首页检查 =====
const indexPath = path.join(DEPLOY_DIR, "index.html");
assert(fs.existsSync(indexPath), "存在 index.html");

const html = fs.readFileSync(indexPath, "utf8");
assert(html.includes("儿童TI"), "HTML 包含品牌名");
assert(html.includes("开始测试"), "HTML 包含开始测试按钮");
assert(html.includes("QUESTIONS"), "HTML 内联了题目数据");
assert(html.includes("PERSONAS"), "HTML 内联了人格数据");

// ===== 5. 性能检查 =====
const htmlSize = fs.statSync(indexPath).size;
assert(htmlSize < 500 * 1024, `单文件 HTML ${(htmlSize/1024).toFixed(1)}KB < 500KB`);

// ===== 6. 安全审查 =====
assert(!html.includes("password"), "无密码硬编码");
assert(!html.includes("secret"), "无密钥硬编码");
assert(!html.includes("api_key"), "无 API key 硬编码");

console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log(`  通过: ${passed}  |  失败: ${failed}`);
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

process.exit(failed > 0 ? 1 : 0);
