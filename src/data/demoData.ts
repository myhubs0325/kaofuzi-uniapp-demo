import { reactive } from "vue";

export const demoData = reactive({
  student: {
    name: "张小雨",
    grade: "小学三年级",
    className: "三年级 1 班",
    province: "江苏省",
    city: "南京市",
    district: "鼓楼区",
    schoolName: "南京市鼓楼实验小学"
  },
  guardian: {
    name: "张女士",
    relation: "妈妈",
    phone: "138****0628",
    accountId: "KFZ20260713",
    registeredAt: "2026-07-10"
  },
  teacher: {
    name: "王老师",
    assessmentName: "第五单元测评",
    wrongQuestionCount: 2,
    syncedAt: "今天 16:20"
  },
  task: {
    title: "三位数连续退位减法",
    durationMinutes: 8,
    questionCount: 5,
    weakPointCount: 2,
    mistakeReason: "十位借位后忘记减 1"
  },
  progress: {
    weeks: 4,
    closedKnowledgePoints: 2,
    previousAccuracy: 50,
    currentAccuracy: 83,
    headline: "张小雨最近不是偶尔做对，是开始稳定会做了",
    summary:
      "最明显的是连续退位减法。以前一到借位就容易乱，现在做完同类确认题后，已经能按顺序把每一位改对。",
    teacherJudgement: "连续退位减法已基本掌握",
    before: {
      title: "借位以后容易乱",
      detail: "以前做 10 道同类题，大约只能做对 5 道，最常错在“借过以后十位没有先减 1”。"
    },
    after: {
      title: "会按步骤慢慢做",
      detail: "现在做 10 道同类题，大约能做对 8 道，说明关键步骤已经能自己做出来。"
    },
    growthItems: [
      {
        status: "good",
        label: "已经补会",
        title: "三位数连续退位减法",
        summary: "做题时能先借位，再把上一位改小，不再总是卡在十位。"
      },
      {
        status: "good",
        label: "保持稳定",
        title: "两位数乘一位数",
        summary: "这周没有再出现“进位漏加”的老错误，说明不是碰巧做对。"
      },
      {
        status: "focus",
        label: "继续盯住",
        title: "应用题读题",
        summary: "现在主要不是不会算，而是有时看漏“用了多少、还剩多少、一共多少”这些关系。"
      }
    ],
    focus: {
      title: "应用题读题",
      summary: "家里只要提醒先把题意看完整、把数量关系说出来，正确率还有继续往上走的空间。"
    },
    familyTips: [
      "先问孩子：这题是在问用了多少、还剩多少，还是一共多少。",
      "做减法时提醒一句：不够减就先借 1，借过以后上一位要先变小。",
      "算完别急着交，再看一眼每一位有没有改过、有没有漏一步。"
    ],
    teacherNote: "王老师说：小雨借位步骤已经更稳定，下周会继续观察应用题读题。"
  }
});

export const schoolRegions: Record<string, Record<string, string[]>> = {
  江苏省: {
    南京市: ["鼓楼区", "玄武区", "建邺区"],
    苏州市: ["姑苏区", "吴中区", "相城区"]
  },
  浙江省: {
    杭州市: ["西湖区", "上城区", "拱墅区"],
    宁波市: ["海曙区", "鄞州区", "江北区"]
  },
  安徽省: {
    合肥市: ["蜀山区", "庐阳区", "包河区"],
    芜湖市: ["镜湖区", "鸠江区", "弋江区"]
  }
};

export type DemoChild = {
  id: string;
  student: typeof demoData.student;
  task: typeof demoData.task;
  progress: typeof demoData.progress;
  teacher: typeof demoData.teacher;
};

export const demoChildren: DemoChild[] = [
  {
    id: "child-xiaoyu",
    student: { ...demoData.student },
    task: { ...demoData.task },
    progress: { ...demoData.progress },
    teacher: { ...demoData.teacher }
  },
  {
    id: "child-xiaocheng",
    student: {
      name: "\u5f20\u5c0f\u6668",
      grade: "\u5c0f\u5b66\u4e94\u5e74\u7ea7",
      className: "\u4e94\u5e74\u7ea7 2 \u73ed",
      province: "江苏省",
      city: "南京市",
      district: "玄武区",
      schoolName: "南京市玄武外国语学校"
    },
    task: {
      ...demoData.task,
      title: "\u5206\u6570\u52a0\u51cf\u6df7\u5408\u8ba1\u7b97",
      durationMinutes: 12,
      questionCount: 6,
      weakPointCount: 3
    },
    progress: {
      ...demoData.progress,
      previousAccuracy: 61,
      currentAccuracy: 68,
      closedKnowledgePoints: 1,
      headline: "\u5f20\u5c0f\u6668\u6b63\u5728\u8865\u9f50\u5206\u6570\u8ba1\u7b97\u7684\u57fa\u7840\u6b65\u9aa4",
      summary: "\u6700\u8fd1\u7684\u4e3b\u8981\u95ee\u9898\u662f\u901a\u5206\u548c\u8fd0\u7b97\u987a\u5e8f\uff0c\u5efa\u8bae\u5148\u5b8c\u6210\u6bcf\u5929 12 \u5206\u949f\u7684\u9488\u5bf9\u7ec3\u4e60"
    },
    teacher: {
      ...demoData.teacher,
      name: "\u674e\u8001\u5e08",
      wrongQuestionCount: 7,
      syncedAt: "\u4eca\u5929 15:40"
    }
  }
];

export const switchDemoChild = (childId: string) => {
  const child = demoChildren.find((item) => item.id === childId);
  if (!child) return false;
  demoData.student = { ...child.student };
  demoData.task = { ...child.task };
  demoData.progress = { ...child.progress };
  demoData.teacher = { ...child.teacher };
  return true;
};

