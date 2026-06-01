/**
 * 合并 docs 下的定制化人格报告到 projects 的 personas.js
 * 策略：保留 projects 的 v1.0 字段（description, reading, slogan），
 *       用 docs 的 v2.0 字段覆盖（components, scenarios, hidden, relations, prophecy）
 */

const fs = require('fs');
const path = require('path');

// 1. 读取 docs 下的 quadrant JSON 文件
const quadrantFiles = [
  'docs/quadrant1_battery_sheep.json',
  'docs/quadrant2_battery_wolf.json',
  'docs/quadrant3_reactor_sheep.json',
  'docs/quadrant4_reactor_wolf.json'
];

const docsPersonas = [];
for (const file of quadrantFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  const arr = JSON.parse(content);
  docsPersonas.push(...arr);
}

console.log(`Loaded ${docsPersonas.length} personas from docs quadrants`);

// 2. 读取 projects 下的 personas.js 获取 v1.0 字段
const projPath = 'projects/kidti/src/config/personas.js';
const projContent = fs.readFileSync(projPath, 'utf-8');

// 用 Function 构造器安全地解析对象（proj 文件没有外部依赖）
const projPersonas = (new Function(projContent + '; return PERSONAS;'))();
console.log(`Loaded ${Object.keys(projPersonas).length} personas from projects config`);

// 3. 合并
const merged = {};
for (const dp of docsPersonas) {
  const code = dp.code;
  const pp = projPersonas[code];

  if (!pp) {
    console.warn(`Warning: projects config missing persona ${code}, creating from docs only`);
    merged[code] = {
      name: dp.name,
      definition: dp.tagline,
      description: '',
      reading: '',
      slogan: '',
      components: dp.components,
      scenarios: dp.scenarios,
      hidden: dp.hidden,
      relations: dp.relations,
      prophecy: dp.prophecy
    };
    continue;
  }

  merged[code] = {
    name: dp.name,
    definition: dp.tagline,
    description: pp.description || '',
    reading: pp.reading || '',
    slogan: pp.slogan || '',
    components: dp.components,
    scenarios: dp.scenarios,
    hidden: dp.hidden,
    relations: dp.relations,
    prophecy: dp.prophecy
  };
}

// 检查是否有缺失
const docsCodes = docsPersonas.map(p => p.code).sort();
const mergedCodes = Object.keys(merged).sort();
if (docsCodes.length !== mergedCodes.length) {
  console.warn(`Mismatch: docs has ${docsCodes.length}, merged has ${mergedCodes.length}`);
}

// 4. 生成新的 JS 文件内容
function escapeStr(str) {
  return JSON.stringify(str);
}

function serializePersona(code, p) {
  const lines = [];
  lines.push(`  ${escapeStr(code)}: {`);
  lines.push(`    name: ${escapeStr(p.name)},`);
  lines.push(`    definition: ${escapeStr(p.definition)},`);
  lines.push(`    description: ${escapeStr(p.description)},`);
  lines.push(`    reading: ${escapeStr(p.reading)},`);
  lines.push(`    slogan: ${escapeStr(p.slogan)},`);
  lines.push(``);
  lines.push(`    // ===== v2.0 新增：人格成分解析 =====`);
  lines.push(`    components: {`);
  lines.push(`      nrg: ${escapeStr(p.components.nrg)},`);
  lines.push(`      rul: ${escapeStr(p.components.rul)},`);
  lines.push(`      pre: ${escapeStr(p.components.pre)},`);
  lines.push(`      emo: ${escapeStr(p.components.emo)}`);
  lines.push(`    },`);
  lines.push(``);
  lines.push(`    // ===== v2.0 新增：情境剧本 =====`);
  lines.push(`    scenarios: {`);
  lines.push(`      family: ${escapeStr(p.scenarios.family)},`);
  lines.push(`      classroom: ${escapeStr(p.scenarios.classroom)},`);
  lines.push(`      social: ${escapeStr(p.scenarios.social)},`);
  lines.push(`      alone: ${escapeStr(p.scenarios.alone)},`);
  lines.push(`      crisis: ${escapeStr(p.scenarios.crisis)}`);
  lines.push(`    },`);
  lines.push(``);
  lines.push(`    // ===== v2.0 新增：隐藏档案 =====`);
  lines.push(`    hidden: ${escapeStr(p.hidden)},`);
  lines.push(``);
  lines.push(`    // ===== v2.0 新增：人格关系谱 =====`);
  lines.push(`    relations: {`);
  lines.push(`      best: {`);
  lines.push(`        code: ${escapeStr(p.relations.best.code)},`);
  lines.push(`        name: ${escapeStr(p.relations.best.name)},`);
  lines.push(`        reason: ${escapeStr(p.relations.best.reason)}`);
  lines.push(`      },`);
  lines.push(`      worst: {`);
  lines.push(`        code: ${escapeStr(p.relations.worst.code)},`);
  lines.push(`        name: ${escapeStr(p.relations.worst.name)},`);
  lines.push(`        reason: ${escapeStr(p.relations.worst.reason)}`);
  lines.push(`      },`);
  lines.push(`      mystery: {`);
  lines.push(`        code: ${escapeStr(p.relations.mystery.code)},`);
  lines.push(`        name: ${escapeStr(p.relations.mystery.name)},`);
  lines.push(`        reason: ${escapeStr(p.relations.mystery.reason)}`);
  lines.push(`      }`);
  lines.push(`    },`);
  lines.push(``);
  lines.push(`    // ===== v2.0 新增：成长预言 =====`);
  lines.push(`    prophecy: ${escapeStr(p.prophecy)}`);
  lines.push(`  }`);
  return lines.join('\n');
}

const outLines = [];
outLines.push(`/**`);
outLines.push(` * KidTI 24 种人格完整数据（v2.0 — 童年人格全景档案）`);
outLines.push(` * 包含核心画像 + 人格成分解析 + 情境剧本 + 隐藏档案 + 人格关系谱 + 成长预言`);
outLines.push(` * 自动生成时间：${new Date().toISOString()}`);
outLines.push(` */`);
outLines.push(``);
outLines.push(`const PERSONAS = {`);

const codes = Object.keys(merged).sort((a, b) => {
  // 按象限顺序排序
  const order = [
    'KPBL','WALL','IMOK','KPI','DAREN','CTRLC',
    'NUKE','DAMN','NEIG','TNT','STUDY','GODD',
    'GLUE','502ER','RUOK?','JOKER','MAPI','TRUMP',
    'CHAOS','STEAM','IPHONE','BOSS','YINM','ELON'
  ];
  return order.indexOf(a) - order.indexOf(b);
});

for (let i = 0; i < codes.length; i++) {
  outLines.push(serializePersona(codes[i], merged[codes[i]]));
  if (i < codes.length - 1) outLines.push(',');
}

outLines.push(`};`);
outLines.push(``);
outLines.push(`if (typeof module !== "undefined" && module.exports) {`);
outLines.push(`  module.exports = { PERSONAS };`);
outLines.push(`}`);

fs.writeFileSync(projPath, outLines.join('\n') + '\n', 'utf-8');
console.log(`Written ${codes.length} personas to ${projPath}`);

// 5. 归档旧的 quadrant JSON 文件
const archiveDir = 'docs/kidti/archives/old-persona-reports';
fs.mkdirSync(archiveDir, { recursive: true });

for (const file of quadrantFiles) {
  const basename = path.basename(file);
  fs.renameSync(file, path.join(archiveDir, basename));
  console.log(`Archived ${basename} -> ${archiveDir}/`);
}

console.log('Done!');
