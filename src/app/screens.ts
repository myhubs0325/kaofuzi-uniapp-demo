import type { ScreenKey } from "../data/demoData";

export type ScreenDefinition = {
  key: ScreenKey;
  title: string;
  summary: string;
  section: "home" | "learning" | "profile" | "practice" | "capture";
};

export const screenDefinitions: ScreenDefinition[] = [
  { key: "home", title: "首页", summary: "今日任务与快捷入口。", section: "home" },
  { key: "agent", title: "家长反馈", summary: "家长补充孩子近期真实状态。", section: "home" },
  { key: "agentResult", title: "家长反馈结果", summary: "反馈结果和推荐练习。", section: "home" },
  { key: "learning", title: "学习进展", summary: "看进步、反馈、错题与冲刺。", section: "learning" },
  { key: "profile", title: "我的", summary: "家长账号与服务设置。", section: "profile" },
  { key: "schoolBinding", title: "学校绑定", summary: "绑定老师与学生关系。", section: "profile" },
  { key: "learningReminder", title: "学习提醒", summary: "提醒时间与方式设置。", section: "profile" },
  { key: "dataPrivacy", title: "数据隐私", summary: "账号、学生和隐私说明。", section: "profile" },
  { key: "accountSettings", title: "账号设置", summary: "基础设置与安全项。", section: "profile" },
  { key: "accountCancel", title: "账号注销", summary: "注销前提醒与确认。", section: "profile" },
  { key: "wrongBook", title: "错题本", summary: "按高频失分点整理错题。", section: "learning" },
  { key: "wrongBookDetail", title: "错题详情", summary: "查看同类错因与题目。", section: "learning" },
  { key: "afterClassReview", title: "课后复习", summary: "课后小测入口。", section: "learning" },
  { key: "afterClassReviewPaper", title: "课后复习试卷", summary: "统一完成小测。", section: "practice" },
  { key: "afterClassReviewResult", title: "课后复习结果", summary: "提交后的讲评结果。", section: "practice" },
  { key: "afterClassReviewKnowledge", title: "课后知识点巩固", summary: "针对知识点再讲一遍。", section: "practice" },
  { key: "targetedQuestion", title: "针对出题", summary: "围绕薄弱点继续出题。", section: "learning" },
  { key: "previewLesson", title: "预习讲解", summary: "上课前先听重点。", section: "learning" },
  { key: "examPrep", title: "考前冲刺", summary: "考前提分任务。", section: "learning" },
  { key: "tutorExplain", title: "课内知识巩固", summary: "预习、复习、针对练习。", section: "learning" },
  { key: "teacherFeedback", title: "老师反馈", summary: "课后反馈与建议。", section: "learning" },
  { key: "practice", title: "练习题", summary: "开始做题。", section: "practice" },
  { key: "wrong", title: "答错解析", summary: "先看最关键的一步。", section: "practice" },
  { key: "bridge", title: "过桥题", summary: "用简单题巩固关键步骤。", section: "practice" },
  { key: "bridgeRetry", title: "过桥重试", summary: "再把关键步骤看一遍。", section: "practice" },
  { key: "confirm", title: "确认题", summary: "回到主线做确认。", section: "practice" },
  { key: "confirmRetry", title: "确认重试", summary: "确认题错后再提醒。", section: "practice" },
  { key: "mastered", title: "掌握结果", summary: "任务完成后的阶段结果。", section: "practice" },
  { key: "photo", title: "拍照检查", summary: "上传作业并识别。", section: "capture" },
  { key: "photoAnalyzing", title: "分析中", summary: "系统正在识别。", section: "capture" },
  { key: "photoResult", title: "拍照结果", summary: "查看识别结果和讲解。", section: "capture" },
  { key: "progress", title: "学习报告", summary: "近几周的学习变化。", section: "learning" }
];

export const screenDefinitionMap: Record<ScreenKey, ScreenDefinition> = Object.fromEntries(
  screenDefinitions.map((screen) => [screen.key, screen])
) as Record<ScreenKey, ScreenDefinition>;
