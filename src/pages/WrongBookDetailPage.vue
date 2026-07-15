<template>
  <PhoneScaffold
    title="错题详情"
    :meta="`${topic.count} 道题`"
    content-class="wrong-book-detail-content"
    shell-class="wrong-book-shell"
    show-back
    show-nav
    active-tab="home"
    @back="$emit('action', 'BACK_TO_WRONG_BOOK')"
    @navigate="$emit('navigate', $event)"
  >
    <section class="wrong-book-detail-hero">
      <div class="wrong-book-hero-top">
        <div class="wrong-book-hero-copy">
          <span class="wrong-book-eyebrow">系统已定位</span>
          <h2>{{ topic.title }}</h2>
          <p>{{ topic.summary }}</p>
        </div>
        <div class="wrong-book-hero-icon">
          <component :is="topicIcon" :size="28" />
        </div>
      </div>

      <div class="wrong-book-detail-stat-grid">
        <div class="wrong-book-stat-card">
          <span>本类错题</span>
          <strong>{{ topic.count }} 道</strong>
        </div>
        <div class="wrong-book-stat-card">
          <span>主要来源</span>
          <strong>{{ topic.meta }}</strong>
        </div>
      </div>

      <div class="wrong-book-detail-note">
        <span>主要失分点</span>
        <strong>{{ topic.commonMistake }}</strong>
        <p>{{ topic.practiceGoal }}</p>
      </div>
    </section>

    <section class="wrong-book-focus-card wrong-book-detail-list-card">
      <div class="wrong-book-section-head">
        <strong>这类错题明细</strong>
        <span>按题目逐条整理</span>
      </div>

      <div class="wrong-book-detail-list">
        <article
          v-for="question in topic.questions"
          :key="question.id"
          class="wrong-book-detail-card"
        >
          <div class="wrong-book-detail-head">
            <strong>第 {{ question.id }} 题</strong>
            <small>{{ question.source }}</small>
          </div>
          <p class="wrong-book-detail-prompt">{{ question.prompt }}</p>
          <div class="wrong-book-detail-answer-grid">
            <div>
              <span>孩子当时答案</span>
              <strong>{{ question.studentAnswer }}</strong>
            </div>
            <div>
              <span>正确答案</span>
              <strong>{{ question.correctAnswer }}</strong>
            </div>
          </div>
          <div class="wrong-book-detail-reason">
            <span>错因</span>
            <p>{{ question.reason }}</p>
          </div>
        </article>
      </div>
    </section>

    <button
      type="button"
      class="primary-button wrong-book-primary-button"
      @click="$emit('openPractice', practiceSourceKey)"
    >
      开始巩固这 {{ topic.count }} 道题
      <ArrowRight :size="21" />
    </button>
  </PhoneScaffold>
</template>

<script setup lang="ts">
import { ArrowRight, BookMarked, MessageSquareText, PenTool } from "lucide-vue-next";
import { computed } from "vue";
import PhoneScaffold from "../components/PhoneScaffold.vue";
import type { DemoEvent } from "../composables/useDemoFlow";
import { wrongBookTopics } from "../data/demoData";
import type { WrongBookTopicKey } from "../data/demoData";

const props = defineProps<{
  topicKey: WrongBookTopicKey;
}>();

const topic = computed(
  () => wrongBookTopics.find((item) => item.key === props.topicKey) ?? wrongBookTopics[0]
);

const topicIcon = computed(() => {
  if (props.topicKey === "borrowSubtraction") return BookMarked;
  if (props.topicKey === "wordProblemReading") return MessageSquareText;
  return PenTool;
});

const practiceSourceKey = computed(() => {
  if (props.topicKey === "borrowSubtraction") return "wrongBorrowSubtraction" as const;
  if (props.topicKey === "wordProblemReading") return "wrongWordProblemReading" as const;
  return "wrongMultiplicationVertical" as const;
});

defineEmits<{
  action: [DemoEvent];
  navigate: ["home" | "agent" | "learning" | "profile"];
  openPractice: ["wrongBorrowSubtraction" | "wrongWordProblemReading" | "wrongMultiplicationVertical"];
}>();
</script>
