/**
 * 批量扩展 personas.js，为所有24种人格添加 v2.0 诊断书字段
 * 基于现有人格数据自动生成占位内容
 * 用法：node expand-personas.js
 */

const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '../src/config/personas.js');
const OUT = path.join(__dirname, '../src/config/personas.js');

// 读取现有文件内容，提取 PERSONAS 对象
const raw = fs.readFileSync(SRC, 'utf-8');

// 用 Function 安全执行来获取 PERSONAS
let PERSONAS;
const fn = new Function('module', raw + '; return PERSONAS;');
PERSONAS = fn({ exports: {} });

// 维度解析：每个人格对应的4维度极值
const DIMENSION_MAP = {
  KPBL:  { nrg: 'BATTERY', rul: 'SHEEP', pre: 'BLACKHOLE', emo: 'STORM' },
  WALL:  { nrg: 'BATTERY', rul: 'SHEEP', pre: 'BLACKHOLE', emo: 'LAKE' },
  IMOK:  { nrg: 'BATTERY', rul: 'SHEEP', pre: 'BLACKHOLE', emo: 'FOG' },
  KPI:   { nrg: 'BATTERY', rul: 'SHEEP', pre: 'SPOTLIGHT', emo: 'STORM' },
  DAREN: { nrg: 'BATTERY', rul: 'SHEEP', pre: 'SPOTLIGHT', emo: 'LAKE' },
  CTRLC: { nrg: 'BATTERY', rul: 'SHEEP', pre: 'SPOTLIGHT', emo: 'FOG' },
  NUKE:  { nrg: 'BATTERY', rul: 'WOLF',  pre: 'BLACKHOLE', emo: 'STORM' },
  DAMN:  { nrg: 'BATTERY', rul: 'WOLF',  pre: 'BLACKHOLE', emo: 'LAKE' },
  NEIG:  { nrg: 'BATTERY', rul: 'WOLF',  pre: 'BLACKHOLE', emo: 'FOG' },
  TNT:   { nrg: 'BATTERY', rul: 'WOLF',  pre: 'SPOTLIGHT', emo: 'STORM' },
  STUDY: { nrg: 'BATTERY', rul: 'WOLF',  pre: 'SPOTLIGHT', emo: 'LAKE' },
  GODD:  { nrg: 'BATTERY', rul: 'WOLF',  pre: 'SPOTLIGHT', emo: 'FOG' },
  GLUE:  { nrg: 'REACTOR', rul: 'SHEEP', pre: 'BLACKHOLE', emo: 'STORM' },
  '502ER':{ nrg: 'REACTOR', rul: 'SHEEP', pre: 'BLACKHOLE', emo: 'LAKE' },
  'RUOK?':{ nrg: 'REACTOR', rul: 'SHEEP', pre: 'BLACKHOLE', emo: 'FOG' },
  JOKER: { nrg: 'REACTOR', rul: 'SHEEP', pre: 'SPOTLIGHT', emo: 'STORM' },
  MAPI:  { nrg: 'REACTOR', rul: 'SHEEP', pre: 'SPOTLIGHT', emo: 'LAKE' },
  TRUMP: { nrg: 'REACTOR', rul: 'SHEEP', pre: 'SPOTLIGHT', emo: 'FOG' },
  CHAOS: { nrg: 'REACTOR', rul: 'WOLF',  pre: 'BLACKHOLE', emo: 'STORM' },
  STEAM: { nrg: 'REACTOR', rul: 'WOLF',  pre: 'BLACKHOLE', emo: 'LAKE' },
  IPHONE:{ nrg: 'REACTOR', rul: 'WOLF',  pre: 'BLACKHOLE', emo: 'FOG' },
  BOSS:  { nrg: 'REACTOR', rul: 'WOLF',  pre: 'SPOTLIGHT', emo: 'STORM' },
  YINM:  { nrg: 'REACTOR', rul: 'WOLF',  pre: 'SPOTLIGHT', emo: 'LAKE' },
  ELON:  { nrg: 'REACTOR', rul: 'WOLF',  pre: 'SPOTLIGHT', emo: 'FOG' },
};

