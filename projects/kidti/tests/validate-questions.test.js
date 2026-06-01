/**
 * Evaluator：题目数据格式与逻辑校验
 * 运行：node projects/kidti/tests/validate-questions.test.js
 */

const assert = require("assert");
const { QUESTIONS } = require("../src/config/questions");
const {
  FOG_VARIANCE_THRESHOLD,
  calculateD4,
} = require("../src/config/scoring");

const VALID_DIMENSIONS = new Set(["NRG", "RUL", "PRE", "EMO"]);
const VALID_SCORES = new Set([-2, -1, 1, 2]);

let pass = 0;
let fail = 0;

function check(name, fn) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
    pass++;
  } catch (err) {
    console.log(`  ❌ ${name}: ${err.message}`);
    fail++;
  }
}

console.log("\n📋 Sprint #1 Evaluator — 题目数据校验\n");

// Criterion 1: 题目总数与维度分布
check("QUESTIONS.length === 24", () => {
  assert.strictEqual(QUESTIONS.length, 24, `实际 ${QUESTIONS.length} 题`);
});

check("每维度恰好 6 题", () => {
  const counts = { NRG: 0, RUL: 0, PRE: 0, EMO: 0 };
  QUESTIONS.forEach((q) => {
    assert.ok(counts[q.dimension] !== undefined, `未知维度 ${q.dimension}`);
    counts[q.dimension]++;
  });
  Object.entries(counts).forEach(([dim, count]) => {
    assert.strictEqual(count, 6, `${dim} 实际 ${count} 题`);
  });
});

// Criterion 2: 每题结构完整性
check("每道题有 id / dimension / text / options", () => {
  QUESTIONS.forEach((q, i) => {
    assert.ok(q.id !== undefined, `第 ${i} 题缺少 id`);
    assert.ok(q.dimension, `第 ${i} 题缺少 dimension`);
    assert.ok(q.text && q.text.length > 0, `第 ${i} 题 text 为空`);
    assert.ok(Array.isArray(q.options), `第 ${i} 题 options 非数组`);
  });
});

check("每题恰好 4 个选项", () => {
  QUESTIONS.forEach((q) => {
    assert.strictEqual(q.options.length, 4, `Q${q.id} 有 ${q.options.length} 个选项`);
  });
});

check("选项 label 为 A/B/C/D", () => {
  const labels = ["A", "B", "C", "D"];
  QUESTIONS.forEach((q) => {
    q.options.forEach((opt, i) => {
      assert.strictEqual(opt.label, labels[i], `Q${q.id} 选项 ${i} label 错误`);
    });
  });
});

// Criterion 3: scores 合法
check("每选项包含 scores 对象且至少有一个维度", () => {
  QUESTIONS.forEach((q) => {
    q.options.forEach((opt) => {
      assert.ok(
        opt.scores && typeof opt.scores === "object",
        `Q${q.id} 选项 ${opt.label} 缺少 scores`
      );
      const dims = Object.keys(opt.scores);
      assert.ok(dims.length >= 1, `Q${q.id} 选项 ${opt.label} scores 为空`);
      assert.ok(
        dims.length <= 2,
        `Q${q.id} 选项 ${opt.label} scores 维度超过 2 个`
      );
    });
  });
});

check("scores 维度键名合法", () => {
  QUESTIONS.forEach((q) => {
    q.options.forEach((opt) => {
      Object.keys(opt.scores).forEach((dim) => {
        assert.ok(VALID_DIMENSIONS.has(dim), `非法维度 ${dim} @ Q${q.id}`);
      });
    });
  });
});

check("scores 取值合法（±1 / ±2）", () => {
  QUESTIONS.forEach((q) => {
    q.options.forEach((opt) => {
      Object.values(opt.scores).forEach((val) => {
        assert.ok(VALID_SCORES.has(val), `非法分值 ${val} @ Q${q.id}`);
      });
    });
  });
});

// Criterion 4: D4 题目 EMO 分值宽幅
check("D4 题目选项 EMO 分值覆盖足够宽幅", () => {
  const d4Questions = QUESTIONS.filter((q) => q.dimension === "EMO");
  d4Questions.forEach((q) => {
    const emoScores = q.options.map((opt) => opt.scores.EMO).filter((v) => v !== undefined);
    const range = Math.max(...emoScores) - Math.min(...emoScores);
    assert.ok(
      range >= 3,
      `Q${q.id} EMO 分值宽幅 ${range}，需 >= 3 以支持 FOG 判定`
    );
  });
});

// Criterion 5: FOG 阈值合理性
check("FOG 阈值 = 3.5（校准后，确保极端横跳触发 FOG）", () => {
  assert.strictEqual(FOG_VARIANCE_THRESHOLD, 3.5);
});

check("D4 极端横跳可触发 FOG（方差 > 阈值）", () => {
  // 模拟最极端横跳：3题选 +2，3题选 -2
  const extreme = [2, 2, 2, -2, -2, -2];
  const result = calculateD4(extreme);
  assert.ok(
    result.variance > FOG_VARIANCE_THRESHOLD,
    `极端横跳方差 ${result.variance} 应 > ${FOG_VARIANCE_THRESHOLD}`
  );
  assert.strictEqual(result.result, "FOG");
});

check("D4 全部外放判定 STORM", () => {
  const storm = [2, 2, 1, 2, 1, 2];
  const result = calculateD4(storm);
  assert.strictEqual(result.result, "STORM");
});

check("D4 全部内敛判定 LAKE", () => {
  const lake = [-2, -1, -2, -1, -2, -2];
  const result = calculateD4(lake);
  assert.strictEqual(result.result, "LAKE");
});

// Criterion 6: 场景多样性
check("题目文案无空值且长度合理", () => {
  QUESTIONS.forEach((q) => {
    assert.ok(q.text.length >= 10, `Q${q.id} 题目过短`);
    q.options.forEach((opt) => {
      assert.ok(opt.text.length >= 5, `Q${q.id} 选项 ${opt.label} 文案过短`);
    });
  });
});

// 汇总
console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log(`  通过: ${pass}  |  失败: ${fail}`);
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

process.exit(fail > 0 ? 1 : 0);
