<template>
  <PhoneScaffold
    :title="overview.title"
    :meta="overview.meta"
    content-class="insight-content tutor-content"
    shell-class="insight-shell"
    show-back
    show-nav
    active-tab="home"
    @back="$emit('action', 'GO_HOME')"
    @navigate="$emit('navigate', $event)"
  >
    <section class="insight-hero-card tutor-hero-card">
      <div class="insight-hero-top">
        <div class="insight-hero-copy">
          <span class="insight-kicker">课内知识巩固</span>
          <h2>{{ overview.headline }}</h2>
          <p>{{ overview.summary }}</p>
        </div>
        <div class="insight-hero-icon tutor-icon">
          <GraduationCap :size="28" />
        </div>
      </div>

      <div class="insight-chip-row">
        <span v-for="scene in tutorScenes" :key="scene" class="insight-chip">{{ scene }}</span>
      </div>

      <div class="insight-stat-grid">
        <div v-for="stat in overview.stats" :key="stat.label" class="insight-stat-card">
          <span>{{ stat.label }}</span>
          <strong>{{ stat.value }}</strong>
        </div>
      </div>
    </section>

    <section class="insight-section-card">
      <div class="insight-section-head">
        <strong>可以这样用</strong>
        <span>点击板块直接进入</span>
      </div>

      <div class="insight-scene-grid">
        <button
          v-for="item in tutorCards"
          :key="item.title"
          type="button"
          class="insight-scene-card"
          @click="openTutorCard(item.practiceKey)"
        >
          <div class="insight-scene-top">
            <strong>{{ item.title }}</strong>
            <span class="insight-scene-icon">
              <component :is="item.icon" :size="18" />
            </span>
          </div>
          <p>{{ item.meta }}</p>
          <small>{{ item.value }}</small>
        </button>
      </div>
    </section>
  </PhoneScaffold>
</template>

<script setup lang="ts">
import { BookOpenCheck, GraduationCap, PenTool, RotateCcw } from "lucide-vue-next";
import type { Component } from "vue";
import PhoneScaffold from "../components/PhoneScaffold.vue";
import type { DemoEvent } from "../composables/useDemoFlow";
import { featureOverviews } from "../data/demoData";

const overview = featureOverviews.tutorExplain;
const tutorScenes = ["预习", "复习", "讲解", "针对练习"];
const tutorIcons: Component[] = [BookOpenCheck, RotateCcw, PenTool];
const tutorCards = overview.items.map((item, index) => ({
  ...item,
  icon: tutorIcons[index] ?? GraduationCap,
  practiceKey:
    index === 0
      ? ("tutorPreview" as const)
      : index === 1
        ? ("tutorReview" as const)
        : ("tutorTargeted" as const)
}));

const emit = defineEmits<{
  action: [DemoEvent];
  navigate: ["home" | "agent" | "learning" | "profile"];
  openPractice: ["tutorPreview" | "tutorReview" | "tutorTargeted"];
}>();

const openTutorCard = (practiceKey: "tutorPreview" | "tutorReview" | "tutorTargeted") => {
  if (practiceKey === "tutorPreview") {
    emit("action", "OPEN_PREVIEW_LESSON");
    return;
  }
  if (practiceKey === "tutorReview") {
    emit("action", "OPEN_AFTER_CLASS_REVIEW");
    return;
  }
  if (practiceKey === "tutorTargeted") {
    emit("action", "OPEN_TARGETED_QUESTION");
    return;
  }
  emit("openPractice", practiceKey);
};
</script>
