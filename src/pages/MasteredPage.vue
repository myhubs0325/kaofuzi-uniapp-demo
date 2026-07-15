<template>
  <PhoneScaffold
    title="练习完成"
    meta="今天 8 分钟"
    content-class="feedback-content mastered-content"
    shell-class="feedback-shell"
    show-back
    :show-nav="false"
    @back="$emit('action', 'GO_HOME')"
  >
    <section class="feedback-hero-card feedback-hero-card-success feedback-mastered-card">
      <div class="feedback-tip-head">
        <strong>练习完成</strong>
        <span>已掌握</span>
      </div>
      <div class="feedback-hero-top feedback-mastered-top feedback-hero-top-right">
        <div class="feedback-hero-copy">
          <span class="result-eyebrow">{{ flow.mastered.eyebrow }}</span>
          <h2>{{ flow.mastered.title }}</h2>
        </div>
        <div class="result-mark success-mark">
          <Check :size="34" />
        </div>
      </div>
      <p>{{ flow.mastered.summary }}</p>
      <div class="feedback-mastered-strip">
        <span>{{ flow.mastered.completedSummary }}</span>
        <strong>{{ flow.mastered.diagnosis }}</strong>
      </div>
    </section>

    <section class="feedback-stat-card feedback-progress-card">
      <div class="feedback-stat-head">
        <strong>系统分析结果</strong>
        <span>错题提升数据</span>
      </div>
      <div class="feedback-data-hero">
        <div class="feedback-data-hero-main">
          <small>错题正确率提升</small>
          <strong>+{{ accuracyDelta }}%</strong>
          <span>{{ flow.mastered.previousAccuracy }}% 提升到 {{ flow.mastered.currentAccuracy }}%</span>
        </div>
        <div class="feedback-data-hero-side">
          <span>系统判断</span>
          <strong>{{ flow.mastered.diagnosis }}</strong>
        </div>
      </div>
      <div class="feedback-progress-panel">
        <div class="feedback-progress-intro">
          <span>错题正确率对比</span>
          <strong>{{ flow.mastered.previousAccuracy }}% → {{ flow.mastered.currentAccuracy }}%</strong>
        </div>
        <div class="feedback-compare-bars">
          <div class="feedback-compare-row">
            <div class="feedback-compare-label">
              <span>练习前</span>
              <strong>{{ flow.mastered.previousAccuracy }}%</strong>
            </div>
            <div class="feedback-compare-track">
              <span class="before" :style="{ width: `${flow.mastered.previousAccuracy}%` }" />
            </div>
          </div>
          <div class="feedback-compare-row">
            <div class="feedback-compare-label">
              <span>现在</span>
              <strong>{{ flow.mastered.currentAccuracy }}%</strong>
            </div>
            <div class="feedback-compare-track">
              <span class="after" :style="{ width: `${flow.mastered.currentAccuracy}%` }" />
            </div>
          </div>
        </div>
      </div>
      <div class="feedback-analysis-grid feedback-analysis-grid-data">
        <div class="feedback-analysis-item">
          <small>完成练习</small>
          <strong>{{ scenario.totalQuestionCount }} 题</strong>
        </div>
        <div class="feedback-analysis-item">
          <small>稳定知识点</small>
          <strong>{{ flow.mastered.closedKnowledgePoints }} 个</strong>
        </div>
        <div class="feedback-analysis-item wide">
          <small>已修正失分点</small>
          <strong>{{ flow.mastered.fixedWeakness }}</strong>
        </div>
      </div>
      <p class="feedback-elder-note">{{ flow.mastered.suggestion }}</p>
    </section>

    <button type="button" class="primary-button feedback-primary-button" @click="$emit('action', 'VIEW_PROGRESS')">
      看看本周进步
      <ArrowRight :size="21" />
    </button>
  </PhoneScaffold>
</template>

<script setup lang="ts">
import { ArrowRight, Check } from "lucide-vue-next";
import { computed } from "vue";
import PhoneScaffold from "../components/PhoneScaffold.vue";
import { practiceEntryScenarios, practiceFlows } from "../data/demoData";
import type { DemoEvent } from "../composables/useDemoFlow";
import type { PracticeEntryKey } from "../data/demoData";

const props = defineProps<{
  sourceKey: PracticeEntryKey;
}>();

const flow = computed(() => practiceFlows[props.sourceKey]);
const scenario = computed(() => practiceEntryScenarios[props.sourceKey]);
const accuracyDelta = computed(() => flow.value.mastered.currentAccuracy - flow.value.mastered.previousAccuracy);

defineEmits<{
  action: [DemoEvent];
}>();
</script>
