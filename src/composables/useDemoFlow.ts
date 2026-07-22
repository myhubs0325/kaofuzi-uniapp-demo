import { computed, onBeforeUnmount, ref, watch } from "vue";
import { addSiteMessage } from "../data/siteMessages";
import type { ScreenKey } from "../data/demoData";

export type DemoEvent =
  | "RESET"
  | "GO_HOME"
  | "VIEW_AGENT"
  | "VIEW_LEARNING"
  | "VIEW_PROFILE"
  | "OPEN_MESSAGES"
  | "VIEW_PROGRESS"
  | "VIEW_AGENT_RESULT"
  | "SUBMIT_STUDY_SURVEY"
  | "EDIT_STUDY_SURVEY"
  | "OPEN_SCHOOL_BINDING"
  | "OPEN_LEARNING_REMINDER"
  | "OPEN_DATA_PRIVACY"
  | "OPEN_ACCOUNT_SETTINGS"
  | "OPEN_ACCOUNT_CANCEL"
  | "BACK_FROM_PROFILE_DETAIL"
  | "OPEN_WRONG_BOOK"
  | "OPEN_WRONG_BOOK_DETAIL"
  | "OPEN_AFTER_CLASS_REVIEW"
  | "START_AFTER_CLASS_REVIEW"
  | "SUBMIT_AFTER_CLASS_REVIEW"
  | "OPEN_AFTER_CLASS_KNOWLEDGE"
  | "OPEN_TARGETED_QUESTION"
  | "OPEN_PREVIEW_LESSON"
  | "BACK_TO_WRONG_BOOK"
  | "OPEN_EXAM_PREP"
  | "OPEN_TUTOR"
  | "OPEN_TEACHER_FEEDBACK"
  | "START_TASK"
  | "ANSWER_WRONG"
  | "ANSWER_CORRECT"
  | "CONTINUE"
  | "TRY_AGAIN"
  | "OPEN_PHOTO"
  | "OPEN_PHOTO_RESULT"
  | "ANALYZE_PHOTO"
  | "OPEN_AFTER_CLASS_REVIEW_RESULT"
  | "PRACTICE_MISTAKE";