export const afterClassReviewExam = {
  studentName: "张小雨",
  title: "课后复习小测",
  subject: "数学",
  topic: "三位数连续退位减法",
  meta: "课堂复习 · 提交后统一分析",
  rule: "答题过程中不提示对错，像小测一样先完整做完。",
  totalMinutes: 8,
  questions: [
    {
      id: 1,
      type: "课堂例题回顾",
      prompt: "502 - 178 = ?",
      hint: "独立完成，不看提示",
      options: ["324", "334", "314"],
      correctAnswer: "324",
      studentAnswer: "324",
      knowledgePoint: "退位后上一位要先减 1"
    },
    {
      id: 2,
      type: "课堂变式题",
      prompt: "600 - 247 = ?",
      hint: "注意 0 连续借位时每一位都要更新",
      options: ["353", "453", "343"],
      correctAnswer: "353",
      studentAnswer: "353",
      knowledgePoint: "连续退位中的 0 借位"
    },
    {
      id: 3,
      type: "复习后确认",
      prompt: "703 - 468 = ?",
      hint: "从个位开始，借位后再继续算",
      options: ["235", "245", "325"],
      correctAnswer: "235",
      studentAnswer: "245",
      knowledgePoint: "连续退位中的 0 借位"
    },
    {
      id: 4,
      type: "课堂迁移题",
      prompt: "704 - 286 = ?",
      hint: "遇到十位是 0 时，要继续向百位借",
      options: ["418", "428", "518"],
      correctAnswer: "418",
      studentAnswer: "428",
      knowledgePoint: "借位链条要逐位更新"
    },
    {
      id: 5,
      type: "应用题计算",
      prompt: "图书角有 603 本书，借走 287 本，还剩多少本？",
      hint: "先列式，再按竖式计算",
      options: ["316 本", "326 本", "416 本"],
      correctAnswer: "316 本",
      studentAnswer: "316 本",
      knowledgePoint: "把题意转成减法算式"
    }
  ],
  weakPoints: [
    {
      title: "连续退位中的 0 借位",
      level: "重点讲",
      evidence: "第 3、4 题出错，说明遇到中间位是 0 时，更新顺序还不稳。",
      parentText: "不是孩子完全不会减法，而是连续借位时容易漏掉某一位的变化。"
    },
    {
      title: "借位链条要逐位更新",
      level: "继续练",
      evidence: "能做对普通退位题，但题目一变复杂就容易跳步。",
      parentText: "后面要盯住“借一次，改一次”，不要只看最后答案。"
    }
  ],
  knowledgeExplain: {
    title: "连续退位减法：遇到 0 也能借位",
    summary: "这次不讲某一道题，而是把张小雨卡住的知识点单独讲清楚。",
    coreRule: "哪一位不够减，就向前一位借 1；被借的那一位要先少 1。如果前一位是 0，要继续向更前一位借。",
    steps: [
      "先从个位看够不够减，不够就向十位借。",
      "如果十位是 0，十位不能直接借，就继续向百位借。",
      "百位借出 1 后，十位先变成 10，再借 1 给个位，所以十位最后还剩 9。",
      "每发生一次借位，都要把被借的那一位先改小，再继续往后算。"
    ],
    commonMistakes: [
      "只记得个位借到了 10，忘了十位已经被借走 1。",
      "遇到中间是 0 时，直接把 0 当成 10 用，没有向前继续借。",
      "算完没有回头检查每一位是否已经更新。"
    ],
    familyGuide: "家长在旁边不用直接讲答案，只提醒孩子说出：我从哪一位借了 1？被借的那一位现在变成多少？",
    nextAction: "讲完后建议再做 2 道同类题，确认这个知识点是真的懂了。"
  }
} as const;

type PhotoCheckSummary = {
  recognizedCount: number;
  focusCount: number;
  correctCount: number;
};

type PhotoCheckQuestionBase = {
  id: number;
  expression: string;
  studentAnswer: string;
  correctAnswer: string;
  statusLabel: string;
  note: string;
};

type CorrectPhotoCheckQuestion = PhotoCheckQuestionBase & {
  status: "correct";
};

type WrongPhotoCheckQuestion = PhotoCheckQuestionBase & {
  status: "wrong";
  analysisTitle: string;
  diagnosis: string;
  steps: string[];
  takeaway: string;
  knowledgePoint: string;
};

export type PhotoCheckQuestion = CorrectPhotoCheckQuestion | WrongPhotoCheckQuestion;

export const photoCheckData = {
  summary: {
    recognizedCount: 3,
    focusCount: 1,
    correctCount: 2
  } satisfies PhotoCheckSummary,
  questions: [
    {
      id: 1,
      expression: "286 + 147 = ?",
      studentAnswer: "433",
      correctAnswer: "433",
      status: "correct",
      statusLabel: "正确",
      note: "进位步骤正确，结果无误。"
    },
    {
      id: 2,
      expression: "502 - 178 = ?",
      studentAnswer: "334",
      correctAnswer: "324",
      status: "wrong",
      statusLabel: "需讲解",
      note: "个位借走 1 后，十位没有从 0 更新成 9。",
      analysisTitle: "第 2 题错在借位后的十位",
      diagnosis: "孩子在个位向十位借 1 之后，继续把十位当成 0 来减，所以多算了 10。",
      steps: [
        "先算个位：2 不够减 8，要向十位借 1，变成 12 - 8 = 4。",
        "十位被借走后，原来的 0 要变成 9，再算 9 - 7 = 2。",
        "百位 5 借给十位后变成 4，最后算 4 - 1 = 3，所以结果是 324。"
      ],
      takeaway: "连续退位减法要先改被借走的那一位，再继续往后算。",
      knowledgePoint: "三位数连续退位减法"
    },
    {
      id: 3,
      expression: "603 - 287 = ?",
      studentAnswer: "316",
      correctAnswer: "316",
      status: "correct",
      statusLabel: "正确",
      note: "连续借位处理到位，答案正确。"
    }
  ] satisfies PhotoCheckQuestion[]
} as const;

export type WrongBookTopicKey =
  | "borrowSubtraction"
  | "wordProblemReading"
  | "multiplicationVertical";

export type WrongBookQuestionDetail = {
  id: number;
  source: string;
  prompt: string;
  studentAnswer: string;
  correctAnswer: string;
  reason: string;
};

export type WrongBookTopic = {
  key: WrongBookTopicKey;
  title: string;
  meta: string;
  count: number;
  summary: string;
  commonMistake: string;
  practiceGoal: string;
  questions: WrongBookQuestionDetail[];
};

