export type LearningReportBadgeAsset = "effort" | "champion" | "knowledge";

export const learningReport = {
  level: {
    code: "Lv.2",
    title: "稳定练习",
    currentValue: 186,
    nextValue: 250,
    progress: 74,
    summary: "已经能按计划完成练习，下一步把错题复习做得更稳定。"
  },
  weekly: {
    growthValue: 86,
    activeDays: 4,
    practiceCount: 4,
    studyMinutes: 32,
    masteredKnowledgePoints: 2,
    stabilizedWrongQuestions: 5,
    wrongQuestionTotal: 8
  },
  accuracyTrend: [
    { label: "第 1 周", value: 50 },
    { label: "第 2 周", value: 60 },
    { label: "第 3 周", value: 72 },
    { label: "第 4 周", value: 83 }
  ],
  badges: [
    {
      key: "steady-start",
      asset: "effort" as LearningReportBadgeAsset,
      title: "毅力勋章",
      category: "学习习惯",
      current: 8,
      total: 8,
      earned: true,
      detail: "14 天内完成 8 天有效学习获得",
      description: "持之以恒，步步为营，你的毅力值得荣耀"
    },
    {
      key: "wrong-book-recovery",
      asset: "champion" as LearningReportBadgeAsset,
      title: "王者勋章",
      category: "综合表现",
      current: 3,
      total: 3,
      earned: true,
      detail: "综合测试获得 3 次满分获得",
      description: "智慧超群，名列前茅，你是当之无愧的王者"
    },
    {
      key: "knowledge-keeper",
      asset: "knowledge" as LearningReportBadgeAsset,
      title: "知识勋章",
      category: "知识提升",
      current: 2,
      total: 5,
      earned: false,
      detail: "掌握 5 个知识点获得",
      description: "博学多识，融会贯通，知识的力量由你掌握"
    },
    {
      key: "reading-detective",
      asset: "effort" as LearningReportBadgeAsset,
      title: "读题小侦探",
      category: "学习方法",
      current: 3,
      total: 5,
      earned: false,
      detail: "完成应用题读题分析并答对",
      description: "先读懂数量关系，再把每一步说清楚"
    },
    {
      key: "reviewer",
      asset: "champion" as LearningReportBadgeAsset,
      title: "会回头看",
      category: "主动复习",
      current: 2,
      total: 3,
      earned: false,
      detail: "再完成 1 次系统安排的复习",
      description: "愿意回头检查，错误才会真正变少"
    }
  ],
  nextStep: {
    title: "应用题读题",
    summary: "先说清楚题目在问什么，再列出数量关系，帮助正确率继续提升。"
  }
} as const;
