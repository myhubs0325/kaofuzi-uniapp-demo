<template>
  <PhoneScaffold
    title="找到失分原因"
    meta="第 1 题"
    content-class="feedback-content wrong-content"
    shell-class="feedback-shell"
    show-back
    :show-nav="false"
    @back="$emit('action', 'GO_HOME')"
  >
    <section class="feedback-hero-card feedback-hero-card-error">
      <div class="feedback-tip-head">
        <strong>先找到失分原因</strong>
        <span>第 1 题</span>
      </div>
      <div class="feedback-hero-top feedback-hero-top-right">
        <div class="feedback-hero-copy">
          <span class="result-eyebrow">{{ flow.wrong.eyebrow }}</span>
          <h2>{{ flow.wrong.title }}</h2>
        </div>
        <div class="result-mark error-mark">
          <X :size="32" />
        </div>
      </div>
      <p>{{ flow.wrong.summary }}</p>
    </section>

    <section class="feedback-tip-card feedback-step-card">
      <div class="feedback-tip-head">
        <strong>先记住这一点</strong>
        <span>关键一步</span>
      </div>
      <div class="feedback-keyline feedback-keyline-error">{{ flow.wrong.keyline }}</div>
      <p class="feedback-elder-note">先练清这一步，再做后面的题会更稳。</p>
    </section>

    <button type="button" class="primary-button feedback-primary-button" @click="$emit('action', 'CONTINUE')">
      {{ flow.wrong.buttonLabel }}
      <ArrowRight :size="21" />
    </button>
  </PhoneScaffold>
</template>

<script setup lang="ts">
import { ArrowRight, X } from "lucide-vue-next";
import { computed } from "vue";
import PhoneScaffold from "../components/PhoneScaffold.vue";
import type { DemoEvent } from "../composables/useDemoFlow";
import { practiceFlows } from "../data/demoData";
import type { PracticeEntryKey } from "../data/demoData";

const props = defineProps<{
  sourceKey: PracticeEntryKey;
}>();

const flow = computed(() => practiceFlows[props.sourceKey]);

defineEmits<{
  action: [DemoEvent];
}>();
</script>
