<template>
  <PhoneScaffold
    title="知识点讲解"
    meta="根据小测结果生成"
    content-class="feedback-content review-knowledge-content"
    shell-class="feedback-shell"
    show-back
    :show-nav="false"
    @back="$emit('action', 'SUBMIT_AFTER_CLASS_REVIEW')"
  >
    <div class="question-tools review-knowledge-tools">
      <button
        type="button"
        class="question-tool-button"
        :disabled="!canSpeak"
        @click="toggleSpeak"
      >
        <component :is="isSpeaking ? VolumeX : Volume2" :size="17" />
        {{ isSpeaking ? "停止讲解" : "语音讲解" }}
      </button>
    </div>

    <section class="feedback-hero-card review-knowledge-hero">
      <div class="feedback-tip-head">
        <strong>重点知识点</strong>
        <span>不是讲某一道题</span>
      </div>
      <div class="feedback-hero-copy">
        <span class="result-eyebrow">{{ exam.topic }}</span>
        <h2>{{ explain.title }}</h2>
      </div>
      <p>{{ explain.summary }}</p>
      <div class="feedback-keyline feedback-keyline-warning">
        {{ explain.coreRule }}
      </div>
    </section>

    <section class="feedback-tip-card feedback-step-card">
      <div class="feedback-tip-head">
        <strong>{{ demoData.student.name }}要按这个顺序想</strong>
        <span>先理解，再做题</span>
      </div>
      <div class="feedback-step-list">
        <div v-for="(step, index) in explain.steps" :key="step" class="feedback-step-item">
          <b>{{ index + 1 }}</b>
          <span>{{ step }}</span>
        </div>
      </div>
    </section>

    <section class="feedback-tip-card review-mistake-card">
      <div class="feedback-tip-head">
        <strong>常见错误</strong>
        <span>复习时重点避开</span>
      </div>
      <div class="review-mistake-list">
        <span v-for="mistake in explain.commonMistakes" :key="mistake">{{ mistake }}</span>
      </div>
    </section>

    <section class="feedback-stat-card review-family-card">
      <div class="feedback-stat-head">
        <strong>家长怎么协助</strong>
        <span>不用替孩子算答案</span>
      </div>
      <p>{{ explain.familyGuide }}</p>
      <div class="feedback-keyline">{{ explain.nextAction }}</div>
    </section>

    <button type="button" class="primary-button feedback-primary-button" @click="$emit('action', 'VIEW_PROGRESS')">
      看学习报告
      <ArrowRight :size="21" />
    </button>
  </PhoneScaffold>
</template>

<script setup lang="ts">
import { ArrowRight, Volume2, VolumeX } from "lucide-vue-next";
import { onBeforeUnmount, ref } from "vue";
import PhoneScaffold from "../components/PhoneScaffold.vue";
import type { DemoEvent } from "../composables/useDemoFlow";
import { afterClassReviewExam, demoData } from "../data/demoData";

const exam = afterClassReviewExam;
const explain = afterClassReviewExam.knowledgeExplain;
const isSpeaking = ref(false);
const canSpeak = typeof window !== "undefined" && "speechSynthesis" in window;

const stopSpeaking = () => {
  if (!canSpeak) return;
  window.speechSynthesis.cancel();
  isSpeaking.value = false;
};

const buildSpeechText = () => {
  const steps = explain.steps.map((step, index) => `第${index + 1}步，${step}`).join("。");
  const mistakes = explain.commonMistakes.map((mistake, index) => `常见错误${index + 1}，${mistake}`).join("。");
  return [
    `知识点讲解。${exam.topic}。${explain.title}。`,
    explain.summary,
    `核心规则。${explain.coreRule}。`,
    `按这个顺序理解。${steps}。`,
    `复习时重点避开这些错误。${mistakes}。`,
    `家长协助建议。${explain.familyGuide}。`,
    `下一步。${explain.nextAction}。`
  ].join("");
};

const toggleSpeak = () => {
  if (!canSpeak) return;
  if (isSpeaking.value) {
    stopSpeaking();
    return;
  }

  stopSpeaking();
  const utterance = new SpeechSynthesisUtterance(buildSpeechText());
  utterance.lang = "zh-CN";
  utterance.rate = 0.94;
  utterance.pitch = 1;
  utterance.onend = () => {
    isSpeaking.value = false;
  };
  utterance.onerror = () => {
    isSpeaking.value = false;
  };
  isSpeaking.value = true;
  window.speechSynthesis.speak(utterance);
};

onBeforeUnmount(stopSpeaking);

defineEmits<{
  action: [DemoEvent];
}>();
</script>
