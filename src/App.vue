<template>
  <div class="app-root">
    <MobileRenderer
      v-if="platformMode === 'mobile'"
      :key="activeChildId"
      :active-child-id="activeChildId"
      :add-child="addChild"
      :child-options="childOptions"
      :current-screen="currentScreen"
      :display-mode-class="displayModeClass"
      :handle-action="handleAction"
      :handle-nav="handleNav"
      :is-elder-mode="isElderMode"
      :delete-child="deleteChild"
      :open-wrong-book-detail="openWrongBookDetail"
      :selected-practice-source-key="selectedPracticeSourceKey"
      :selected-wrong-book-topic-key="selectedWrongBookTopicKey"
      :set-elder-mode="setElderMode"
      :switch-child="switchChild"
      :update-child="updateChild"
      :start-practice-from-source="startPracticeFromSource"
    />
    <DesktopRenderer
      v-else
      :key="activeChildId"
      :active-child-id="activeChildId"
      :add-child="addChild"
      :child-options="childOptions"
      :active-tab="activeTab"
      :current-screen="currentScreen"
      :go-back="goBack"
      :handle-action="handleAction"
      :handle-nav="handleNav"
      :is-elder-mode="isElderMode"
      :delete-child="deleteChild"
      :open-wrong-book-detail="openWrongBookDetail"
      :reset="reset"
      :selected-practice-source-key="selectedPracticeSourceKey"
      :selected-wrong-book-topic-key="selectedWrongBookTopicKey"
      :set-elder-mode="setElderMode"
      :switch-child="switchChild"
      :update-child="updateChild"
      :start-practice-from-source="startPracticeFromSource"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import DesktopRenderer from "./desktop/DesktopRenderer.vue";
import MobileRenderer from "./mobile/MobileRenderer.vue";
import { useDemoController } from "./composables/useDemoController";

type PlatformPreference = "auto" | "desktop" | "mobile";
type PlatformMode = Exclude<PlatformPreference, "auto">;

const {
  activeTab,
  activeChildId,
  addChild,
  childOptions,
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
} = useDemoController();

const platformStorageKey = "kaofuzi-platform-preference";
const platformButtons = [
  { label: "自动", value: "auto" },
  { label: "PC", value: "desktop" },
  { label: "手机", value: "mobile" }
] as const;

const getQueryPreference = (): PlatformPreference | null => {
  if (typeof window === "undefined") return null;
  const mode = new URLSearchParams(window.location.search).get("mode");
  if (mode === "desktop" || mode === "mobile" || mode === "auto") return mode;
  return null;
};

const getSavedPreference = (): PlatformPreference => {
  if (typeof window === "undefined") return "auto";
  const queryMode = getQueryPreference();
  if (queryMode) return queryMode;
  const savedMode = window.localStorage.getItem(platformStorageKey);
  return savedMode === "desktop" || savedMode === "mobile" || savedMode === "auto" ? savedMode : "auto";
};

const platformPreference = ref<PlatformPreference>(getSavedPreference());
const viewportWidth = ref(typeof window === "undefined" ? 1440 : window.innerWidth);

const platformMode = computed<PlatformMode>(() => {
  if (platformPreference.value === "desktop") return "desktop";
  if (platformPreference.value === "mobile") return "mobile";
  return viewportWidth.value >= 1080 ? "desktop" : "mobile";
});

const syncQueryString = (mode: PlatformPreference) => {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  url.searchParams.set("mode", mode);
  window.history.replaceState({}, "", url.toString());
};

const setPlatformPreference = (mode: PlatformPreference) => {
  platformPreference.value = mode;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(platformStorageKey, mode);
  }
  syncQueryString(mode);
};

const syncViewportWidth = () => {
  viewportWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener("resize", syncViewportWidth);
  syncViewportWidth();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", syncViewportWidth);
});
</script>