export const wrongBookTopics = [
  {
    key: "borrowSubtraction",
    title: "连续退位减法",
    meta: "第五单元测评",
    count: 4,
    summary: "这一类最容易在借位以后漏减 1，属于重复失分最多的题型。",
    commonMistake: "借位后忘记把上一位先减 1。",
    practiceGoal: "先把借位后的十位更新练熟，再做同类确认题。",
    questions: [
      {
        id: 1,
        source: "第五单元测评",
        prompt: "502 - 178 = ?",
        studentAnswer: "334",
        correctAnswer: "324",
        reason: "个位借 1 后，十位没有先减 1。"
      },
      {
        id: 2,
        source: "课堂练习",
        prompt: "704 - 286 = ?",
        studentAnswer: "528",
        correctAnswer: "418",
        reason: "百位借给十位后，中间十位变化没有更新。"
      },
      {
        id: 3,
        source: "家庭作业",
        prompt: "600 - 247 = ?",
        studentAnswer: "453",
        correctAnswer: "353",
        reason: "连续借位时把十位当成原来的 10 来减，少减了 1。"
      },
      {
        id: 4,
        source: "单元练习",
        prompt: "803 - 467 = ?",
        studentAnswer: "446",
        correctAnswer: "336",
        reason: "借位顺序混乱，百位和十位都没有更新到正确数值。"
      }
    ]
  },
  {
    key: "wordProblemReading",
    title: "应用题读题",
    meta: "周末作业",
    count: 3,
    summary: "主要问题不是不会算，而是读题时漏掉了关键信息或没有分清数量关系。",
    commonMistake: "没有先分清“用了多少”“还剩多少”“一共多少”。",
    practiceGoal: "先圈出已知量和问题，再决定是加、减、乘还是除。",
    questions: [
      {
        id: 1,
        source: "周末作业",
        prompt: "图书角原来有 48 本书，借走 19 本，又还回 6 本，现在有多少本？",
        studentAnswer: "29",
        correctAnswer: "35",
        reason: "漏看“又还回 6 本”，少算了一步。"
      },
      {
        id: 2,
        source: "课堂练习",
        prompt: "一盒有 24 支彩笔，买了 3 盒，一共多少支？",
        studentAnswer: "27",
        correctAnswer: "72",
        reason: "没有看清“3 盒”，把乘法题当成加法题。"
      },
      {
        id: 3,
        source: "单元作业",
        prompt: "操场上有 36 个同学，平均分成 4 组，每组多少人？",
        studentAnswer: "40",
        correctAnswer: "9",
        reason: "没有分清“平均分成”，列式方向错了。"
      }
    ]
  },
  {
    key: "multiplicationVertical",
    title: "乘法竖式",
    meta: "课堂练习",
    count: 2,
    summary: "这一类题主要错在进位处理，尤其是第二步容易漏加。",
    commonMistake: "个位乘完进位后，十位漏加进位数。",
    practiceGoal: "竖式先算个位，再把进位写清楚后继续算十位。",
    questions: [
      {
        id: 1,
        source: "课堂练习",
        prompt: "36 × 4 = ?",
        studentAnswer: "124",
        correctAnswer: "144",
        reason: "6×4=24 进 2 后，3×4 只算成 12，漏加进位 2。"
      },
      {
        id: 2,
        source: "课后作业",
        prompt: "27 × 3 = ?",
        studentAnswer: "61",
        correctAnswer: "81",
        reason: "个位进位后，十位漏加 2。"
      }
    ]
  }
] as const satisfies WrongBookTopic[];

export type PracticeEntryKey =
  | "dailyBoost"
  | "wrongBookBundle"
  | "wrongBorrowSubtraction"
  | "wrongWordProblemReading"
  | "wrongMultiplicationVertical"
  | "examPrepFocus"
  | "tutorPreview"
  | "tutorReview"
  | "tutorTargeted";

export type PracticeEntryScenario = {
  title: string;
  meta: string;
  headline: string;
  summary: string;
  totalQuestionCount: number;
  estimatedMinutes: number;
  focus: string;
  actionLabel: string;
  questionGroups: Array<{
    label: string;
    count: number;
    tone: "new" | "review" | "wrong" | "solid";
  }>;
  previewQuestions: Array<{
    type: string;
    prompt: string;
    meta: string;
  }>;
};

