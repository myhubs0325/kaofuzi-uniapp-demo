<template>
  <PhoneScaffold
    title="拍照检查"
    :meta="pageMeta"
    content-class="photo-sim-content"
    show-back
    active-tab="home"
    @back="handleBack"
    @navigate="emit('navigate', $event)"
  >
    <section class="photo-flow-strip">
      <span class="photo-flow-track" />
      <span class="photo-flow-fill" :style="{ width: progressWidth }" />
      <span
        v-for="step in flowSteps"
        :key="step.key"
        :class="[
          'photo-flow-node',
          {
            active: currentStep === step.key,
            done: step.order < currentStepOrder
          }
        ]"
      >
        <i class="photo-flow-dot" />
        <small>{{ step.label }}</small>
      </span>
    </section>

    <section class="camera-stage photo-live-stage" :data-step="currentStep">
      <div class="scan-corner corner-a" />
      <div class="scan-corner corner-b" />
      <div class="scan-corner corner-c" />
      <div class="scan-corner corner-d" />

      <div class="photo-live-banner" :class="currentStep">
        {{ bannerText }}
      </div>

      <div class="paper-preview photo-live-paper">
        <button
          v-for="question in photoCheckData.questions"
          :key="question.id"
          type="button"
          :class="[
            'paper-preview-row',
            'paper-preview-row-action',
            question.status,
            { active: currentStep === 'result' && selectedQuestionId === question.id }
          ]"
          @click="selectQuestion(question.id)"
        >
          <strong>第 {{ question.id }} 题</strong>
          <span>{{ question.expression }}</span>
          <small>孩子答案：{{ question.studentAnswer }}</small>
        </button>

        <button
          v-if="currentStep === 'result'"
          v-for="marker in questionMarkers"
          :key="marker.id"
          type="button"
          :class="['paper-marker', marker.tone, { active: selectedQuestionId === marker.id }]"
          :style="{ top: marker.top, left: marker.left }"
          @click="selectQuestion(marker.id)"
        >
          {{ marker.id }}
        </button>
      </div>

      <div v-if="currentStep === 'recognizing'" class="photo-recognizing-overlay">
        <ScanLine :size="34" />
        <span class="photo-recognizing-beam" />
        <div class="photo-recognizing-copy">
          <strong>正在识别并检查</strong>
          <span>已识别 3 道题，正在生成错题解析</span>
        </div>
      </div>

      <div v-if="currentStep === 'result'" class="photo-floating-result">
        <strong>发现 1 道错题</strong>
        <span>其余 2 道已批改正确</span>
      </div>
    </section>

    <section v-if="currentStep === 'capture'" class="photo-surface-card photo-intro-card">
      <h2>把题目和孩子答案拍清楚</h2>
      <p>支持整页拍照，自动识别题目、检查答案。</p>
      <div class="photo-tip-row">
        <span>题目拍全</span>
        <span>字迹清晰</span>
        <span>避开反光</span>
      </div>
    </section>

    <section v-else-if="currentStep === 'recognizing'" class="photo-surface-card photo-status-card">
      <strong>正在识别并检查</strong>
      <p>请稍等，正在提取题目和答案，稍后给出错题解析。</p>
      <div class="analysis-steps">
        <span class="done">
          <CheckCircle2 :size="18" />
          图片清晰
        </span>
        <span class="done">
          <CheckCircle2 :size="18" />
          已识别 3 道题
        </span>
        <span>
          <ScanLine :size="18" />
          正在生成解析
        </span>
      </div>
    </section>

    <template v-else>
      <section class="photo-surface-card photo-result-list-card">
        <div class="photo-section-head">
          <strong>检查结果</strong>
          <span>点击题目查看解析</span>
        </div>

        <div class="photo-question-list">
          <button
            v-for="question in photoCheckData.questions"
            :key="question.id"
            type="button"
            :class="[
              'photo-question-card',
              question.status,
              { active: selectedQuestionId === question.id }
            ]"
            @click="selectQuestion(question.id)"
          >
            <div class="photo-question-topline">
              <strong>第 {{ question.id }} 题</strong>
              <span>{{ question.status === "wrong" ? "有问题" : "正确" }}</span>
            </div>
            <h4>{{ question.expression }}</h4>
            <p>孩子答案：{{ question.studentAnswer }} · 正确答案：{{ question.correctAnswer }}</p>
            <small>{{ question.note }}</small>
          </button>
        </div>
      </section>

      <section class="photo-surface-card photo-analysis-panel">
        <div class="photo-section-head">
          <strong v-if="selectedQuestion.status === 'wrong'">第 {{ selectedQuestion.id }} 题解析</strong>
          <strong v-else>第 {{ selectedQuestion.id }} 题反馈</strong>
          <span>{{ selectedQuestion.status === "wrong" ? "错题讲解" : "本题检查通过" }}</span>
        </div>

        <template v-if="selectedQuestion.status === 'wrong'">
          <div class="photo-analysis-highlight">
            <Lightbulb :size="22" />
            <div>
              <strong>{{ selectedQuestion.analysisTitle }}</strong>
              <p>{{ selectedQuestion.diagnosis }}</p>
            </div>
          </div>

          <ol class="photo-analysis-steps">
            <li v-for="step in selectedQuestion.steps" :key="step">
              {{ step }}
            </li>
          </ol>

          <div class="photo-analysis-footer">
            <span class="analysis-badge">{{ selectedQuestion.knowledgePoint }}</span>
            <p><strong>记住：</strong>{{ selectedQuestion.takeaway }}</p>
          </div>
        </template>

        <template v-else>
          <div class="photo-analysis-success">
            <CheckCircle2 :size="22" />
            <div>
              <strong>这题检查通过</strong>
              <p>{{ selectedQuestion.note }}</p>
            </div>
          </div>
        </template>
      </section>
    </template>

    <div class="photo-page-actions">
      <button
        v-if="currentStep === 'capture'"
        type="button"
        class="primary-button"
        @click="startCheck"
      >
        <ImagePlus :size="20" />
        拍照检查
      </button>

      <button
        v-else-if="currentStep === 'recognizing'"
        type="button"
        class="primary-button"
        disabled
      >
        <ScanLine :size="20" />
        正在识别...
      </button>

      <button
        v-else
        type="button"
        class="primary-button"
        @click="emit('action', 'PRACTICE_MISTAKE')"
      >
        练这道错题
      </button>

      <button type="button" class="photo-secondary-button" @click="handleSecondaryAction">
        {{ secondaryActionLabel }}
      </button>
    </div>
  </PhoneScaffold>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import { CheckCircle2, ImagePlus, Lightbulb, ScanLine } from "lucide-vue-next";