export function useDemoFlow() {
  const flowScreenStorageKey = "kaofuzi-flow-screen";
  const getInitialScreen = (): ScreenKey => {
    if (typeof window === "undefined") return "home";
    try {
      return window.sessionStorage.getItem(flowScreenStorageKey) === "agentResult"
        ? "agentResult"
        : "home";
    } catch {
      return "home";
    }
  };

  const currentScreen = ref<ScreenKey>(getInitialScreen());
  let photoTimer: number | null = null;

  watch(
    currentScreen,
    (screen) => {
      if (typeof window === "undefined") return;
      try {
        if (screen === "agentResult") {
          window.sessionStorage.setItem(flowScreenStorageKey, screen);
        } else {
          window.sessionStorage.removeItem(flowScreenStorageKey);
        }
      } catch {
        // Storage can be unavailable in private browsing; the in-memory flow still works.
      }
    },
    { immediate: true }
  );

  const clearTimer = () => {
    if (photoTimer !== null) {
      window.clearTimeout(photoTimer);
      photoTimer = null;
    }
  };

  const send = (event: DemoEvent) => {
    clearTimer();

    switch (event) {
      case "RESET":
      case "GO_HOME":
        currentScreen.value = "home";
        return;
      case "VIEW_AGENT":
        currentScreen.value = "agent";
        return;
      case "VIEW_LEARNING":
        currentScreen.value = "learning";
        return;
      case "VIEW_PROFILE":
        currentScreen.value = "profile";
        return;
      case "OPEN_MESSAGES":
        currentScreen.value = "messages";
        return;
      case "VIEW_PROGRESS":
        currentScreen.value = "progress";
        return;
      case "VIEW_AGENT_RESULT":
        currentScreen.value = "agentResult";
        return;
      case "SUBMIT_STUDY_SURVEY":
        currentScreen.value = "agentResult";
        addSiteMessage({
          id: "survey-completed",
          category: "system",
          title: "家长补充信息已整理完成",
          summary: "系统已结合家长观察生成新的学习建议，点击查看整理结果。",
          time: "刚刚",
          action: "VIEW_AGENT_RESULT",
          tone: "blue"
        });
        return;
      case "EDIT_STUDY_SURVEY":
        currentScreen.value = "agent";
        return;
      case "OPEN_SCHOOL_BINDING":
        currentScreen.value = "schoolBinding";
        return;
      case "OPEN_LEARNING_REMINDER":
        currentScreen.value = "learningReminder";
        return;
      case "OPEN_DATA_PRIVACY":
        currentScreen.value = "dataPrivacy";
        return;
      case "OPEN_ACCOUNT_SETTINGS":
        currentScreen.value = "accountSettings";
        return;
      case "OPEN_ACCOUNT_CANCEL":
        currentScreen.value = "accountCancel";
        return;
      case "OPEN_WRONG_BOOK":
        currentScreen.value = "wrongBook";
        return;
      case "OPEN_WRONG_BOOK_DETAIL":
        currentScreen.value = "wrongBookDetail";
        return;
      case "OPEN_AFTER_CLASS_REVIEW":
        currentScreen.value = "afterClassReview";
        return;
      case "START_AFTER_CLASS_REVIEW":
        currentScreen.value = "afterClassReviewPaper";
        return;
      case "SUBMIT_AFTER_CLASS_REVIEW":
        currentScreen.value = "afterClassReviewResult";
        addSiteMessage({
          id: "after-class-review-completed",
          category: "task",
          title: "课后复习分析完成",
          summary: "本次小测已经完成分析，点击查看结果和下一步复习建议。",
          time: "刚刚",
          action: "OPEN_AFTER_CLASS_REVIEW_RESULT",
          tone: "green"
        });
        return;
      case "OPEN_AFTER_CLASS_KNOWLEDGE":
        currentScreen.value = "afterClassReviewKnowledge";
        return;
      case "OPEN_TARGETED_QUESTION":
        currentScreen.value = "targetedQuestion";
        return;
      case "OPEN_PREVIEW_LESSON":
        currentScreen.value = "previewLesson";
        return;
      case "BACK_TO_WRONG_BOOK":
        currentScreen.value = "wrongBook";
        return;
      case "OPEN_EXAM_PREP":
        currentScreen.value = "examPrep";
        return;
      case "OPEN_TUTOR":
        currentScreen.value = "tutorExplain";
        return;
      case "OPEN_TEACHER_FEEDBACK":
        currentScreen.value = "teacherFeedback";
        return;
      case "START_TASK":
        currentScreen.value = "practice";
        return;
      case "ANSWER_WRONG":
        if (currentScreen.value === "practice") {
          currentScreen.value = "wrong";
        } else if (currentScreen.value === "bridge") {
          currentScreen.value = "bridgeRetry";
        } else if (currentScreen.value === "confirm") {
          currentScreen.value = "confirmRetry";
        }
        return;
      case "ANSWER_CORRECT":
        if (currentScreen.value === "practice") {
          currentScreen.value = "confirm";
        } else if (currentScreen.value === "bridge") {
          currentScreen.value = "confirm";
        } else if (currentScreen.value === "confirm") {
          currentScreen.value = "mastered";
          addSiteMessage({
            id: "practice-completed",
            category: "task",
            title: "今日推荐练习已完成",
            summary: "关键步骤已经完成确认，点击查看本次练习的掌握结果。",
            time: "刚刚",
            action: "VIEW_PROGRESS",
            tone: "green"
          });
        }
        return;
      case "CONTINUE":
        currentScreen.value = "bridge";
        return;
      case "TRY_AGAIN":
        if (currentScreen.value === "bridgeRetry") {
          currentScreen.value = "bridge";
        } else if (currentScreen.value === "confirmRetry") {
          currentScreen.value = "confirm";
        }
        return;
      case "OPEN_PHOTO":
        currentScreen.value = "photo";
        return;
      case "ANALYZE_PHOTO":
        currentScreen.value = "photoAnalyzing";
        photoTimer = window.setTimeout(() => {
          currentScreen.value = "photoResult";
          addSiteMessage({
            id: "photo-analysis-completed",
            category: "task",
            title: "作业识别与分析完成",
            summary: "系统已完成题目识别并生成错题讲解，点击查看作业分析结果。",
            time: "刚刚",
            action: "OPEN_PHOTO_RESULT",
            tone: "orange"
          });
          photoTimer = null;
        }, 1200);
        return;
      case "OPEN_PHOTO_RESULT":
        currentScreen.value = "photoResult";
        return;
      case "OPEN_AFTER_CLASS_REVIEW_RESULT":
        currentScreen.value = "afterClassReviewResult";
        return;
      case "PRACTICE_MISTAKE":
        currentScreen.value = "practice";
        return;
      default:
        return;
    }
  };

  onBeforeUnmount(clearTimer);

  const activeTab = computed(() => {
    if (["agent", "agentResult"].includes(currentScreen.value)) return "agent";
    if (["learning", "progress"].includes(currentScreen.value)) return "learning";
    if (["profile", "messages", "schoolBinding", "learningReminder", "dataPrivacy", "accountSettings", "accountCancel"].includes(currentScreen.value)) return "profile";
    return "home";
  });

  return {
    currentScreen,
    activeTab,
    send,
    reset: () => send("RESET")
  };
}