export const practiceEntryScenarios: Record<PracticeEntryKey, PracticeEntryScenario> = {
  dailyBoost: {
    title: "开始巩固",
    meta: "今日提分",
    headline: "先练今天最容易提分的 3 道题",
    summary: "系统会先出 1 道错题，再安排关键一步和确认题，帮助孩子把失分点练稳。",
    totalQuestionCount: 5,
    estimatedMinutes: 8,
    focus: "先把借位后的十位更新练稳，再做同类确认题。",
    actionLabel: "开始今日提分",
    questionGroups: [
      { label: "错题", count: 1, tone: "wrong" },
      { label: "知识巩固题", count: 2, tone: "solid" },
      { label: "复习题", count: 2, tone: "review" }
    ],
    previewQuestions: [
      { type: "错题", prompt: "502 - 178 = ?", meta: "先找失分原因" },
      { type: "知识巩固题", prompt: "42 - 18 = ?", meta: "先练关键一步" },
      { type: "复习题", prompt: "603 - 287 = ?", meta: "再做一道确认" }
    ]
  },
  wrongBookBundle: {
    title: "开始巩固",
    meta: "错题本 · 先练这 3 类",
    headline: "先把最容易重复失分的 3 类错题练熟",
    summary: "系统已经按错题本里的重复次数和考试影响整理好了本次题目。",
    totalQuestionCount: 9,
    estimatedMinutes: 8,
    focus: "先把借位、读题和乘法进位这三类常见失分点练稳。",
    actionLabel: "开始巩固 3 类错题",
    questionGroups: [
      { label: "错题", count: 5, tone: "wrong" },
      { label: "复习题", count: 2, tone: "review" },
      { label: "知识巩固题", count: 2, tone: "solid" }
    ],
    previewQuestions: [
      { type: "错题", prompt: "502 - 178 = ?", meta: "连续退位减法" },
      { type: "复习题", prompt: "图书角原来有 48 本书，借走 19 本，又还回 6 本，现在有多少本？", meta: "应用题读题" },
      { type: "知识巩固题", prompt: "36 × 4 = ?", meta: "乘法竖式" }
    ]
  },
  wrongBorrowSubtraction: {
    title: "开始巩固",
    meta: "连续退位减法",
    headline: "先把连续退位减法这 4 道错题练熟",
    summary: "本次会先练孩子最容易出错的借位更新步骤，再安排同类确认题。",
    totalQuestionCount: 4,
    estimatedMinutes: 6,
    focus: "重点盯住借位以后，上一位要先减 1。",
    actionLabel: "开始巩固这 4 道题",
    questionGroups: [
      { label: "错题", count: 2, tone: "wrong" },
      { label: "复习题", count: 1, tone: "review" },
      { label: "知识巩固题", count: 1, tone: "solid" }
    ],
    previewQuestions: [
      { type: "错题", prompt: "502 - 178 = ?", meta: "第五单元测评" },
      { type: "错题", prompt: "704 - 286 = ?", meta: "课堂练习" },
      { type: "知识巩固题", prompt: "42 - 18 = ?", meta: "先练关键一步" }
    ]
  },
  wrongWordProblemReading: {
    title: "开始巩固",
    meta: "应用题读题",
    headline: "先把应用题读题这 3 道错题练熟",
    summary: "本次会先帮助孩子圈出关键数量关系，再安排同类应用题确认。",
    totalQuestionCount: 3,
    estimatedMinutes: 6,
    focus: "先分清一共、用了、还剩，再决定列式。",
    actionLabel: "开始巩固这 3 道题",
    questionGroups: [
      { label: "错题", count: 2, tone: "wrong" },
      { label: "复习题", count: 1, tone: "review" }
    ],
    previewQuestions: [
      { type: "错题", prompt: "48 本书借走 19 本，又还回 6 本，现在有多少本？", meta: "周末作业" },
      { type: "错题", prompt: "36 个同学平均分成 4 组，每组多少人？", meta: "单元作业" },
      { type: "复习题", prompt: "一盒 24 支彩笔，3 盒一共多少支？", meta: "课堂练习" }
    ]
  },
  wrongMultiplicationVertical: {
    title: "开始巩固",
    meta: "乘法竖式",
    headline: "先把乘法竖式这 2 道错题练熟",
    summary: "本次会先练进位不漏加，再用同类题确认竖式步骤。",
    totalQuestionCount: 2,
    estimatedMinutes: 5,
    focus: "个位乘完后的进位，要带到十位里一起算。",
    actionLabel: "开始巩固这 2 道题",
    questionGroups: [
      { label: "错题", count: 1, tone: "wrong" },
      { label: "知识巩固题", count: 1, tone: "solid" }
    ],
    previewQuestions: [
      { type: "错题", prompt: "36 × 4 = ?", meta: "课堂练习" },
      { type: "知识巩固题", prompt: "27 × 3 = ?", meta: "课后作业" }
    ]
  },
  examPrepFocus: {
    title: "开始巩固",
    meta: "考前冲刺",
    headline: "今天先补最可能重复失分的 3 类题",
    summary: "系统会先按提分优先级出题，再安排一题确认，帮助考前稳定拿分。",
    totalQuestionCount: 6,
    estimatedMinutes: 10,
    focus: "先修正连续退位减法，再复习应用题和竖式进位。",
    actionLabel: "开始今日冲刺",
    questionGroups: [
      { label: "错题", count: 2, tone: "wrong" },
      { label: "复习题", count: 2, tone: "review" },
      { label: "知识巩固题", count: 2, tone: "solid" }
    ],
    previewQuestions: [
      { type: "错题", prompt: "603 - 287 = ?", meta: "连续退位减法" },
      { type: "复习题", prompt: "操场上有 36 个同学，平均分成 4 组，每组多少人？", meta: "应用题数量关系" },
      { type: "知识巩固题", prompt: "27 × 3 = ?", meta: "竖式进位确认" }
    ]
  },
  tutorPreview: {
    title: "开始巩固",
    meta: "课内知识巩固 · 预习讲解",
    headline: "先用新知识题熟悉课堂重点",
    summary: "本次会先讲重点，再用 3 道新知识题帮助孩子提前熟悉课堂内容。",
    totalQuestionCount: 4,
    estimatedMinutes: 8,
    focus: "先认识方法，再做新知识题，不急着追求速度。",
    actionLabel: "开始预习讲解",
    questionGroups: [
      { label: "新知识题目", count: 3, tone: "new" },
      { label: "知识巩固题", count: 1, tone: "solid" }
    ],
    previewQuestions: [
      { type: "新知识题目", prompt: "认识三位数连续退位时，哪一位要先变小？", meta: "方法理解" },
      { type: "新知识题目", prompt: "42 - 18 = ?", meta: "先练关键一步" },
      { type: "知识巩固题", prompt: "52 - 27 = ?", meta: "预习后确认" }
    ]
  },
  tutorReview: {
    title: "开始巩固",
    meta: "课内知识巩固 · 课后复习",
    headline: "先把今天课堂重点再复习一遍",
    summary: "本次会先做课堂复习题，再用 2 道知识巩固题检查孩子是否真正听懂。",
    totalQuestionCount: 5,
    estimatedMinutes: 8,
    focus: "把今天课堂讲过的借位步骤再做一遍，防止回家后又忘。",
    actionLabel: "开始课后复习",
    questionGroups: [
      { label: "复习题", count: 3, tone: "review" },
      { label: "知识巩固题", count: 2, tone: "solid" }
    ],
    previewQuestions: [
      { type: "复习题", prompt: "502 - 178 = ?", meta: "课堂例题回顾" },
      { type: "复习题", prompt: "600 - 247 = ?", meta: "课堂变式题" },
      { type: "知识巩固题", prompt: "703 - 468 = ?", meta: "复习后确认" }
    ]
  },
  tutorTargeted: {
    title: "开始巩固",
    meta: "课内知识巩固 · 针对出题",
    headline: "按知识点继续出题巩固",
    summary: "本次会围绕孩子当前薄弱点出题，先巩固步骤，再做变式题。",
    totalQuestionCount: 5,
    estimatedMinutes: 8,
    focus: "围绕借位更新和进位不漏加这两个点继续练。",
    actionLabel: "开始针对练习",
    questionGroups: [
      { label: "错题", count: 1, tone: "wrong" },
      { label: "知识巩固题", count: 3, tone: "solid" },
      { label: "复习题", count: 1, tone: "review" }
    ],
    previewQuestions: [
      { type: "知识巩固题", prompt: "703 - 468 = ?", meta: "借位更新" },
      { type: "知识巩固题", prompt: "36 × 4 = ?", meta: "乘法进位" },
      { type: "复习题", prompt: "图书角原来有 48 本书，借走 19 本，又还回 6 本，现在有多少本？", meta: "读题确认" }
    ]
  }
} as const;

export type PracticeFlowScreen = {
  title: string;
  progress: string;
  expression: string;
  hint: string;
  answers: Array<{ label: string; correct: boolean }>;
};

export type PracticeFlowFeedback = {
  eyebrow: string;
  title: string;
  summary: string;
  keyline: string;
  buttonLabel: string;
};

export type PracticeFlowRetry = {
  pageTitle: string;
  pageMeta: string;
  cardTitle: string;
  keyline: string;
  explanation: string;
  steps: string[];
};

export type PracticeFlowMastered = {
  eyebrow: string;
  title: string;
  summary: string;
  completedSummary: string;
  diagnosis: string;
  previousAccuracy: number;
  currentAccuracy: number;
  closedKnowledgePoints: number;
  fixedWeakness: string;
  suggestion: string;
};

export type PracticeFlow = {
  taskTitle: string;
  practice: PracticeFlowScreen;
  bridge: PracticeFlowScreen;
  confirm: PracticeFlowScreen;
  wrong: PracticeFlowFeedback;
  bridgeRetry: PracticeFlowRetry;
  confirmRetry: PracticeFlowRetry;
  mastered: PracticeFlowMastered;
};

