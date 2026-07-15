<template>
  <PhoneScaffold
    :title="overview.title"
    :meta="overview.meta"
    content-class="insight-content exam-prep-content"
    shell-class="insight-shell"
    show-back
    show-nav
    active-tab="home"
    @back="$emit('action', 'GO_HOME')"
    @navigate="$emit('navigate', $event)"
  >
    <section class="insight-hero-card exam-prep-hero-card">
      <div class="insight-hero-top">
        <div class="insight-hero-copy">
          <span class="insight-kicker">考前冲刺</span>
          <h2>{{ overview.headline }}</h2>
          <p>{{ overview.summary }}</p>
        </div>
        <div class="insight-hero-icon exam-prep-icon">
          <CalendarDays :size="28" />
        </div>
      </div>

      <div class="insight-chip-row">
        <span class="insight-chip">{{ demoData.teacher.assessmentName }}</span>
        <span class="insight-chip">每日 {{ demoData.task.durationMinutes }} 分钟</span>
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
        <strong>今天先补这些</strong>
        <span>按提分优先级排序</span>
      </div>

      <div class="insight-item-list">
        <article
          v-for="item in rankedItems"
          :key="item.title"
          class="insight-item-card"
        >
          <div class="insight-item-rank"><b>{{ item.rank }}</b></div>
          <div class="insight-item-main">
            <div class="insight-item-head">
              <strong>{{ item.title }}</strong>
              <small>{{ item.value }}</small>
            </div>
            <p>{{ item.meta }}</p>
            <div class="insight-item-bar">
              <span :style="{ width: item.barWidth }" />
            </div>
          </div>
        </article>
      </div>
    </section>

    <button
      type="button"
      class="primary-button insight-primary-button"
      @click="$emit('openPractice', 'examPrepFocus')"
    >
      {{ overview.actionLabel }}
      <ArrowRight :size="21" />
    </button>
  </PhoneScaffold>
</template>

<script setup lang="ts">
import { ArrowRight, CalendarDays } from "lucide-vue-next";
import PhoneScaffold from "../components/PhoneScaffold.vue";
import type { DemoEvent } from "../composables/useDemoFlow";
import { demoData, featureOverviews } from "../data/demoData";

const overview = featureOverviews.examPrep;

const rankedItems = overview.items.map((item, index) => ({
  ...item,
  rank: index + 1,
  barWidth: index === 0 ? "100%" : index === 1 ? "78%" : "60%"
}));

defineEmits<{
  action: [DemoEvent];
  navigate: ["home" | "agent" | "learning" | "profile"];
  openPractice: ["examPrepFocus"];
}>();
</script>
