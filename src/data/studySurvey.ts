export type SurveyFieldKey = "weakness" | "pace" | "support" | "goal";

export type StudySurveyOption = {
  key: string;
  label: string;
  hint: string;
};

export type StudySurveyField = {
  key: SurveyFieldKey;
  title: string;
  summary: string;
  options: StudySurveyOption[];
};

export type StudySurveySelections = Record<SurveyFieldKey, string>;

export type StudySurveyRecord = {
  selections: StudySurveySelections;
  parentNote: string;
  submittedAt: string;
};

export const studySurveyStorageKey = "kaofuzi-study-survey";

export const studySurveyFields: StudySurveyField[] = [
  {
    key: "weakness",
    title: "孩子最近最常卡在哪",
    summary: "先告诉系统最容易失分的地方",
    options: [
      { key: "borrow", label: "连续退位减法", hint: "借位以后容易乱" },
      { key: "word", label: "应用题读题", hint: "会算但常看漏题意" },
      { key: "multiply", label: "乘法竖式", hint: "进位或书写容易错" },
      { key: "careless", label: "计算粗心", hint: "会做但容易抄错漏步" }
    ]
  },
  {
    key: "pace",
    title: "孩子做题时更像哪种状态",
    summary: "这会影响系统安排讲解和节奏",
    options: [
      { key: "panic", label: "一遇难题就慌", hint: "容易着急，不敢慢慢做" },
      { key: "slow", label: "会做但速度慢", hint: "懂方法，但做题拖得久" },
      { key: "skip-check", label: "会做但不检查", hint: "做完就交，容易漏看" },
      { key: "need-remind", label: "提醒后会更好", hint: "有人带一下就明显稳" }
    ]
  },
  {
    key: "support",
    title: "家里现在能提供什么陪学节奏",
    summary: "系统会据此调整题量和任务长度",
    options: [
      { key: "short-daily", label: "每天 10 分钟左右", hint: "适合短练，持续推进" },
      { key: "daily-remind", label: "只能短时间提醒", hint: "需要更省心的安排" },
      { key: "weekend", label: "周末集中陪一下", hint: "平时少，周末补得多" },
      { key: "independent", label: "大多靠孩子自己", hint: "更需要步骤清楚的任务" }
    ]
  },
  {
    key: "goal",
    title: "这次最希望系统先帮什么",
    summary: "先说诉求，推荐会更贴近家长目的",
    options: [
      { key: "find-weak", label: "先找准薄弱点", hint: "优先判断哪里最该补" },
      { key: "steady-score", label: "先稳基础分", hint: "先把容易丢的分守住" },
      { key: "explain", label: "先讲清错因", hint: "想先知道孩子到底错在哪" },
      { key: "exam", label: "先准备测评", hint: "最近更想提考试成绩" }
    ]
  }
];

export const createEmptyStudySurveySelections = (): StudySurveySelections => ({
  weakness: "",
  pace: "",
  support: "",
  goal: ""
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const readStudySurvey = (): StudySurveyRecord | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(studySurveyStorageKey);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || !isRecord(parsed.selections)) return null;

    const selections = createEmptyStudySurveySelections();
    for (const field of studySurveyFields) {
      const value = parsed.selections[field.key];
      if (typeof value === "string" && field.options.some((option) => option.key === value)) {
        selections[field.key] = value;
      }
    }

    return {
      selections,
      parentNote: typeof parsed.parentNote === "string" ? parsed.parentNote : "",
      submittedAt: typeof parsed.submittedAt === "string" ? parsed.submittedAt : ""
    };
  } catch {
    return null;
  }
};

export const saveStudySurvey = (record: StudySurveyRecord) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(studySurveyStorageKey, JSON.stringify(record));
  } catch {
    // The result page still works in memory when browser storage is unavailable.
  }
};
