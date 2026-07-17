<template>
  <PhoneScaffold
    title="课后复习"
    meta="先完整做完，再统一复盘"
    content-class="simple-review-content"
    shell-class="simple-review-shell"
    show-back
    :show-nav="false"
    @back="$emit('back')"
  >
    <section class="simple-start-card">
      <div class="simple-card-head">
        <div>
          <span class="simple-kicker simple-kicker-green">第一步</span>
          <h2>先选科目和课题</h2>
          <p>先把今天要复习的内容选好。进入后像小测一样完整答题，中途不提示对错。</p>
        </div>
      </div>

      <div class="simple-picker-card">
        <small>科目选择</small>
        <button type="button" class="simple-topic-button" @click="subjectSheetOpen = true">
          <div>
            <strong>{{ selectedSubject }}</strong>
            <p>点这里选择科目</p>
          </div>
          <ChevronRight :size="18" />
        </button>
      </div>

      <div class="simple-picker-card">
        <small>课题选择</small>
        <button type="button" class="simple-topic-button" @click="topicSheetOpen = true">
          <div>
            <strong>{{ selectedTopic.label }}</strong>
            <p>{{ selectedTopic.meta }}</p>
          </div>
          <ChevronRight :size="18" />
        </button>
      </div>

      <button
        type="button"
        class="primary-button simple-primary-button simple-primary-button-green"
        @click="$emit('start')"
      >
        开始复习小测
        <ArrowRight :size="21" />
      </button>
    </section>

    <section class="simple-flow-card">
      <div class="simple-section-head">
        <strong>会这样进行</strong>
        <span>跟着点就行</span>
      </div>

      <div class="simple-flow-list">
        <article class="simple-flow-item">
          <b class="simple-rank simple-rank-green">1</b>
          <div>
            <strong>先完整答题</strong>
            <p>答题过程中不纠正、不讲解，先看孩子能不能独立做完。</p>
          </div>
        </article>
        <article class="simple-flow-item">
          <b class="simple-rank simple-rank-green">2</b>
          <div>
            <strong>提交后统一判定</strong>
            <p>做完后再看对错、用时和出错类型，像考试后复盘一样。</p>
          </div>
        </article>
        <article class="simple-flow-item">
          <b class="simple-rank simple-rank-green">3</b>
          <div>
            <strong>反推出薄弱知识点</strong>
            <p>不是只看哪道题错，而是找到{{ demoData.student.name }}到底卡在哪个知识点。</p>
          </div>
        </article>
        <article class="simple-flow-item">
          <b class="simple-rank simple-rank-green">4</b>
          <div>
            <strong>再讲知识点</strong>
            <p>后面以知识点讲解为主，再安排同类题确认是否真正理解。</p>
          </div>
        </article>
      </div>
    </section>

    <MobileSelectSheet
      :open="subjectSheetOpen"
      title="选择科目"
      :options="subjectOptions"
      :selected-value="selectedSubject"
      @close="subjectSheetOpen = false"
      @select="selectSubject"
    />

    <MobileSelectSheet
      :open="topicSheetOpen"
      title="选择课题"
      :options="currentTopicOptions"
      :selected-value="selectedTopic.label"
      @close="topicSheetOpen = false"
      @select="selectTopic"
    />
  </PhoneScaffold>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { ArrowRight, ChevronRight } from "lucide-vue-next";
import MobileSelectSheet from "../components/MobileSelectSheet.vue";
import PhoneScaffold from "../components/PhoneScaffold.vue";
import { demoData } from "../data/demoData";

defineEmits<{
  back: [];
  start: [];
}>();

const subjectOptions = [
  { label: "数学", meta: "已开通知识巩固" },
  { label: "语文", meta: "已开通知识巩固" },
  { label: "英语", meta: "已开通知识巩固" }
];

const topicOptions: Record<string, { label: string; meta: string }[]> = {
  数学: [
    { label: "分数的初步认识", meta: "二年级上册 · 第四单元" },
    { label: "平均分与图形表示", meta: "二年级上册 · 第四单元" },
    { label: "几分之一的读写", meta: "二年级上册 · 第四单元" }
  ],
  语文: [
    { label: "概括段落大意", meta: "三年级上册 · 阅读训练" },
    { label: "理解重点句子", meta: "三年级上册 · 阅读训练" }
  ],
  英语: [
    { label: "现在进行时句型", meta: "四年级上册 · Unit 5" },
    { label: "一般疑问句回答", meta: "四年级上册 · Unit 5" }
  ]
};

const selectedSubject = ref("数学");
const selectedTopicIndex = ref(0);
const subjectSheetOpen = ref(false);
const topicSheetOpen = ref(false);

const currentTopicOptions = computed(() => topicOptions[selectedSubject.value]);
const selectedTopic = computed(() => currentTopicOptions.value[selectedTopicIndex.value]);

const selectSubject = (label: string) => {
  selectedSubject.value = label;
  selectedTopicIndex.value = 0;
  subjectSheetOpen.value = false;
};

const selectTopic = (label: string) => {
  const index = currentTopicOptions.value.findIndex((item) => item.label === label);
  selectedTopicIndex.value = index === -1 ? 0 : index;
  topicSheetOpen.value = false;
};
</script>