// 维度描述模板
const DIM_TEMPLATES = {
  nrg: {
    BATTERY: () => `你是 BATTERY（充电型）——独处是你的能量来源，社交对你来说是耗电而非充电。在人群中你总能保持得体，但代价是回到房间后需要很长一段时间才能恢复。你的能量管理非常精细，像一台省电模式的手机，总是把最后一格电留给最重要的事。`,
    REACTOR: () => `你是 REACTOR（放电型）——你不需要充电，你就是能量本身。别人的休息时间是待机，你的休息时间是低功率运行。你越折腾越精神，安静反而让你焦虑。你的存在本身就是一种持续的能量输出，靠近你的人会感觉到热度。`
  },
  rul: {
    SHEEP: () => `你是 SHEEP（顺毛型）——「乖」是你最早的生存策略。你不是不懂反抗，而是太早学会了计算代价：一次顶嘴换来的麻烦，比忍下来的委屈更让你窒息。你遵守规则不是因为认同，而是因为恐惧失控的后果。`,
    WOLF: () => `你是 WOLF（反骨型）——规则在你眼里就是用来被打破的。你不是因为叛逆而叛逆，而是因为你真的看不到服从的意义。别人眼中的「正常」在你看来只是「大多数人在假装」，而你不想假装。`
  },
  pre: {
    BLACKHOLE: () => `你是 BLACKHOLE（黑洞型）——你习惯待在人群边缘，不想被看见，也不觉得被看见有什么好处。你的存在感极低，低到老师点名时经常跳过你。但你并非没有观察力，恰恰相反，你看得太多，只是选择不说。`,
    SPOTLIGHT: () => `你是 SPOTLIGHT（聚光型）——你无法忍受被忽视，哪怕是以负面方式被关注。你必须站在舞台中央，如果没人给你舞台，你会自己搭一个。你的存在感是强制的、侵略性的，有时候你自己都控制不住。`
  },
  emo: {
    STORM: () => `你是 STORM（暴雨型）——你的情绪来得快去得也快，但来的时候排山倒海。你不藏着掖着，开心就笑，难过就哭，生气就砸东西。大人总说「你怎么这么情绪化」，但你自己觉得：至少我是真实的。`,
    LAKE: () => `你是 LAKE（静海型）——你的情绪深藏在水面之下，表面永远风平浪静。别人看不出你开心还是难过，有时候连你自己都分不清。你不是没有感觉，只是太早学会了把情绪压缩成一个点，藏进最深的抽屉。`,
    FOG: () => `你是 FOG（迷雾型）——你的情绪没有固定模式，有时候外放得像暴风雨，有时候内敛得像深湖，连你自己都预测不了下一秒是哪种。你不是中间型，你是「不知道啥时候会爆型」——表面最正常，突然最吓人。`
  }
};

// 情境模板生成器
function makeScenarios(code, name, definition) {
  const dims = DIMENSION_MAP[code];
  const isReactor = dims.nrg === 'REACTOR';
  const isWolf = dims.rul === 'WOLF';
  const isSpotlight = dims.pre === 'SPOTLIGHT';
  const emo = dims.emo;

  const family = isWolf
    ? `晚饭时父母问你今天在学校怎么样。你低头扒饭，含糊地说「还行」。心里却在想：如果我说实话，这顿饭就别想安静地吃完了。你已经学会了用沉默保护自己——不是撒谎，只是选择性呈现。`
    : `晚饭时父母问你今天在学校怎么样。你立刻开始汇报：今天考了第几名、老师表扬了谁、作业是什么。你不确定他们真的想听，但你已经习惯了用「好消息」换取「平安度过晚餐时间」的权利。`;

  const classroom = isSpotlight
    ? `数学课上老师提了一个你不会的问题。全班安静，你脑子里第一个念头不是「糟了我不会」，而是「现在所有人都在看谁第一个回答」。你甚至有点享受这种被注视的压力——哪怕你根本不知道答案。`
    : `数学课上老师提了一个你不会的问题。你立刻低下头，心里默念「不要点我不要点我」。你的存在感在这时候变成了优势——低到老师扫视一圈，目光掠过你，落在了更显眼的人身上。你松了口气，同时也有一点点失落。`;

  const social = isReactor
    ? `下课铃响，同学们三五成群出去活动。你第一个冲出教室，不知道接下来要干什么，但就是不能待在座位上。你需要人群、需要动静、需要某种事情正在发生的感觉——哪怕你只是围观。`
    : `下课铃响，同学们三五成群出去活动。你假装在收拾书包，等人群散得差不多了，才慢慢走向走廊。你不讨厌人群，但你不知道怎么加入一个已经形成的小团体。与其被排斥，不如先撤退。`;

  const alone = emo === 'STORM'
    ? `放学后一个人待在房间里。你把书包一扔，打开音乐开到最大声。独处对你来说是情绪释放的授权——没有观众，没有评判，你可以把今天攒下来的所有不爽一次性倒出来。`
    : emo === 'LAKE'
    ? `放学后一个人待在房间里。你坐在床边发呆，脑海里回放着今天发生的每一件小事。你不是在反思，你只是在「处理」——把情绪一件件归档，放进对应的抽屉里。等全部整理完，天已经黑了。`
    : `放学后一个人待在房间里。有时候你发疯一样打游戏，有时候你盯着天花板一小时不动。你自己也不知道独处时的你才是真正的你，还是独处时的你才是伪装脱落后的残骸。`;

  const crisis = isWolf
    ? `同桌不小心把你的文具盒撞掉了。你第一反应不是捡，而是盯着他看。三秒钟的沉默里，你在快速计算：这事值不值得闹大？闹大了会有什么后果？最后你决定——算了，但你会记住这件事。`
    : `同桌不小心把你的文具盒撞掉了。你连忙说「没事没事」，蹲下去捡的时候还在担心对方会不会觉得你很麻烦。你把委屈咽下去，像咽下今天第一百件小事一样熟练。`;

  return { family, classroom, social, alone, crisis };
}

