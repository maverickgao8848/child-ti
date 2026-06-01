/**
 * Sprint #4 Evaluator — 分享海报 + OG 卡片验收
 */

const fs = require("fs");
const path = require("path");

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

let html = fs.readFileSync(HTML_PATH, "utf-8");

// ===== 1. OG Meta 标签检查 =====
assert(html.includes('og:title'), "存在 og:title");
assert(html.includes('og:description'), "存在 og:description");
assert(html.includes('og:image'), "存在 og:image");
assert(html.includes('twitter:card'), "存在 twitter:card");

// ===== 2. 分享功能检查 =====
assert(html.includes('shareResult'), "存在 shareResult 方法");
assert(html.includes('copyLink'), "存在 copyLink 方法");
assert(html.includes('btn-copy'), "存在复制链接按钮");

// ===== 3. 海报功能检查 =====
assert(html.includes('poster-modal'), "存在海报模态框");
assert(html.includes('poster-canvas'), "存在海报 canvas");
assert(html.includes('generatePoster'), "存在 generatePoster 方法");
assert(html.includes('showPoster'), "存在 showPoster 方法");
assert(html.includes('closePoster'), "存在 closePoster 方法");
assert(html.includes('savePoster'), "存在 savePoster 方法");
assert(html.includes('toBlob'), "使用 canvas.toBlob");
assert(html.includes('kjua'), "引入 kjua 二维码库");

// ===== 4. 海报尺寸检查 =====
assert(html.includes('<script src="./kjua.min.js"></script>'), "src page loads kjua");
assert(html.includes('renderInlineQRCode'), "result page renders inline QR");
assert(html.includes("render: 'canvas'"), "QR uses canvas rendering");
assert(!html.includes('navigator.share(shareData)'), "share button does not trigger blocking native share/copy");
assert(html.includes('document.body.appendChild(modal)'), "poster modal is moved outside scroll container");

const canvasMatch = html.match(/id="poster-canvas"[^>]*width="(\d+)"[^>]*height="(\d+)"/);
if (canvasMatch) {
  const w = parseInt(canvasMatch[1]);
  const h = parseInt(canvasMatch[2]);
  assert(w === 750 && h === 1334, `海报尺寸为 ${w}x${h} (期望 750x1334)`);
} else {
  assert(false, "找不到 canvas 尺寸");
}

// ===== 5. 海报元素检查 =====
assert(html.includes('儿童TI'), "海报包含品牌名");
assert(html.includes('扫码测测你是什么儿童'), "海报包含扫码文案");

console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log(`  通过: ${passed}  |  失败: ${failed}`);
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

process.exit(failed > 0 ? 1 : 0);
