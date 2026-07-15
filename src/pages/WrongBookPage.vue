<template>
  <PhoneScaffold
    :title="overview.title"
    :meta="overview.meta"
    content-class="wrong-book-content"
    shell-class="wrong-book-shell"
    show-back
    show-nav
    active-tab="home"
    @back="$emit('action', 'GO_HOME')"
    @navigate="$emit('navigate', $event)"
  >
    <section class="wrong-book-hero-card">
      <div class="wrong-book-hero-top">
        <div class="wrong-book-hero-copy">
          <span class="wrong-book-eyebrow">系统已整理</span>
          <h2>{{ overview.headline }}</h2>
          <p>{{ overview.summary }}</p>
        </div>
        <div class="wrong-book-hero-icon">
          <BookMarked :size="28" />
        </div>
      </div>

      <div class="wrong-book-stat-grid">
        <div
          v-for="stat in overview.stats"
          :key="stat.label"
          class="wrong-book-stat-card"
        >
          <span>{{ stat.label }}</span>
          <strong>{{ stat.value }}</strong>
        </div>
      </div>
    </section>

    <section class="wrong-book-focus-card">
      <div class="wrong-book-section-head">
        <strong>先练这 3 类</strong>
        <span>按重复次数和考试影响排序</span>
      </div>

      <div class="wrong-book-item-list">
        <button
          v-for="item in priorityItems"
          :key="item.title"
          type="button"
          class="wrong-book-item-card"
          @click="$emit('openDetail', item.key)"
        >
          <div class="wrong-book-item-rank">
            <b>{{ item.rank }}</b>
          </div>

          <div class="wrong-book-item-main">
            <div class="wrong-book-item-head">
              <strong>{{ item.title }}</strong>
              <small>{{ item.value }}</small>
            </div>
            <p>{{ item.meta }}</p>
            <div class="wrong-book-item-bar">
              <span :style="{ width: item.barWidth }" />
            </div>
            <div class="wrong-book-item-link">
              <span>查看这类错题</span>
              <ArrowRight :size="16" />
            </div>
          </div>
        </button>
      </div>
    </section>

    <section class="wrong-book-summary-card">
      <div class="wrong-book-section-head">
        <strong>系统建议</strong>
        <span>先把最容易重复失分的题练熟</span>
      </div>
      <div class="wrong-book-summary-grid">
        <div class="wrong-book-summary-item">
          <span>待巩固错题</span>
          <strong>{{ totalWrongCount }} 道</strong>
        </div>
        <div class="wrong-book-summary-item">
          <span>本次先练</span>
          <strong>{{ priorityItems.length }} 类</strong>
        </div>
        <div class="wrong-book-summary-item wide">
          <span>优先提醒</span>
          <strong>先从“{{ priorityItems[0]?.title }}”开始，最容易再丢分。</strong>
        </div>
      </div>
    </section>

    <button
      type="button"
      class="primary-button wrong-book-primary-button"
      @click="$emit('openPractice', 'wrongBookBundle')"
    >
      {{ overview.actionLabel }}
      <ArrowRight :size="21" />
    </button>
  </PhoneScaffold>
</template>

<script setup lang="ts">
import { ArrowRight, BookMarked } from "lucide-vue-next";
import PhoneScaffold from "../components/PhoneScaffold.vue";
import type { DemoEvent } from "../composables/useDemoFlow";
import { featureOverviews, wrongBookTopics } from "../data/demoData";
import type { WrongBookTopicKey } from "../data/demoData";

const overview = featureOverviews.wrongBook;
const totalWrongCount = 12;

const priorityItems = wrongBookTopics.map((topic, index) => ({
  key: topic.key,
  title: topic.title,
  meta: topic.meta,
  value: `${topic.count} 道`,
  rank: index + 1,
  barWidth: index === 0 ? "100%" : index === 1 ? "76%" : "58%"
}));

defineEmits<{
  action: [DemoEvent];
  navigate: ["home" | "agent" | "learning" | "profile"];
  openDetail: [WrongBookTopicKey];
  openPractice: ["wrongBookBundle"];
}>();
</script>
