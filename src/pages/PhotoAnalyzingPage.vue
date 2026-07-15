<template>
  <PhoneScaffold
    title="正在检查"
    meta="请稍等"
    content-class="analyzing-content"
    :show-nav="false"
  >
    <div class="analysis-visual">
      <ScanLine :size="48" />
      <span class="scan-beam" />
    </div>
    <h2>正在识别题目并检查答案</h2>
    <p>已识别 {{ photoCheckData.summary.recognizedCount }} 道题，正在定位问题并整理对应解析。</p>
    <div class="analysis-steps">
      <span class="done">
        <CheckCircle2 :size="18" />
        图片清晰可识别
      </span>
      <span class="done">
        <CheckCircle2 :size="18" />
        已识别 {{ photoCheckData.summary.recognizedCount }} 道题和孩子答案
      </span>
      <span class="done">
        <CheckCircle2 :size="18" />
        已定位 {{ photoCheckData.summary.focusCount }} 道需要重点讲解的题
      </span>
      <span>
        <ScanLine :size="18" />
        正在生成对应解析
      </span>
    </div>
  </PhoneScaffold>
</template>

<script setup lang="ts">
import { CheckCircle2, ScanLine } from "lucide-vue-next";
import PhoneScaffold from "../components/PhoneScaffold.vue";
import { photoCheckData } from "../data/demoData";
</script>