import PhoneScaffold from "../components/PhoneScaffold.vue";
import type { DemoEvent } from "../composables/useDemoFlow";
import { photoCheckData } from "../data/demoData";

type PhotoStep = "capture" | "recognizing" | "result";

const emit = defineEmits<{
  action: [DemoEvent];
  navigate: ["home" | "agent" | "learning" | "profile"];
}>();

const flowSteps = [
  { key: "capture", label: "拍照", order: 1 },
  { key: "recognizing", label: "识别", order: 2 },
  { key: "result", label: "结果", order: 3 }
] as const satisfies Array<{
  key: PhotoStep;
  label: string;
  order: number;
}>;

const questionMarkers = [
  { id: 1, top: "56px", left: "194px", tone: "correct" },
  { id: 2, top: "122px", left: "207px", tone: "wrong" },
  { id: 3, top: "189px", left: "188px", tone: "correct" }
] as const;

const currentStep = ref<PhotoStep>("capture");
const defaultQuestionId =
  photoCheckData.questions.find((question) => question.status === "wrong")?.id ??
  photoCheckData.questions[0].id;
const selectedQuestionId = ref(defaultQuestionId);

let resultTimer: number | null = null;

const clearResultTimer = () => {
  if (resultTimer !== null) {
    window.clearTimeout(resultTimer);
    resultTimer = null;
  }
};

const currentStepOrder = computed(
  () => flowSteps.find((step) => step.key === currentStep.value)?.order ?? 1
);

const progressWidth = computed(() => {
  const maxIndex = flowSteps.length - 1;
  const currentIndex = Math.max(0, currentStepOrder.value - 1);
  if (maxIndex <= 0) return "0%";
  return `${(currentIndex / maxIndex) * 100}%`;
});

const pageMeta = computed(() => {
  if (currentStep.value === "capture") return "检查作业";
  if (currentStep.value === "recognizing") return "正在识别";
  return "检查完成";
});

const bannerText = computed(() => {
  if (currentStep.value === "capture") return "把题目和答案拍清楚";
  if (currentStep.value === "recognizing") return "正在识别题目和孩子答案";
  return "已找出需要重点讲解的题目";
});

const selectedQuestion = computed(
  () => photoCheckData.questions.find((question) => question.id === selectedQuestionId.value) ?? photoCheckData.questions[0]
);

const secondaryActionLabel = computed(() => {
  if (currentStep.value === "capture") return "返回首页";
  return "重新拍照";
});

const startCheck = () => {
  clearResultTimer();
  currentStep.value = "recognizing";
  resultTimer = window.setTimeout(() => {
    currentStep.value = "result";
    resultTimer = null;
  }, 1400);
};

const resetFlow = () => {
  clearResultTimer();
  currentStep.value = "capture";
  selectedQuestionId.value = defaultQuestionId;
};

const handleBack = () => {
  if (currentStep.value === "capture") {
    emit("action", "GO_HOME");
    return;
  }
  resetFlow();
};

const handleSecondaryAction = () => {
  if (currentStep.value === "capture") {
    emit("action", "GO_HOME");
    return;
  }
  resetFlow();
};

const selectQuestion = (questionId: number) => {
  if (currentStep.value !== "result") return;
  selectedQuestionId.value = questionId;
};

onBeforeUnmount(clearResultTimer);
</script>
