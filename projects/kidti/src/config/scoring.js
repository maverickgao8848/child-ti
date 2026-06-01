/**
 * KidTI 计分配置与辅助函数
 */

// D4 情绪天气 FOG（迷雾型）判定阈值
// 基于实际分值校准：6 题 × ±2 极端横跳方差 = 4，取 3.5 确保横跳触发 FOG
const FOG_VARIANCE_THRESHOLD = 3.5;

// 维度极性定义
const DIMENSION_POLARITY = {
  NRG: { high: "BATTERY", low: "REACTOR" },
  RUL: { high: "SHEEP", low: "WOLF" },
  PRE: { high: "BLACKHOLE", low: "SPOTLIGHT" },
  EMO: { high: "STORM", low: "LAKE", fog: "FOG" },
};

// 人格映射表（D1+D2 象限 × D3 × D4）
const PERSONA_MAP = {
  "BATTERY+SHEEP": {
    BLACKHOLE: { STORM: "KPBL", LAKE: "WALL", FOG: "IMOK" },
    SPOTLIGHT: { STORM: "KPI", LAKE: "DAREN", FOG: "CTRLC" },
  },
  "BATTERY+WOLF": {
    BLACKHOLE: { STORM: "NUKE", LAKE: "DAMN", FOG: "NEIG" },
    SPOTLIGHT: { STORM: "TNT", LAKE: "STUDY", FOG: "GODD" },
  },
  "REACTOR+SHEEP": {
    BLACKHOLE: { STORM: "GLUE", LAKE: "502ER", FOG: "RUOK" },
    SPOTLIGHT: { STORM: "JOKER", LAKE: "MAPI", FOG: "TRUMP" },
  },
  "REACTOR+WOLF": {
    BLACKHOLE: { STORM: "CHAOS", LAKE: "STEAM", FOG: "IPHONE" },
    SPOTLIGHT: { STORM: "BOSS", LAKE: "YINM", FOG: "ELON" },
  },
};

/**
 * 计算 D4 方差与判定结果
 * @param {number[]} d4Scores - 用户每道 D4 题选择的 EMO 分值数组（如 [2, -1, -2, 1, 2, -2]）
 * @returns {{ mean: number, variance: number, result: "STORM" | "LAKE" | "FOG" }}
 */
function calculateD4(d4Scores) {
  const n = d4Scores.length;
  if (n === 0) return { mean: 0, variance: 0, result: "FOG" };

  const mean = d4Scores.reduce((a, b) => a + b, 0) / n;
  const variance = d4Scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / n;

  let result;
  if (variance > FOG_VARIANCE_THRESHOLD) {
    result = "FOG";
  } else if (mean > 0) {
    result = "STORM";
  } else {
    result = "LAKE";
  }

  return { mean, variance, result };
}

/**
 * 根据四维度结果匹配人格代号
 * @param {{ NRG: string, RUL: string, PRE: string, EMO: string }} dimensions
 * @returns {string} 人格代号
 */
function matchPersona(dimensions) {
  const key = `${dimensions.NRG}+${dimensions.RUL}`;
  return PERSONA_MAP[key]?.[dimensions.PRE]?.[dimensions.EMO] || null;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    FOG_VARIANCE_THRESHOLD,
    DIMENSION_POLARITY,
    PERSONA_MAP,
    calculateD4,
    matchPersona,
  };
}