// 隐藏档案生成
function makeHidden(code, name, reading) {
  const templates = [
    `表面上你是${name}，其实你只是不知道除了这个身份之外，自己还能是谁。你早就把「表演」和「真实」混在一起了，连卸妆的时候都带着面具。`,
    `别人看到的${name}只是你的外壳。真正的你藏在一个连你自己都不敢打开的房间深处——不是不想打开，是怕打开之后发现里面空无一物。`,
    `你比任何人都清楚${name}这个标签有多荒谬。但你同时也害怕：如果不当${name}，你还能当什么？这个问题你从来不敢认真想。`,
  ];
  return templates[code.length % 3];
}

// 关系谱（硬编码映射，确保跨象限）
const RELATION_MAP = {
  KPBL:  { best: 'GODD', worst: 'TNT', mystery: 'ELON' },
  WALL:  { best: 'DAREN', worst: 'BOSS', mystery: 'RUOK?' },
  IMOK:  { best: 'CTRLC', worst: 'TNT', mystery: 'IPHONE' },
  KPI:   { best: 'DAREN', worst: 'CHAOS', mystery: '502ER' },
  DAREN: { best: 'KPI', worst: 'TNT', mystery: 'IPHONE' },
  CTRLC: { best: 'IMOK', worst: 'TNT', mystery: 'ELON' },
  NUKE:  { best: 'DAMN', worst: 'MAPI', mystery: '502ER' },
  DAMN:  { best: 'NUKE', worst: 'MAPI', mystery: 'GLUE' },
  NEIG:  { best: 'TRUMP', worst: 'KPBL', mystery: '502ER' },
  TNT:   { best: 'BOSS', worst: 'WALL', mystery: 'IMOK' },
  STUDY: { best: 'BOSS', worst: 'MAPI', mystery: '502ER' },
  GODD:  { best: 'KPBL', worst: 'DAREN', mystery: 'WALL' },
  GLUE:  { best: '502ER', worst: 'DAMN', mystery: 'YINM' },
  '502ER':{ best: 'GLUE', worst: 'DAMN', mystery: 'YINM' },
  'RUOK?':{ best: 'TRUMP', worst: 'KPBL', mystery: 'WALL' },
  JOKER: { best: 'TRUMP', worst: 'WALL', mystery: 'DAREN' },
  MAPI:  { best: 'DAREN', worst: 'NUKE', mystery: 'TNT' },
  TRUMP: { best: 'NEIG', worst: 'KPBL', mystery: 'WALL' },
  CHAOS: { best: 'BOSS', worst: 'KPI', mystery: 'DAREN' },
  STEAM: { best: 'YINM', worst: 'JOKER', mystery: 'GLUE' },
  IPHONE:{ best: 'ELON', worst: 'JOKER', mystery: 'GLUE' },
  BOSS:  { best: 'STUDY', worst: 'WALL', mystery: '502ER' },
  YINM:  { best: 'STEAM', worst: 'JOKER', mystery: 'GLUE' },
  ELON:  { best: 'IPHONE', worst: 'KPBL', mystery: 'WALL' },
};

const RELATION_REASONS = {
  best: (b) => `${b.name}能补你的短板，或者能跟你一起搞大事——你们是天生的搭档。`,
  worst: (b) => `${b.name}的存在本身就是对你价值观的冒犯，看到对方你会生理性不适。`,
  mystery: (b) => `${b.name}的行为逻辑完全在你的理解范围之外，你花一辈子也搞不懂TA在想什么。`,
};

// 成长预言生成
function makeProphecy(code, name, dims) {
  const prophecies = {
    BATTERY: `长大后你会成为一个「高功能」的人——表面稳定、效率极高、从不让人失望。但你心里清楚，这种稳定是靠不断透支自己换来的。你需要学会的第一件事是：偶尔让别人失望，天不会塌。`,
    REACTOR: `长大后你大概率会在需要持续输出能量的领域找到位置——创业、演艺、销售、或者任何不允许你停下来的工作。你需要警惕的是：别把「停不下来」当成「活着」的唯一方式。`,
  };
  return dims.nrg === 'REACTOR' ? prophecies.REACTOR : prophecies.BATTERY;
}

