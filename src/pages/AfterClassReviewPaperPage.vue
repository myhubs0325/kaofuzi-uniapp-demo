<template>
  <PhoneScaffold
    title="课后复习"
    :meta="`${currentIndex + 1} / ${exam.questions.length}`"
    content-class="question-content question-flow-content review-paper-content"
    shell-class="question-flow-shell"
    show-back
    :show-nav="false"
    @back="$emit('action', 'OPEN_AFTER_CLASS_REVIEW')"
  >
    <div class="progress-track" :aria-label="`课后复习进度 ${currentIndex + 1} / ${exam.questions.length}`">
      <span :style="{ width: progressWidth }" />
    </div>

    <section class="review-paper-rule">
      <strong>{{ exam.title }}</strong>
      <span>{{ exam.rule }}</span>
    </section>

    <section :class="['question-area', { 'question-area-long': isLongQuestion }]">
      <span class="question-hint">{{ currentQuestion.type }} · {{ currentQuestion.hint }}</span>
      <strong :class="['math-expression', { 'math-expression-long': isLongQuestion }]">
        {{ currentQuestion.prompt }}
      </strong>
    </section>

    <div class="answer-list review-paper-answer-list">
      <button
        v-for="answer in currentQuestion.options"
        :key="answer"
        type="button"
        :class="{ selected: selectedAnswers[currentIndex] === answer }"
        @click="selectAnswer(answer)"
      >
        {{ answer }}
      </button>
    </div>

    <div class="review-paper-actions">
      <button
        type="button"
        class="account-secondary-button"
        :disabled="currentIndex === 0"
        @click="currentIndex -= 1"
      >
        上一题
      </button>
      <button
        v-if="!isLastQuestion"
        type="button"
        class="primary-button feedback-primary-button"
        @click="currentIndex += 1"
      >
        下一题
        <ArrowRight :size="20" />
      </button>
      <button
        v-else
        type="button"
        class="primary-button feedback-primary-button"
        @click="$emit('action', 'SUBMIT_AFTER_CLASS_REVIEW')"
      >
        提交小测
        <ArrowRight :size="20" />
      </button>
    </div>

    <p class="quiet-help">
      <CircleHelp :size="18" />
      答题中不提示对错，提交后系统再统一分析张小雨卡在哪些知识点。
    </p>
  </PhoneScaffold>
</template>

<script setup lang="ts">
import { ArrowRight, CircleHelp } from "lucide-vue-next";
import { computed, ref } from "vue";
import PhoneScaffold from "../components/PhoneScaffold.vue";
import type { DemoEvent } from "../composables/useDemoFlow";
import { afterClassReviewExam } from "../data/demoData";

const exam = afterClassReviewExam;
const currentIndex = ref(0);
const selectedAnswers = ref<string[]>(exam.questions.map((question) => question.studentAnswer));

const currentQuestion = computed(() => exam.questions[currentIndex.value]);
const isLastQuestion = computed(() => currentIndex.value === exam.questions.length - 1);
const progressWidth = computed(() => `${((currentIndex.value + 1) / exam.questions.length) * 100}%`);
const isLongQuestion = computed(() => currentQuestion.value.prompt.length > 18);

const selectAnswer = (answer: string) => {
  selectedAnswers.value[currentIndex.value] = answer;
};

defineEmits<{
  action: [DemoEvent];
}>();
</script>