export const practiceFlows: Record<PracticeEntryKey, PracticeFlow> = {
  dailyBoost: {
    taskTitle: "三位数连续退位减法",
    practice: {
      title: "今日提分",
      progress: "1 / 5",
      expression: "502 - 178 = ?",
      hint: "先算个位，再算十位",
      answers: [
        { label: "324", correct: true },
        { label: "334", correct: false },
        { label: "424", correct: false }
      ]
    },
    bridge: {
      title: "先练关键一步",
      progress: "2 / 5",
      expression: "42 - 18 = ?",
      hint: "个位 2 不够减 8，需要借 1",
      answers: [
        { label: "24", correct: true },
        { label: "34", correct: false },
        { label: "26", correct: false }
      ]
    },
    confirm: {
      title: "再做一道确认",
      progress: "4 / 5",
      expression: "603 - 287 = ?",
      hint: "记得更新借位后的十位",
      answers: [
        { label: "316", correct: true },
        { label: "326", correct: false },
        { label: "416", correct: false }
      ]
    },
    wrong: {
      eyebrow: "不是不会算",
      title: "十位借位后，忘记减 1",
      summary: "个位借走 1 后，十位已经从 0 变成 9，不能继续按原来的 0 计算。下一步先用一道更简单的题，把这个步骤练清楚。",
      keyline: "十位：10 变成 9，再继续减",
      buttonLabel: "先做一道简单的"
    },
    bridgeRetry: {
      pageTitle: "先看关键一步",
      pageMeta: "过渡题",
      cardTitle: "先把这一步看清楚",
      keyline: "个位不够减，要先借 1",
      explanation: "这道题先别急着往下算。先看个位够不够减，不够减就先借 1，再继续算。",
      steps: ["先看个位 2 能不能减 8。", "不能减，就从十位借 1，变成 12 再减。"]
    },
    confirmRetry: {
      pageTitle: "再看关键一步",
      pageMeta: "确认题",
      cardTitle: "先把关键一步看清楚",
      keyline: "借过 1 以后，上一位要先减 1",
      explanation: "这道题主要错在借位以后没有更新上一位。先把上一位减 1，再继续往后算。",
      steps: ["先看哪一位借走了 1。", "把那一位先减 1，再继续往后算。"]
    },
    mastered: {
      eyebrow: "这次真的会了",
      title: "连续退位减法已基本掌握",
      summary: "借位这一步已经做对了。系统会记录这次进步，并同步给王老师。",
      completedSummary: "今天完成 8 分钟针对练习",
      diagnosis: "借位步骤更稳定了",
      previousAccuracy: 50,
      currentAccuracy: 83,
      closedKnowledgePoints: 2,
      fixedWeakness: "十位借位后忘记减 1",
      suggestion: "继续按今天这个节奏练，下一次优先做确认题，把已经修正的步骤再巩固一遍。"
    }
  },
  wrongBookBundle: {
    taskTitle: "错题本综合巩固",
    practice: {
      title: "错题本巩固",
      progress: "1 / 5",
      expression: "502 - 178 = ?",
      hint: "先把最容易重复失分的借位题练熟",
      answers: [
        { label: "324", correct: true },
        { label: "334", correct: false },
        { label: "314", correct: false }
      ]
    },
    bridge: {
      title: "读题再确认",
      progress: "2 / 5",
      expression: "图书角原来有 48 本书，借走 19 本，又还回 6 本，现在有多少本？",
      hint: "先看清“借走”和“还回”这两个动作",
      answers: [
        { label: "35", correct: true },
        { label: "29", correct: false },
        { label: "73", correct: false }
      ]
    },
    confirm: {
      title: "再做一道确认",
      progress: "4 / 5",
      expression: "36 × 4 = ?",
      hint: "个位算完进位后，十位别漏加",
      answers: [
        { label: "144", correct: true },
        { label: "124", correct: false },
        { label: "134", correct: false }
      ]
    },
    wrong: {
      eyebrow: "先抓最容易丢分的题",
      title: "借位更新这一步最容易再错",
      summary: "错题本里这一类出现次数最多，说明孩子已经会列式，但借位后的更新步骤还不够稳定。",
      keyline: "借位以后，上一位要先减 1",
      buttonLabel: "先练这一步"
    },
    bridgeRetry: {
      pageTitle: "再看应用题",
      pageMeta: "复习题",
      cardTitle: "先把题意看清楚",
      keyline: "借走要减，还回要加",
      explanation: "这道应用题主要错在读题不完整。先看清每一步动作，再决定用加法还是减法。",
      steps: ["先圈出“借走 19 本”。", "再圈出“还回 6 本”，最后按顺序列式。"]
    },
    confirmRetry: {
      pageTitle: "再看乘法竖式",
      pageMeta: "确认题",
      cardTitle: "先把进位看清楚",
      keyline: "个位乘完的进位，要带到十位",
      explanation: "这道题主要错在进位没有继续带到十位，所以结果会少一截。",
      steps: ["先算个位 6×4=24，写 4 进 2。", "再算十位 3×4=12，别忘了再加进位 2。"]
    },
    mastered: {
      eyebrow: "这次练得很值",
      title: "错题本里最容易丢分的题，已经稳多了",
      summary: "这次巩固不是只做对了一道题，而是把错题本里最常见的失分步骤一起带起来了。",
      completedSummary: "今天完成 9 道错题本针对练习",
      diagnosis: "借位、读题和进位都更稳定了",
      previousAccuracy: 46,
      currentAccuracy: 81,
      closedKnowledgePoints: 3,
      fixedWeakness: "借位更新、读题漏信息、乘法进位漏加",
      suggestion: "建议明天先复习今天这三类错题，再做 1 道确认题，巩固效果会更稳。"
    }
  },
  wrongBorrowSubtraction: {
    taskTitle: "连续退位减法",
    practice: {
      title: "错题巩固",
      progress: "1 / 4",
      expression: "704 - 286 = ?",
      hint: "借位后，中间十位先减 1",
      answers: [
        { label: "418", correct: true },
        { label: "528", correct: false },
        { label: "428", correct: false }
      ]
    },
    bridge: {
      title: "先练关键一步",
      progress: "2 / 4",
      expression: "52 - 27 = ?",
      hint: "个位 2 不够减 7，要先借 1",
      answers: [
        { label: "25", correct: true },
        { label: "35", correct: false },
        { label: "45", correct: false }
      ]
    },
    confirm: {
      title: "再做一道确认",
      progress: "4 / 4",
      expression: "803 - 467 = ?",
      hint: "百位和十位都要按借位后的数字来算",
      answers: [
        { label: "336", correct: true },
        { label: "446", correct: false },
        { label: "326", correct: false }
      ]
    },
    wrong: {
      eyebrow: "这类题先练熟",
      title: "连续退位时，中间那一位最容易漏减 1",
      summary: "孩子能看懂题，也会列式，主要问题是借位以后还按原来的数继续算。",
      keyline: "借位以后，中间那一位要先减 1",
      buttonLabel: "先练关键一步"
    },
    bridgeRetry: {
      pageTitle: "先看关键一步",
      pageMeta: "过渡题",
      cardTitle: "先把借位顺序看清楚",
      keyline: "个位不够减，先借 1 再算",
      explanation: "这一步只要先把借位顺序做对，后面就不容易再乱。",
      steps: ["先看个位够不够减。", "不够减就借 1，再继续往后算。"]
    },
    confirmRetry: {
      pageTitle: "再看关键一步",
      pageMeta: "确认题",
      cardTitle: "先把更新步骤看清楚",
      keyline: "被借走的那一位，要先变小",
      explanation: "后面这题出错，通常不是不会算，而是借位以后没先更新数字。",
      steps: ["先找哪一位借出了 1。", "那一位先减 1，再继续算。"]
    },
    mastered: {
      eyebrow: "这类题已经会了",
      title: "连续退位减法已基本掌握",
      summary: "这次重点练的就是借位更新。现在这类题已经不容易再在同一个地方丢分。",
      completedSummary: "今天完成 4 道连续退位减法巩固题",
      diagnosis: "借位更新已经从失分点变成稳定步骤",
      previousAccuracy: 42,
      currentAccuracy: 85,
      closedKnowledgePoints: 1,
      fixedWeakness: "借位后忘记把十位先减 1",
      suggestion: "接下来建议隔一天再做 1 道同类确认题，把稳定度再拉高。"
    }
  },
  wrongWordProblemReading: {
    taskTitle: "应用题读题",
    practice: {
      title: "错题巩固",
      progress: "1 / 4",
      expression: "图书角原来有 48 本书，借走 19 本，又还回 6 本，现在有多少本？",
      hint: "先分清“借走”和“还回”",
      answers: [
        { label: "35", correct: true },
        { label: "29", correct: false },
        { label: "73", correct: false }
      ]
    },
    bridge: {
      title: "先练读题",
      progress: "2 / 4",
      expression: "一盒有 24 支彩笔，买了 3 盒，一共多少支？",
      hint: "看清是“3 盒”，不是再加 3",
      answers: [
        { label: "72", correct: true },
        { label: "27", correct: false },
        { label: "21", correct: false }
      ]
    },
    confirm: {
      title: "再做一道确认",
      progress: "4 / 4",
      expression: "操场上有 36 个同学，平均分成 4 组，每组多少人？",
      hint: "“平均分成”通常要想除法",
      answers: [
        { label: "9", correct: true },
        { label: "32", correct: false },
        { label: "40", correct: false }
      ]
    },
    wrong: {
      eyebrow: "这类题先看题意",
      title: "应用题主要错在漏看关键信息",
      summary: "孩子不是不会算，而是没有先分清楚一共、借走、还回这些数量关系。",
      keyline: "先把已知量和问题分清，再决定列式",
      buttonLabel: "先练读题"
    },
    bridgeRetry: {
      pageTitle: "再看题意",
      pageMeta: "过渡题",
      cardTitle: "先把题意看完整",
      keyline: "几盒、平均分成，这些词最关键",
      explanation: "应用题先看清楚关键词，再决定列式，后面就不容易出错。",
      steps: ["先圈出“3 盒”或“平均分成”。", "再决定用乘法还是除法。"]
    },
    confirmRetry: {
      pageTitle: "再看题意",
      pageMeta: "确认题",
      cardTitle: "先把数量关系看清",
      keyline: "一共多少、每组多少，要分清",
      explanation: "这类题的关键不是算得快，而是先分清已知量和要求什么。",
      steps: ["先看题目问的是什么。", "再按题意选加、减、乘、除。"]
    },
    mastered: {
      eyebrow: "题意更看得懂了",
      title: "应用题读题已基本掌握",
      summary: "孩子现在更能先看清题意，再决定列式，应用题不再只凭感觉做。",
      completedSummary: "今天完成 3 道应用题读题巩固",
      diagnosis: "读题顺序和数量关系更稳定了",
      previousAccuracy: 48,
      currentAccuracy: 82,
      closedKnowledgePoints: 1,
      fixedWeakness: "没有先分清“借走、还回、一共、平均分成”",
      suggestion: "后面建议继续保持“先圈关键词，再列式”的习惯。"
    }
  },
  wrongMultiplicationVertical: {
    taskTitle: "乘法竖式",
    practice: {
      title: "错题巩固",
      progress: "1 / 3",
      expression: "36 × 4 = ?",
      hint: "个位进位要带到十位",
      answers: [
        { label: "144", correct: true },
        { label: "124", correct: false },
        { label: "134", correct: false }
      ]
    },
    bridge: {
      title: "先练进位",
      progress: "2 / 3",
      expression: "27 × 3 = ?",
      hint: "先算 7×3，再把进位加到十位",
      answers: [
        { label: "81", correct: true },
        { label: "61", correct: false },
        { label: "71", correct: false }
      ]
    },
    confirm: {
      title: "再做一道确认",
      progress: "3 / 3",
      expression: "48 × 2 = ?",
      hint: "个位进位后，十位别漏加",
      answers: [
        { label: "96", correct: true },
        { label: "86", correct: false },
        { label: "84", correct: false }
      ]
    },
    wrong: {
      eyebrow: "先把进位练稳",
      title: "乘法竖式主要错在进位漏加",
      summary: "个位算完后，进位没有带到十位里，所以最后的结果会偏小。",
      keyline: "个位进位，要带到十位里一起算",
      buttonLabel: "先练进位"
    },
    bridgeRetry: {
      pageTitle: "再看进位",
      pageMeta: "过渡题",
      cardTitle: "先把个位进位看清楚",
      keyline: "先写个位，再记住进位",
      explanation: "个位乘完后把进位记清楚，十位就不会少加。",
      steps: ["先算个位，写下个位数。", "把进位写出来，再去算十位。"]
    },
    confirmRetry: {
      pageTitle: "再看进位",
      pageMeta: "确认题",
      cardTitle: "先把进位带上去",
      keyline: "十位结果 = 原来结果 + 进位",
      explanation: "这道确认题主要看有没有把个位进位继续加到十位里。",
      steps: ["先找个位进位是多少。", "再把它加到十位乘法结果里。"]
    },
    mastered: {
      eyebrow: "进位更稳了",
      title: "乘法竖式已基本掌握",
      summary: "孩子现在更能把进位写清楚再往下算，竖式步骤更完整了。",
      completedSummary: "今天完成 2 道乘法竖式巩固",
      diagnosis: "个位进位已经不容易再漏加",
      previousAccuracy: 54,
      currentAccuracy: 88,
      closedKnowledgePoints: 1,
      fixedWeakness: "个位算完后的进位漏加",
      suggestion: "后面建议继续保留“先写个位，再看进位”的习惯。"
    }
  },
  examPrepFocus: {
    taskTitle: "考前冲刺",
    practice: {
      title: "考前重点提分",
      progress: "1 / 5",
      expression: "603 - 287 = ?",
      hint: "先把连续借位这一步做稳",
      answers: [
        { label: "316", correct: true },
        { label: "326", correct: false },
        { label: "406", correct: false }
      ]
    },
    bridge: {
      title: "再看数量关系",
      progress: "2 / 5",
      expression: "操场上有 36 个同学，平均分成 4 组，每组多少人？",
      hint: "“平均分成”要先想到除法",
      answers: [
        { label: "9", correct: true },
        { label: "8", correct: false },
        { label: "40", correct: false }
      ]
    },
    confirm: {
      title: "最后做一道确认",
      progress: "4 / 5",
      expression: "27 × 3 = ?",
      hint: "进位不要漏加",
      answers: [
        { label: "81", correct: true },
        { label: "61", correct: false },
        { label: "71", correct: false }
      ]
    },
    wrong: {
      eyebrow: "先补最容易丢分的题",
      title: "考前冲刺先抓反复失分点",
      summary: "系统先安排最容易在测评中再丢分的题型，优先把分数拉起来。",
      keyline: "先修正最容易重复失分的步骤",
      buttonLabel: "先补这一类"
    },
    bridgeRetry: {
      pageTitle: "再看数量关系",
      pageMeta: "复习题",
      cardTitle: "先把题意看清",
      keyline: "平均分成，先想除法",
      explanation: "考前冲刺里，应用题主要看能不能先看清关键词。",
      steps: ["先圈出“平均分成”。", "再决定是不是要用除法。"]
    },
    confirmRetry: {
      pageTitle: "再看竖式进位",
      pageMeta: "确认题",
      cardTitle: "先把进位带上",
      keyline: "十位结果别漏加进位",
      explanation: "考前确认题主要是查漏补缺，确保基础步骤不再丢分。",
      steps: ["先把个位进位记出来。", "再去算十位，把进位加上。"]
    },
    mastered: {
      eyebrow: "考前状态更稳了",
      title: "最容易丢分的题型已基本稳住",
      summary: "这次冲刺先修正了最关键的失分点，考前再做一轮确认，效果会更稳。",
      completedSummary: "今天完成 6 道考前冲刺题",
      diagnosis: "重点失分点已经被系统优先拉起",
      previousAccuracy: 55,
      currentAccuracy: 86,
      closedKnowledgePoints: 3,
      fixedWeakness: "连续退位减法、应用题数量关系、竖式进位",
      suggestion: "建议明天继续做 1 轮短练，优先看今天答错过的地方。"
    }
  },
  tutorPreview: {
    taskTitle: "预习讲解",
    practice: {
      title: "预习新知识",
      progress: "1 / 4",
      expression: "42 - 18 = ?",
      hint: "先认识借位这一步要怎么做",
      answers: [
        { label: "24", correct: true },
        { label: "34", correct: false },
        { label: "26", correct: false }
      ]
    },
    bridge: {
      title: "继续预习",
      progress: "2 / 4",
      expression: "52 - 27 = ?",
      hint: "个位不够减时，先借 1",
      answers: [
        { label: "25", correct: true },
        { label: "35", correct: false },
        { label: "15", correct: false }
      ]
    },
    confirm: {
      title: "预习后确认",
      progress: "4 / 4",
      expression: "62 - 38 = ?",
      hint: "借位后，十位别忘了先减 1",
      answers: [
        { label: "24", correct: true },
        { label: "34", correct: false },
        { label: "14", correct: false }
      ]
    },
    wrong: {
      eyebrow: "先把方法听懂",
      title: "新知识题主要错在步骤不熟",
      summary: "预习题出错很正常，重点是先把步骤顺序看明白，再继续往后做。",
      keyline: "先理解方法，再追求做对",
      buttonLabel: "先看关键一步"
    },
    bridgeRetry: {
      pageTitle: "再看新知识",
      pageMeta: "过渡题",
      cardTitle: "先把借位方法看清楚",
      keyline: "个位不够减，就先借 1",
      explanation: "预习时先把方法看懂，后面遇到同类题就不容易慌。",
      steps: ["先看个位够不够减。", "不够减就从十位借 1。"]
    },
    confirmRetry: {
      pageTitle: "再看新知识",
      pageMeta: "确认题",
      cardTitle: "先把更新步骤看清楚",
      keyline: "借过 1 的那一位要先变小",
      explanation: "这道确认题主要看有没有把新知识里的关键一步记住。",
      steps: ["先找借位发生在哪一位。", "把那一位先减 1，再继续算。"]
    },
    mastered: {
      eyebrow: "预习已经听懂了",
      title: "新知识题已基本掌握",
      summary: "预习阶段最重要的是先把方法听懂。现在孩子已经能按新步骤做题了。",
      completedSummary: "今天完成 4 道预习讲解题",
      diagnosis: "新知识步骤已经能独立做出来",
      previousAccuracy: 40,
      currentAccuracy: 78,
      closedKnowledgePoints: 1,
      fixedWeakness: "借位方法不熟、步骤顺序不清楚",
      suggestion: "明天上课前再看一遍关键一步，课堂上会更容易跟上。"
    }
  },
  tutorReview: {
    taskTitle: "课后复习",
    practice: {
      title: "课后复习",
      progress: "1 / 5",
      expression: "502 - 178 = ?",
      hint: "把今天课堂里的借位步骤再做一遍",
      answers: [
        { label: "324", correct: true },
        { label: "334", correct: false },
        { label: "314", correct: false }
      ]
    },
    bridge: {
      title: "再做一道复习",
      progress: "2 / 5",
      expression: "600 - 247 = ?",
      hint: "连续借位时，每一位都要更新",
      answers: [
        { label: "353", correct: true },
        { label: "453", correct: false },
        { label: "343", correct: false }
      ]
    },
    confirm: {
      title: "最后做一道确认",
      progress: "4 / 5",
      expression: "703 - 468 = ?",
      hint: "借位以后，十位和百位都别忘更新",
      answers: [
        { label: "235", correct: true },
        { label: "245", correct: false },
        { label: "325", correct: false }
      ]
    },
    wrong: {
      eyebrow: "先把课堂重点再练一遍",
      title: "复习题主要错在课堂步骤还没完全记牢",
      summary: "说明孩子上课已经听过，但回家后还需要再做一遍，才能把课堂方法真正记住。",
      keyline: "课堂学过的步骤，回家要再独立做一遍",
      buttonLabel: "先复习关键一步"
    },
    bridgeRetry: {
      pageTitle: "再看课堂重点",
      pageMeta: "复习题",
      cardTitle: "先把课堂重点再过一遍",
      keyline: "连续借位时，每一位都要更新",
      explanation: "课后复习主要看能不能把课堂讲过的步骤独立重复出来。",
      steps: ["先找借位从哪一位开始。", "每借一次，相关的那一位都要更新。"]
    },
    confirmRetry: {
      pageTitle: "再看课堂重点",
      pageMeta: "确认题",
      cardTitle: "先把更新顺序做对",
      keyline: "先更新，再继续往后算",
      explanation: "这道确认题主要查的是有没有真正把课堂步骤记熟。",
      steps: ["先更新借位后的数字。", "再继续往后算，不要跳步。"]
    },
    mastered: {
      eyebrow: "课堂重点更稳了",
      title: "课后复习已基本掌握",
      summary: "这次复习说明孩子已经能把课堂上学过的步骤重新做出来，理解更扎实了。",
      completedSummary: "今天完成 5 道课后复习题",
      diagnosis: "课堂重点已经能独立复现",
      previousAccuracy: 52,
      currentAccuracy: 84,
      closedKnowledgePoints: 2,
      fixedWeakness: "课堂步骤记不牢，回家独立做时容易跳步",
      suggestion: "接下来建议隔天再做 1 题复习题，看看能不能继续保持。"
    }
  },
  tutorTargeted: {
    taskTitle: "针对练习",
    practice: {
      title: "针对练习",
      progress: "1 / 5",
      expression: "703 - 468 = ?",
      hint: "先练当前最薄弱的借位更新",
      answers: [
        { label: "235", correct: true },
        { label: "245", correct: false },
        { label: "325", correct: false }
      ]
    },
    bridge: {
      title: "继续针对练",
      progress: "2 / 5",
      expression: "36 × 4 = ?",
      hint: "个位进位要带到十位",
      answers: [
        { label: "144", correct: true },
        { label: "124", correct: false },
        { label: "134", correct: false }
      ]
    },
    confirm: {
      title: "再做一道确认",
      progress: "4 / 5",
      expression: "图书角原来有 48 本书，借走 19 本，又还回 6 本，现在有多少本？",
      hint: "把题意和步骤一起确认一遍",
      answers: [
        { label: "35", correct: true },
        { label: "29", correct: false },
        { label: "73", correct: false }
      ]
    },
    wrong: {
      eyebrow: "按薄弱点继续出题",
      title: "针对练习先补最容易出错的步骤",
      summary: "系统会根据孩子当前最薄弱的步骤继续出题，不是随机练，而是哪里容易错就先补哪里。",
      keyline: "薄弱点优先，先补步骤再做变式题",
      buttonLabel: "先补这一步"
    },
    bridgeRetry: {
      pageTitle: "再看薄弱点",
      pageMeta: "知识巩固题",
      cardTitle: "先把最薄弱的一步做稳",
      keyline: "个位进位或借位更新，先抓一个点练",
      explanation: "针对练习不是越多越好，而是先把最薄弱的一步练稳，再继续扩展。",
      steps: ["先看这题最关键的是借位还是进位。", "先把这一步做对，再继续往后算。"]
    },
    confirmRetry: {
      pageTitle: "再看薄弱点",
      pageMeta: "确认题",
      cardTitle: "先把方法和题意对上",
      keyline: "看清题意，再套用刚刚练过的方法",
      explanation: "这道确认题主要看孩子能不能把刚练过的方法迁移到新题里。",
      steps: ["先看这题问的是什么。", "再用刚刚练过的方法去做。"]
    },
    mastered: {
      eyebrow: "薄弱点练起来了",
      title: "针对练习已看到明显效果",
      summary: "系统按薄弱点出的题已经开始起作用，孩子现在能更稳定地把关键步骤做出来。",
      completedSummary: "今天完成 5 道针对练习题",
      diagnosis: "当前最薄弱的步骤已经开始稳定",
      previousAccuracy: 49,
      currentAccuracy: 84,
      closedKnowledgePoints: 2,
      fixedWeakness: "借位更新、竖式进位漏加",
      suggestion: "建议下一轮继续按系统推荐做 1 组变式题，把方法迁移到新题里。"
    }
  }
} as const;

