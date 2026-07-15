<template>
  <PhoneScaffold
    title="检查完成"
    :meta="`${photoCheckData.summary.recognizedCount} 道题`"
    content-class="result-list-content"
    show-back
    active-tab="home"
    @back="$emit('action', 'GO_HOME')"
    @navigate="$emit('navigate', $event)"
  >
    <section class="result-summary">
      <div>
        <strong>发现 {{ photoCheckData.summary.focusCount }} 道需要重点讲解</strong>
        <span>{{ photoCheckData.summary.correctCount }} 道计算正确，已生成对应解析</span>
      </div>
      <AlertCircle :size="26" />
    </section>

    <div
      v-for="question in photoCheckData.questions"
      :key="question.id"
      :class="['question-result-row', question.status]"
    >
      <CheckCircle2 v-if="question.status === 'correct'" :size="22" />
      <XCircle v-else :size="22" />
      <div>
        <strong>第 {{ question.id }} 题 {{ question.expression }}</strong>
        <span>孩子答案：{{ question.studentAnswer }} · 正确答案：{{ question.correctAnswer }}</span>
        <span>{{ question.note }}</span>
      </div>
      <small>{{ question.statusLabel }}</small>
    </div>

    <section
      v-for="question in focusQuestions"
      :key="question.id"
      class="mistake-explanation"
    >
      <div class="section-title-row">
        <div class="explanation-title">
          <Lightbulb :size="21" />
          <strong>{{ question.analysisTitle }}</strong>
        </div>
        <span class="analysis-badge">{{ question.knowledgePoint }}</span>
      </div>
      <p>{{ question.diagnosis }}</p>
      <ol class="explanation-steps">
        <li v-for="step in question.steps" :key="step">{{ step }}</li>
      </ol>
      <div class="explanation-takeaway">
        <strong>记住：</strong>
        <span>{{ question.takeaway }}</span>
      </div>
    </section>

    <button type="button" class="primary-button" @click="$emit('action', 'PRACTICE_MISTAKE')">
      练第 {{ practiceQuestionId }} 题错题
      <ArrowRight :size="21" />
    </button>
  </PhoneScaffold>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  XCircle
} from "lucide-vue-next";
import PhoneScaffold from "../components/PhoneScaffold.vue";
import type { DemoEvent } from "../composables/useDemoFlow";
import { photoCheckData } from "../data/demoData";
import type { PhotoCheckQuestion } from "../data/demoData";

type WrongPhotoCheckQuestion = Extract<PhotoCheckQuestion, { status: "wrong" }>;

const focusQuestions = computed(() =>
  photoCheckData.questions.filter(
    (question): question is WrongPhotoCheckQuestion => question.status === "wrong"
  )
);

const practiceQuestionId = computed(() => focusQuestions.value[0]?.id ?? 1);

defineEmits<{
  action: [DemoEvent];
  navigate: ["home" | "agent" | "learning" | "profile"];
}>();
</script>
