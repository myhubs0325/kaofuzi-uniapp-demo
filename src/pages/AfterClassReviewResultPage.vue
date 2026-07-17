<template>
  <PhoneScaffold
    title="复习结果"
    meta="提交后统一分析"
    content-class="feedback-content review-result-content"
    shell-class="feedback-shell"
    show-back
    :show-nav="false"
    @back="$emit('action', 'OPEN_AFTER_CLASS_REVIEW')"
  >
    <section class="feedback-hero-card review-result-hero">
      <div class="feedback-tip-head">
        <strong>{{ demoData.student.name }}本次课后复习</strong>
        <span>像小测一样先做完，再复盘</span>
      </div>
      <div class="review-score-board">
        <div>
          <small>本次正确</small>
          <strong>{{ correctCount }} / {{ exam.questions.length }}</strong>
        </div>
        <div>
          <small>主要薄弱点</small>
          <strong>{{ exam.weakPoints.length }} 个</strong>
        </div>
      </div>
      <p>
        系统没有在答题中途纠正，而是在提交后根据对错集中判断：
        {{ demoData.student.name }}基础题能做对，主要卡在“连续退位遇到 0 时怎么借位”。
      </p>
    </section>

    <section class="feedback-stat-card review-question-card">
      <div class="feedback-stat-head">
        <strong>答题明细</strong>
        <span>先看结果，再找原因</span>
      </div>
      <div class="review-question-list">
        <article
          v-for="question in exam.questions"
          :key="question.id"
          :class="['review-question-item', { wrong: question.studentAnswer !== question.correctAnswer }]"
        >
          <b>{{ question.id }}</b>
          <div>
            <strong>{{ question.prompt }}</strong>
            <span>
              {{ demoData.student.name }}选：{{ question.studentAnswer }} · 正确：{{ question.correctAnswer }}
            </span>
            <small>对应知识点：{{ question.knowledgePoint }}</small>
          </div>
        </article>
      </div>
    </section>

    <section class="feedback-tip-card review-weak-card">
      <div class="feedback-tip-head">
        <strong>系统找到的不懂点</strong>
        <span>不是讲题，是讲知识点</span>
      </div>
      <div class="review-weak-list">
        <article v-for="point in exam.weakPoints" :key="point.title" class="review-weak-item">
          <div>
            <strong>{{ point.title }}</strong>
            <span>{{ point.level }}</span>
          </div>
          <p>{{ point.evidence }}</p>
          <small>{{ point.parentText }}</small>
        </article>
      </div>
    </section>

    <button
      type="button"
      class="primary-button feedback-primary-button"
      @click="$emit('action', 'OPEN_AFTER_CLASS_KNOWLEDGE')"
    >
      看知识点讲解
      <ArrowRight :size="21" />
    </button>
  </PhoneScaffold>
</template>

<script setup lang="ts">
import { ArrowRight } from "lucide-vue-next";
import { computed } from "vue";
import PhoneScaffold from "../components/PhoneScaffold.vue";
import type { DemoEvent } from "../composables/useDemoFlow";
import { afterClassReviewExam, demoData } from "../data/demoData";

const exam = afterClassReviewExam;
const correctCount = computed(
  () => exam.questions.filter((question) => question.studentAnswer === question.correctAnswer).length
);

defineEmits<{
  action: [DemoEvent];
}>();
</script>
