import { computed, provide, ref } from "vue";
import { addDemoChild, demoChildren, removeDemoChild, switchDemoChild, updateDemoChild, type PracticeEntryKey, type ScreenKey, type StudentProfile, type WrongBookTopicKey } from "../data/demoData";
import { useDemoFlow, type DemoEvent } from "./useDemoFlow";

export function useDemoController() {
  const { currentScreen, activeTab, send, reset } = useDemoFlow();
  const selectedWrongBookTopicKey = ref<WrongBookTopicKey>("borrowSubtraction");
  const selectedPracticeSourceKey = ref<PracticeEntryKey>("dailyBoost");
  const profileDetailReturnScreen = ref<ScreenKey>("profile");
  const displayModeStorageKey = "kaofuzi-display-mode";
  const childStorageKey = "kaofuzi-current-child";
  const initialChildId = typeof window !== "undefined"
    ? window.localStorage.getItem(childStorageKey) ?? demoChildren[0].id
    : demoChildren[0].id;
  const activeChildId = ref(demoChildren.some((child) => child.id === initialChildId) ? initialChildId : demoChildren[0].id);
  switchDemoChild(activeChildId.value);

  const getSavedDisplayMode = () => {
    if (typeof window === "undefined") return "normal";
    return window.localStorage.getItem(displayModeStorageKey) === "elder" ? "elder" : "normal";
  };

  const displayMode = ref<"normal" | "elder">(getSavedDisplayMode());
  const isElderMode = computed(() => displayMode.value === "elder");
  const displayModeClass = computed(() => (isElderMode.value ? "mode-elder" : "mode-normal"));

  const setElderMode = (enabled: boolean) => {
    displayMode.value = enabled ? "elder" : "normal";
    if (typeof window !== "undefined") {
      window.localStorage.setItem(displayModeStorageKey, displayMode.value);
    }
  };

  const switchChild = (childId: string, returnHome = true) => {
    if (childId === activeChildId.value || !switchDemoChild(childId)) return;
    activeChildId.value = childId;
    selectedWrongBookTopicKey.value = "borrowSubtraction";
    selectedPracticeSourceKey.value = "dailyBoost";
    if (returnHome) reset();
    if (typeof window !== "undefined") window.localStorage.setItem(childStorageKey, childId);
  };

  const addChild = (student: StudentProfile) => {
    const child = addDemoChild(student);
    activeChildId.value = child.id;
    switchDemoChild(child.id);
    if (typeof window !== "undefined") window.localStorage.setItem(childStorageKey, child.id);
    return true;
  };

  const updateChild = (childId: string, student: StudentProfile) => {
    if (!updateDemoChild(childId, student)) return false;
    if (childId === activeChildId.value) switchDemoChild(childId);
    return true;
  };

  const deleteChild = (childId: string) => {
    if (childId === activeChildId.value || demoChildren.length <= 1) return false;
    return removeDemoChild(childId);
  };

  provide("openDataPrivacy", () => {
    profileDetailReturnScreen.value = currentScreen.value;
    send("OPEN_DATA_PRIVACY");
  });

  const handleNav = (tab: "home" | "agent" | "learning" | "profile") => {
    if (tab === "home") send("GO_HOME");
    if (tab === "agent") send("VIEW_AGENT");
    if (tab === "learning") send("VIEW_LEARNING");
    if (tab === "profile") send("VIEW_PROFILE");
  };

  const openWrongBookDetail = (topicKey: WrongBookTopicKey) => {
    selectedWrongBookTopicKey.value = topicKey;
    send("OPEN_WRONG_BOOK_DETAIL");
  };

  const startPracticeFromSource = (sourceKey: PracticeEntryKey) => {
    selectedPracticeSourceKey.value = sourceKey;
    send("START_TASK");
  };

  const handleAction = (event: DemoEvent) => {
    if (
      event === "OPEN_SCHOOL_BINDING" ||
      event === "OPEN_LEARNING_REMINDER" ||
      event === "OPEN_DATA_PRIVACY" ||
      event === "OPEN_ACCOUNT_SETTINGS" ||
      event === "OPEN_ACCOUNT_CANCEL"
    ) {
      profileDetailReturnScreen.value = "profile";
    }
    if (event === "BACK_FROM_PROFILE_DETAIL") {
      currentScreen.value = profileDetailReturnScreen.value;
      return;
    }
    if (
      event === "START_TASK" &&
      (currentScreen.value === "home" || currentScreen.value === "agentResult")
    ) {
      selectedPracticeSourceKey.value = "dailyBoost";
    }
    send(event);
  };

  const goBack = () => {
    const screen = currentScreen.value;
    const parent: Partial<Record<ScreenKey, ScreenKey>> = {
      agentResult: "agent",
      wrongBookDetail: "wrongBook",
      photoAnalyzing: "photo",
      photoResult: "photo",
      previewLesson: "tutorExplain",
      targetedQuestion: "tutorExplain",
      afterClassReview: "tutorExplain",
      afterClassReviewPaper: "afterClassReview",
      afterClassReviewResult: "afterClassReviewPaper",
      afterClassReviewKnowledge: "afterClassReviewResult",
      schoolBinding: "profile",
      learningReminder: "profile",
      dataPrivacy: profileDetailReturnScreen.value,
      accountSettings: "profile",
      accountCancel: "accountSettings",
      tutorExplain: "learning",
      teacherFeedback: "learning",
      examPrep: "learning",
      wrongBook: "learning",
      progress: "learning",
      practice: "learning",
      wrong: "practice",
      bridge: "practice",
      bridgeRetry: "bridge",
      confirm: "bridge",
      confirmRetry: "confirm",
      mastered: "confirm"
    };
    currentScreen.value = parent[screen] ?? "home";
  };

  return {
    activeTab,
    activeChildId,
    addChild,
    childOptions: demoChildren,
    currentScreen,
    displayModeClass,
    deleteChild,
    goBack,
    handleAction,
    handleNav,
    isElderMode,
    openWrongBookDetail,
    reset,
    selectedPracticeSourceKey,
    selectedWrongBookTopicKey,
    setElderMode,
    switchChild,
    updateChild,
    startPracticeFromSource
  };
}
