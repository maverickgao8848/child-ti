/**
 * KidTI 24 道童年情境选择题数据
 * 每维度 6 题：D1(NRG) 能量源 / D2(RUL) 规则观 / D3(PRE) 存在感 / D4(EMO) 情绪天气
 *
 * 计分规则：
 * - D1(NRG): 高分 → BATTERY(充电型), 低分 → REACTOR(放电型)
 * - D2(RUL): 高分 → SHEEP(顺毛型),   低分 → WOLF(反骨型)
 * - D3(PRE): 高分 → BLACKHOLE(黑洞型), 低分 → SPOTLIGHT(聚光型)
 * - D4(EMO): 方差大 → FOG(迷雾型), 均值偏高 → STORM(暴雨型), 均值偏低 → LAKE(静海型)
 */

const QUESTIONS = [
  // ==================== D1 能量源 NRG（6题）====================
  {
    id: 1,
    dimension: "NRG",
    text: "周末下午，爸妈出门了你一个人在家，你会？",
    options: [
      { label: "A", text: "终于清净了，把门反锁开始看漫画", scores: { NRG: 2 } },
      { label: "B", text: "先给好朋友打电话问要不要过来玩", scores: { NRG: -1, PRE: -1 } },
      { label: "C", text: "打开电脑同时开五个聊天窗口", scores: { NRG: -2 } },
      { label: "D", text: "坐在沙发上发呆，享受这片刻", scores: { NRG: 1, PRE: 1 } },
    ],
  },
  {
    id: 2,
    dimension: "NRG",
    text: "学校组织春游，大巴车上你通常会？",
    options: [
      { label: "A", text: "默默戴耳机看窗外，谁也别跟我说话", scores: { NRG: 2, PRE: 1 } },
      { label: "B", text: "从前排串到后排，跟每个人聊天", scores: { NRG: -2, PRE: -1 } },
      { label: "C", text: "跟旁边同学聊几句，然后各自安静", scores: { NRG: 1 } },
      { label: "D", text: "组织大家一起唱歌玩游戏", scores: { NRG: -2, PRE: -1 } },
    ],
  },
  {
    id: 3,
    dimension: "NRG",
    text: "期末考试结束，放学后你第一件事是？",
    options: [
      { label: "A", text: "直接回家，手机静音，谁都找不到", scores: { NRG: 2 } },
      { label: "B", text: "约同学去网吧/商场玩到半夜", scores: { NRG: -2 } },
      { label: "C", text: "先回家睡一觉，晚上再回消息", scores: { NRG: 1 } },
      { label: "D", text: "班群里疯狂刷屏对答案", scores: { NRG: -2, PRE: -1 } },
    ],
  },
  {
    id: 4,
    dimension: "NRG",
    text: "课间十分钟，你通常怎么过？",
    options: [
      { label: "A", text: "趴在桌上补觉或发呆", scores: { NRG: 2, PRE: 1 } },
      { label: "B", text: "冲出教室在走廊上打闹", scores: { NRG: -2 } },
      { label: "C", text: "去隔壁班找人聊天", scores: { NRG: -1 } },
      { label: "D", text: "在座位上看课外书", scores: { NRG: 1, RUL: 1 } },
    ],
  },
  {
    id: 5,
    dimension: "NRG",
    text: "亲戚来家里吃饭，饭桌上你被cue到，你会？",
    options: [
      { label: "A", text: "快速吃完躲进房间", scores: { NRG: 2, PRE: 1 } },
      { label: "B", text: "表演刚学的才艺给大家看", scores: { NRG: -2, PRE: -1 } },
      { label: "C", text: "被问成绩时敷衍几句", scores: { NRG: 1 } },
      { label: "D", text: "主动给大家倒饮料、调节气氛", scores: { NRG: -1, PRE: -1 } },
    ],
  },
  {
    id: 6,
    dimension: "NRG",
    text: "暑假第一天，你的计划是？",
    options: [
      { label: "A", text: "不出门，把攒了一学期的剧看完", scores: { NRG: 2, PRE: 1 } },
      { label: "B", text: "列一张每天约不同朋友的表", scores: { NRG: -2, PRE: -1 } },
      { label: "C", text: "报三个夏令营一个都不落", scores: { NRG: -2 } },
      { label: "D", text: "偶尔出门，大部分时间宅着", scores: { NRG: 1 } },
    ],
  },

  // ==================== D2 规则观 RUL（6题）====================
  {
    id: 7,
    dimension: "RUL",
    text: "老师布置的作业明显过量，今晚根本写不完，你会？",
    options: [
      { label: "A", text: "熬夜也要全部写完，不写睡不着", scores: { RUL: 2, NRG: 1 } },
      { label: "B", text: "写一半，剩下的抄同桌的", scores: { RUL: -1 } },
      { label: "C", text: "直接不写，反正法不责众", scores: { RUL: -2 } },
      { label: "D", text: "挑重点写，剩下的糊弄过去", scores: { RUL: -1, NRG: 1 } },
    ],
  },
  {
    id: 8,
    dimension: "RUL",
    text: "考试时发现隔壁同学在作弊，你会？",
    options: [
      { label: "A", text: "假装没看见，低头写自己的", scores: { RUL: 1, PRE: 1 } },
      { label: "B", text: "举手报告老师", scores: { RUL: 2, PRE: -1 } },
      { label: "C", text: "考完后跟关系好的吐槽", scores: { RUL: -1, NRG: -1 } },
      { label: "D", text: "趁老师不注意也偷看一眼", scores: { RUL: -2, PRE: -1 } },
    ],
  },
  {
    id: 9,
    dimension: "RUL",
    text: "班长在自习课记名字，你刚好在讲话，你会？",
    options: [
      { label: "A", text: "立刻闭嘴，之后找班长求情别记", scores: { RUL: 2, PRE: 1 } },
      { label: "B", text: "继续讲，反正记了就记了", scores: { RUL: -2 } },
      { label: "C", text: "等班长走过来再停", scores: { RUL: -1 } },
      { label: "D", text: "反将一军：\"你凭什么只记我不记他\"", scores: { RUL: -2, PRE: -1 } },
    ],
  },
  {
    id: 10,
    dimension: "RUL",
    text: "学校要求统一穿校服，你的态度是？",
    options: [
      { label: "A", text: "每天都穿，甚至周末也穿", scores: { RUL: 2, PRE: 1 } },
      { label: "B", text: "在校服里面穿自己的T恤，拉链拉开", scores: { RUL: -1 } },
      { label: "C", text: "偷偷改短校裤裤脚", scores: { RUL: -2 } },
      { label: "D", text: "穿校服但配一双限量球鞋", scores: { RUL: -1, PRE: -1 } },
    ],
  },
  {
    id: 11,
    dimension: "RUL",
    text: "爸妈说\"隔壁小明考了第一\"，你的第一反应是？",
    options: [
      { label: "A", text: "默默发誓下次超过他", scores: { RUL: 2, NRG: 1 } },
      { label: "B", text: "心想\"小明关我屁事\"", scores: { RUL: -2, NRG: 1 } },
      { label: "C", text: "说\"那让小明当你儿子啊\"", scores: { RUL: -2, PRE: -1 } },
      { label: "D", text: "表面附和，背后觉得小明很惨", scores: { RUL: 1, NRG: 1 } },
    ],
  },
  {
    id: 12,
    dimension: "RUL",
    text: "班上选班干部，老师直接内定了名单，你会？",
    options: [
      { label: "A", text: "接受结果，服从安排", scores: { RUL: 2, PRE: 1 } },
      { label: "B", text: "私下跟同学抱怨", scores: { RUL: -1, NRG: -1 } },
      { label: "C", text: "当堂举手问\"为什么不投票\"", scores: { RUL: -2, PRE: -1 } },
      { label: "D", text: "拉拢同学准备下次选举", scores: { RUL: -2, NRG: -1 } },
    ],
  },

  // ==================== D3 存在感 PRE（6题）====================
  {
    id: 13,
    dimension: "PRE",
    text: "文艺汇演，班主任突然让你上台表演，你会？",
    options: [
      { label: "A", text: "疯狂摆手说\"我不行我不行\"", scores: { PRE: 2, NRG: 1 } },
      { label: "B", text: "表面推脱，心里暗爽", scores: { PRE: -1, NRG: -1 } },
      { label: "C", text: "一口答应，连夜准备节目", scores: { PRE: -2, NRG: -1 } },
      { label: "D", text: "推荐其他同学，自己躲幕后", scores: { PRE: 2, RUL: 1 } },
    ],
  },
  {
    id: 14,
    dimension: "PRE",
    text: "小组讨论时，你通常扮演什么角色？",
    options: [
      { label: "A", text: "基本不说话，最后附和大家", scores: { PRE: 2, NRG: 1 } },
      { label: "B", text: "主导讨论，分配任务", scores: { PRE: -2, RUL: 1 } },
      { label: "C", text: "偶尔插一句，说完又沉默", scores: { PRE: 1, NRG: 1 } },
      { label: "D", text: "提出反对意见，引发辩论", scores: { PRE: -2, RUL: -1 } },
    ],
  },
  {
    id: 15,
    dimension: "PRE",
    text: "课堂上老师提问，你刚好知道答案，你会？",
    options: [
      { label: "A", text: "把头埋低，默念\"别叫我别叫我\"", scores: { PRE: 2, NRG: 1 } },
      { label: "B", text: "手举得比谁都高", scores: { PRE: -2, NRG: -1 } },
      { label: "C", text: "老师点到才站起来回答", scores: { PRE: 1 } },
      { label: "D", text: "故意不举手，但小声嘟囔答案", scores: { PRE: -1, RUL: -1 } },
    ],
  },
  {
    id: 16,
    dimension: "PRE",
    text: "班级合影，你会 instinctively 站在？",
    options: [
      { label: "A", text: "最边上，最好能被前面的人挡住", scores: { PRE: 2, NRG: 1 } },
      { label: "B", text: "正中间C位", scores: { PRE: -2, NRG: -1 } },
      { label: "C", text: "第二排中间偏左，不显眼", scores: { PRE: 1 } },
      { label: "D", text: "第一排蹲下，比个夸张的手势", scores: { PRE: -2, RUL: -1 } },
    ],
  },
  {
    id: 17,
    dimension: "PRE",
    text: "朋友圈（或当年的QQ空间）发了照片，半天没人点赞，你会？",
    options: [
      { label: "A", text: "秒删，假装没发过", scores: { PRE: 2, EMO: 1 } },
      { label: "B", text: "无所谓，反正给自己看的", scores: { PRE: 1, NRG: 1 } },
      { label: "C", text: "私聊几个朋友\"去看看我新发的那条\"", scores: { PRE: -2, NRG: -1 } },
      { label: "D", text: "再发一条\"看来大家都很忙\"", scores: { PRE: -2, EMO: 1 } },
    ],
  },
  {
    id: 18,
    dimension: "PRE",
    text: "班级元旦晚会，你会怎么参与？",
    options: [
      { label: "A", text: "坐在角落吃东西，希望晚会快点结束", scores: { PRE: 2, NRG: 1 } },
      { label: "B", text: "报名当主持人", scores: { PRE: -2, NRG: -1 } },
      { label: "C", text: "参与一个集体节目，不突出", scores: { PRE: 1, RUL: 1 } },
      { label: "D", text: "串场讲段子，全场焦点", scores: { PRE: -2, RUL: -1 } },
    ],
  },

  // ==================== D4 情绪天气 EMO（6题）====================
  {
    id: 19,
    dimension: "EMO",
    text: "被爸妈当众骂了一顿，你的即时反应是？",
    options: [
      { label: "A", text: "当场大哭，所有人都能看见", scores: { EMO: 2, PRE: -1 } },
      { label: "B", text: "面无表情，晚上躲在被子里哭", scores: { EMO: -2, NRG: 1 } },
      { label: "C", text: "笑着跟邻居阿姨说\"我妈又生气了\"", scores: { EMO: -2, PRE: -1 } },
      { label: "D", text: "眼泪在眼眶里打转但硬憋回去", scores: { EMO: 1, PRE: 1 } },
    ],
  },
  {
    id: 20,
    dimension: "EMO",
    text: "最好的朋友突然不理你了，你会？",
    options: [
      { label: "A", text: "当场拉着他质问，声音大到全班听见", scores: { EMO: 2, PRE: -1 } },
      { label: "B", text: "写小纸条问他\"为什么\"", scores: { EMO: 1 } },
      { label: "C", text: "假装不在意，回家在被子里想了一晚上", scores: { EMO: -2, NRG: 1 } },
      { label: "D", text: "冷静分析是不是自己哪里得罪他了", scores: { EMO: -2, NRG: 1 } },
    ],
  },
  {
    id: 21,
    dimension: "EMO",
    text: "考试考砸了，回到家你？",
    options: [
      { label: "A", text: "一进门就趴桌上嚎啕大哭", scores: { EMO: 2 } },
      { label: "B", text: "默默把卷子藏进抽屉最深处", scores: { EMO: -2, PRE: 1 } },
      { label: "C", text: "主动给爸妈看，但内心毫无波澜", scores: { EMO: -2, RUL: 1 } },
      { label: "D", text: "愤怒地把卷子撕碎", scores: { EMO: 2, RUL: -1 } },
    ],
  },
  {
    id: 22,
    dimension: "EMO",
    text: "被同学起了难听的外号当众嘲笑，你？",
    options: [
      { label: "A", text: "当场跟他打起来", scores: { EMO: 2, RUL: -1 } },
      { label: "B", text: "笑着自嘲\"对啊我就是\"", scores: { EMO: -2, PRE: -1 } },
      { label: "C", text: "回家告诉爸妈，边哭边说", scores: { EMO: 2, RUL: 1 } },
      { label: "D", text: "面无表情走开，但记仇三年", scores: { EMO: -2, RUL: -2 } },
    ],
  },
  {
    id: 23,
    dimension: "EMO",
    text: "运动会你跑了最后一名，全班都在看，你？",
    options: [
      { label: "A", text: "冲过终点线后蹲在地上哭", scores: { EMO: 2 } },
      { label: "B", text: "笑着做鬼脸说\"我故意的\"", scores: { EMO: -2, PRE: -1 } },
      { label: "C", text: "低头快速走回座位，三天不想说话", scores: { EMO: -2, PRE: 1 } },
      { label: "D", text: "气得把号码布扯了扔掉", scores: { EMO: 2, RUL: -2 } },
    ],
  },
  {
    id: 24,
    dimension: "EMO",
    text: "生日那天爸妈完全忘了，你？",
    options: [
      { label: "A", text: "晚上主动提醒，边说边哭", scores: { EMO: 2, RUL: 1 } },
      { label: "B", text: "什么也不说，但心里记一辈子", scores: { EMO: -2, PRE: 1 } },
      { label: "C", text: "自己给自己买块小蛋糕吃", scores: { EMO: -2, NRG: 1 } },
      { label: "D", text: "大发雷霆把房门反锁", scores: { EMO: 2, RUL: -2 } },
    ],
  },
];

// 兼容 CommonJS / ES Module / 浏览器全局
if (typeof module !== "undefined" && module.exports) {
  module.exports = { QUESTIONS };
}