// 主流程：为每个人格生成新字段
Object.keys(PERSONAS).forEach(code => {
  const p = PERSONAS[code];
  const dims = DIMENSION_MAP[code];

  // components
  p.components = {
    nrg: DIM_TEMPLATES.nrg[dims.nrg](),
    rul: DIM_TEMPLATES.rul[dims.rul](),
    pre: DIM_TEMPLATES.pre[dims.pre](),
    emo: DIM_TEMPLATES.emo[dims.emo](),
  };

  // scenarios
  p.scenarios = makeScenarios(code, p.name, p.definition);

  // hidden
  p.hidden = makeHidden(code, p.name, p.reading);

  // relations
  const rel = RELATION_MAP[code];
  const all = PERSONAS;
  p.relations = {
    best:    { code: rel.best,    name: all[rel.best].name,    reason: RELATION_REASONS.best(all[rel.best]) },
    worst:   { code: rel.worst,   name: all[rel.worst].name,   reason: RELATION_REASONS.worst(all[rel.worst]) },
    mystery: { code: rel.mystery, name: all[rel.mystery].name, reason: RELATION_REASONS.mystery(all[rel.mystery]) },
  };

  // prophecy
  p.prophecy = makeProphecy(code, p.name, dims);
});

// 生成新的 JS 文件内容
function quote(str) {
  return JSON.stringify(str);
}

const lines = [
  '/**',
  ' * KidTI 24 种人格完整数据（v2.0 — 童年人格全景档案）',
  ' * 包含核心画像 + 人格成分解析 + 情境剧本 + 隐藏档案 + 人格关系谱 + 成长预言',
  ' */',
  '',
  'const PERSONAS = {',
];

const keys = Object.keys(PERSONAS);
keys.forEach((code, idx) => {
  const p = PERSONAS[code];
  const comma = idx < keys.length - 1 ? ',' : '';

  lines.push(`  ${quote(code)}: {`);
  lines.push(`    name: ${quote(p.name)},`);
  lines.push(`    definition: ${quote(p.definition)},`);
  lines.push(`    description: ${quote(p.description)},`);
  lines.push(`    reading: ${quote(p.reading)},`);
  lines.push(`    slogan: ${quote(p.slogan)},`);
  lines.push('');
  lines.push('    // ===== v2.0 新增：人格成分解析 =====');
  lines.push('    components: {');
  lines.push(`      nrg: ${quote(p.components.nrg)},`);
  lines.push(`      rul: ${quote(p.components.rul)},`);
  lines.push(`      pre: ${quote(p.components.pre)},`);
  lines.push(`      emo: ${quote(p.components.emo)}`);
  lines.push('    },');
  lines.push('');
  lines.push('    // ===== v2.0 新增：情境剧本 =====');
  lines.push('    scenarios: {');
  lines.push(`      family: ${quote(p.scenarios.family)},`);
  lines.push(`      classroom: ${quote(p.scenarios.classroom)},`);
  lines.push(`      social: ${quote(p.scenarios.social)},`);
  lines.push(`      alone: ${quote(p.scenarios.alone)},`);
  lines.push(`      crisis: ${quote(p.scenarios.crisis)}`);
  lines.push('    },');
  lines.push('');
  lines.push('    // ===== v2.0 新增：隐藏档案 =====');
  lines.push(`    hidden: ${quote(p.hidden)},`);
  lines.push('');
  lines.push('    // ===== v2.0 新增：人格关系谱 =====');
  lines.push('    relations: {');
  lines.push('      best: {');
  lines.push(`        code: ${quote(p.relations.best.code)},`);
  lines.push(`        name: ${quote(p.relations.best.name)},`);
  lines.push(`        reason: ${quote(p.relations.best.reason)}`);
  lines.push('      },');
  lines.push('      worst: {');
  lines.push(`        code: ${quote(p.relations.worst.code)},`);
  lines.push(`        name: ${quote(p.relations.worst.name)},`);
  lines.push(`        reason: ${quote(p.relations.worst.reason)}`);
  lines.push('      },');
  lines.push('      mystery: {');
  lines.push(`        code: ${quote(p.relations.mystery.code)},`);
  lines.push(`        name: ${quote(p.relations.mystery.name)},`);
  lines.push(`        reason: ${quote(p.relations.mystery.reason)}`);
  lines.push('      }');
  lines.push('    },');
  lines.push('');
  lines.push('    // ===== v2.0 新增：成长预言 =====');
  lines.push(`    prophecy: ${quote(p.prophecy)}`);
  lines.push(`  }${comma}`);
  lines.push('');
});

lines.push('};');
lines.push('');
lines.push('if (typeof module !== "undefined" && module.exports) {');
lines.push('  module.exports = { PERSONAS };');
lines.push('}');

fs.writeFileSync(OUT, lines.join('\n'), 'utf-8');
console.log(`✅ 已扩展 ${keys.length} 种人格的数据结构`);
console.log(`📁 输出: ${OUT}`);