export type ScreenKey =
  | "home"
  | "agent"
  | "agentResult"
  | "learning"
  | "profile"
  | "schoolBinding"
  | "learningReminder"
  | "dataPrivacy"
  | "accountSettings"
  | "accountCancel"
  | "wrongBook"
  | "wrongBookDetail"
  | "afterClassReview"
  | "afterClassReviewPaper"
  | "afterClassReviewResult"
  | "afterClassReviewKnowledge"
  | "targetedQuestion"
  | "previewLesson"
  | "examPrep"
  | "tutorExplain"
  | "teacherFeedback"
  | "practice"
  | "wrong"
  | "bridge"
  | "bridgeRetry"
  | "confirm"
  | "confirmRetry"
  | "mastered"
  | "photo"
  | "photoAnalyzing"
  | "photoResult"
  | "progress";

export type FeatureOverviewMode =
  | "wrongBook"
  | "examPrep"
  | "tutorExplain"
  | "teacherFeedback";

export type FeatureOverview = {
  title: string;
  meta: string;
  headline: string;
  summary: string;
  stats: Array<{ label: string; value: string }>;
  items: Array<{ title: string; meta: string; value: string }>;
  actionLabel?: string;
};

export const homeFeatures = [
  { key: "photo", title: "检查作业", badge: "拍照即查", tone: "photo-card" },
  { key: "wrongBook", title: "错题本", badge: "12 道", tone: "wrong-book-card" },
  { key: "examPrep", title: "考前冲刺", badge: "还有 5 天", tone: "exam-card" },
  { key: "tutorExplain", title: "课内知识巩固", badge: "预习复习都能用", tone: "tutor-card" },
  { key: "progress", title: "学习报告", badge: "+33%", tone: "report-card" },
  { key: "teacherFeedback", title: "老师反馈", badge: "1 条新", tone: "feedback-card" }
] as const;

