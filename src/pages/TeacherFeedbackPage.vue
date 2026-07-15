<template>
  <PhoneScaffold
    :title="overview.title"
    :meta="overview.meta"
    content-class="insight-content teacher-feedback-content"
    shell-class="insight-shell"
    show-back
    show-nav
    active-tab="home"
    @back="$emit('action', 'GO_HOME')"
    @navigate="$emit('navigate', $event)"
  >
    <section class="insight-hero-card teacher-feedback-hero-card">
      <div class="insight-hero-top">
        <div class="insight-hero-copy">
          <span class="insight-kicker">老师反馈</span>
          <h2>{{ overview.headline }}</h2>
          <p>{{ overview.summary }}</p>
        </div>
        <div class="insight-hero-icon teacher-feedback-icon">
          <MessageSquareText :size="28" />
        </div>
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
        <strong>老师这次重点提到</strong>
        <span>按关注程度整理</span>
      </div>

      <div class="teacher-feedback-list">
        <article
          v-for="item in overview.items"
          :key="item.title"
          class="teacher-feedback-card"
        >
          <div class="teacher-feedback-head">
            <strong>{{ item.title }}</strong>
            <small>{{ item.value }}</small>
          </div>
          <p>{{ item.meta }}</p>
        </article>
      </div>
    </section>

  <!--  <section class="insight-note-card">
      <span>家庭建议</span>
      <strong>按老师提醒完成今日 8 分钟任务，保持现在这个节奏。</strong>
    </section> -->
  </PhoneScaffold>
</template>

<script setup lang="ts">
import { MessageSquareText } from "lucide-vue-next";
import PhoneScaffold from "../components/PhoneScaffold.vue";
import type { DemoEvent } from "../composables/useDemoFlow";
import { featureOverviews } from "../data/demoData";

const overview = featureOverviews.teacherFeedback;

defineEmits<{
  action: [DemoEvent];
  navigate: ["home" | "agent" | "learning" | "profile"];
}>();
</script>
