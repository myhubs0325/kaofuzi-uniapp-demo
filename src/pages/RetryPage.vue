<template>
  <PhoneScaffold
    :title="retryConfig.pageTitle"
    :meta="retryConfig.pageMeta"
    content-class="feedback-content retry-content"
    shell-class="feedback-shell"
    show-back
    :show-nav="false"
    @back="$emit('action', 'GO_HOME')"
  >
    <section class="feedback-hero-card feedback-hero-card-warning feedback-hero-card-plain">
      <div class="feedback-tip-head">
        <strong>{{ retryConfig.cardTitle }}</strong>
        <span>{{ retryConfig.pageMeta }}</span>
      </div>
      <div class="feedback-keyline feedback-keyline-warning">
        {{ retryConfig.keyline }}
      </div>
      <p>{{ retryConfig.explanation }}</p>
    </section>
    <section class="feedback-tip-card feedback-step-card">
      <div class="feedback-tip-head">
        <strong>重新做题时这样想</strong>
        <span>按顺序来</span>
      </div>
      <div class="feedback-step-list">
        <div v-for="(step, index) in retryConfig.steps" :key="step" class="feedback-step-item">
          <b>{{ index + 1 }}</b>
          <span>{{ step }}</span>
        </div>
      </div>
      <p class="feedback-elder-note">先按顺序想一遍，再试一次就行。</p>
    </section>
    <button type="button" class="primary-button feedback-primary-button" @click="$emit('action', 'TRY_AGAIN')">
      再试一次
      <ArrowRight :size="21" />
    </button>
  </PhoneScaffold>
</template>

<script setup lang="ts">
import { ArrowRight } from "lucide-vue-next";
import { computed } from "vue";
import PhoneScaffold from "../components/PhoneScaffold.vue";
import type { DemoEvent } from "../composables/useDemoFlow";
import { practiceFlows } from "../data/demoData";
import type { PracticeEntryKey } from "../data/demoData";

const props = defineProps<{
  mode: "bridgeRetry" | "confirmRetry";
  sourceKey: PracticeEntryKey;
}>();

const isBridge = computed(() => props.mode === "bridgeRetry");
const flow = computed(() => practiceFlows[props.sourceKey]);
const retryConfig = computed(() => (isBridge.value ? flow.value.bridgeRetry : flow.value.confirmRetry));

defineEmits<{
  action: [DemoEvent];
}>();
</script>