export const featureOverviews: Record<FeatureOverviewMode, FeatureOverview> = {
  wrongBook: {
    title: "错题本",
    meta: "老师确认的数据",
    headline: "12 道错题，先练最容易再丢分的 3 道",
    summary: "已经按重复次数和考试影响排好顺序。",
    stats: [
      { label: "本周新增", value: "4 道" },
      { label: "重复出错", value: "3 道" }
    ],
    items: [
      { title: "连续退位减法", meta: "第五单元测评", value: "4 道" },
      { title: "应用题读题", meta: "周末作业", value: "3 道" },
      { title: "乘法竖式", meta: "课堂练习", value: "2 道" }
    ],
    actionLabel: "开始巩固 3 道题"
  },
  examPrep: {
    title: "考前冲刺",
    meta: "下一次单元测评",
    headline: "距离测评还有 5 天",
    summary: "每天 10 分钟，优先补 3 个最可能重复失分的位置。",
    stats: [
      { label: "今日用时", value: "10 分钟" },
      { label: "待补失分点", value: "3 个" }
    ],
    items: [
      { title: "连续退位减法", meta: "重复错误 2 次", value: "优先" },
      { title: "应用题数量关系", meta: "老师建议关注", value: "其次" },
      { title: "竖式书写", meta: "容易漏写", value: "巩固" }
    ],
    actionLabel: "开始今日冲刺"
  },
  tutorExplain: {
    title: "课内知识巩固",
    meta: "预习、复习、讲解、出题都能用",
    headline: "围绕课堂知识点，讲懂、练会、再出题巩固",
    summary: "可以根据孩子当前情况安排预习讲解、复习巩固和针对练习。",
    stats: [
      { label: "适用场景", value: "4 类" },
      { label: "后续练习", value: "可继续出题" }
    ],
    items: [
      { title: "预习讲解", meta: "上课前先看重点", value: "可用" },
      { title: "课后复习", meta: "把没听懂的再讲一遍", value: "可用" },
      { title: "针对出题", meta: "按知识点继续练习", value: "可用" }
    ],
    actionLabel: "开始巩固知识"
  },
  teacherFeedback: {
    title: "老师反馈",
    meta: "王老师 · 今天 16:20",
    headline: "借位步骤已经更稳定",
    summary: "下周课堂会继续观察应用题读题。",
    stats: [
      { label: "本周反馈", value: "2 条" },
      { label: "待家长查看", value: "1 条" }
    ],
    items: [
      { title: "课堂表现", meta: "计算过程更主动检查", value: "进步" },
      { title: "仍需关注", meta: "应用题数量关系", value: "继续观察" },
      { title: "家庭建议", meta: "完成今日 8 分钟任务", value: "1 项" }
    ]
  }
} as const;
