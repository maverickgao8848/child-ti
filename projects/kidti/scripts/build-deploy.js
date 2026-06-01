/**
 * 生成 deploy/index.html —— 将 src/ui/index.html 中的外部 JS 引用内联
 * 用法：node build-deploy.js
 */

const fs = require('fs');
const path = require('path');

const SRC_HTML = path.join(__dirname, '../src/ui/index.html');
const OUT_HTML = path.join(__dirname, '../deploy/index.html');

let html = fs.readFileSync(SRC_HTML, 'utf-8');

// 内联 questions.js
const questionsJs = fs.readFileSync(path.join(__dirname, '../src/config/questions.js'), 'utf-8');
html = html.replace(
  '<script src="../config/questions.js"></script>',
  '<script>' + questionsJs + '</script>'
);

// 内联 scoring.js
const scoringJs = fs.readFileSync(path.join(__dirname, '../src/config/scoring.js'), 'utf-8');
html = html.replace(
  '<script src="../config/scoring.js"></script>',
  '<script>' + scoringJs + '</script>'
);

// 内联 personas.js
const personasJs = fs.readFileSync(path.join(__dirname, '../src/config/personas.js'), 'utf-8');
html = html.replace(
  '<script src="../config/personas.js"></script>',
  '<script>' + personasJs + '</script>'
);

// 将开发路径替换为发布路径（./assets/ → assets/，确保路径一致性）
html = html.replace(/\.\/assets\//g, 'assets/');

fs.writeFileSync(OUT_HTML, html, 'utf-8');

const size = fs.statSync(OUT_HTML).size;
console.log(`✅ deploy/index.html 已生成`);
console.log(`📦 文件大小: ${(size/1024).toFixed(1)} KB`);
console.log(`📁 输出: ${OUT_HTML}`);
