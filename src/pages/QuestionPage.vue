<template>
  <PhoneScaffold
    :title="screen.title"
    :meta="screen.progress"
    content-class="question-content question-flow-content"
    shell-class="question-flow-shell"
    show-back
    :show-nav="false"
    @back="$emit('action', 'GO_HOME')"
  >
    <div class="progress-track" :aria-label="`练习进度 ${screen.progress}`">
      <span :style="{ width: progressWidth }" />
    </div>
    <span class="knowledge-label">{{ flow.taskTitle }}</span>
    <div class="question-tools">
      <button
        type="button"
        class="question-tool-button"
        :disabled="!canSpeak"
        @click="toggleSpeak"
      >
        <component :is="isSpeaking ? VolumeX : Volume2" :size="17" />
        {{ isSpeaking ? "停止朗读" : "朗读题目" }}
      </button>
      <button
        type="button"
        class="question-tool-button"
        @click="downloadPracticeSheet"
      >
        <Download :size="17" />
        下载试题
      </button>
    </div>
    <section :class="['question-area', { 'question-area-long': isLongQuestion }]">
      <span class="question-hint">{{ screen.hint }}</span>
      <strong :class="['math-expression', { 'math-expression-long': isLongQuestion }]">
        {{ screen.expression }}
      </strong>
    </section>
    <div class="answer-list">
      <button
        v-for="answer in screen.answers"
        :key="answer.label"
        type="button"
        @click="$emit('action', answer.correct ? 'ANSWER_CORRECT' : 'ANSWER_WRONG')"
      >
        {{ answer.label }}
      </button>
    </div>
    <p class="quiet-help">
      <CircleHelp :size="18" />
      不确定也可以先选，考夫子会根据答案安排下一步
    </p>
  </PhoneScaffold>
</template>

<script setup lang="ts">
import { CircleHelp, Download, Volume2, VolumeX } from "lucide-vue-next";
import { computed, onBeforeUnmount, ref, watch } from "vue";
import PhoneScaffold from "../components/PhoneScaffold.vue";
import { practiceEntryScenarios, practiceFlows } from "../data/demoData";
import type { DemoEvent } from "../composables/useDemoFlow";
import type { PracticeEntryKey } from "../data/demoData";

const props = defineProps<{
  mode: "practice" | "bridge" | "confirm";
  sourceKey: PracticeEntryKey;
}>();

const flow = computed(() => practiceFlows[props.sourceKey]);
const screen = computed(() => flow.value[props.mode]);

const progressWidth = computed(() => {
  if (props.mode === "practice") return "24%";
  if (props.mode === "bridge") return "52%";
  return "72%";
});

const scenario = computed(() => practiceEntryScenarios[props.sourceKey]);
const isSpeaking = ref(false);
const canSpeak = typeof window !== "undefined" && "speechSynthesis" in window;

const isLongQuestion = computed(() => {
  const expression = screen.value.expression;
  return expression.length > 18 || /[，。；：？“”]/.test(expression);
});

const stopSpeaking = () => {
  if (!canSpeak) return;
  window.speechSynthesis.cancel();
  isSpeaking.value = false;
};

const buildSpeechText = () => {
  const answers = screen.value.answers.map((answer, index) => `选项${index + 1}，${answer.label}`).join("。");
  return `${flow.value.taskTitle}。${screen.value.title}。${screen.value.hint}。题目：${screen.value.expression}。${answers}。`;
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
  utterance.rate = 0.95;
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

const buildPracticeSheetText = () => {
  const screens = [flow.value.practice, flow.value.bridge, flow.value.confirm];
  const questionText = screens
    .map((item, index) => {
      const options = item.answers.map((answer, answerIndex) => `${answerIndex + 1}. ${answer.label}`).join(" / ");
      return `${index + 1}. ${item.expression}\n提示：${item.hint}\n选项：${options}`;
    })
    .join("\n\n");

  return [
    `题目来源：${scenario.value.meta}`,
    `本次巩固：${scenario.value.headline}`,
    `知识点：${flow.value.taskTitle}`,
    `题目数量：${scenario.value.totalQuestionCount} 题`,
    "",
    questionText
  ].join("\n");
};

const downloadPracticeSheet = () => {
  const text = buildPracticeSheetText();
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `practice-${props.sourceKey}.txt`;
  link.click();
  URL.revokeObjectURL(url);
};

watch(() => [props.mode, props.sourceKey], stopSpeaking);
onBeforeUnmount(stopSpeaking);

defineEmits<{
  action: [DemoEvent];
}>();
</script>
